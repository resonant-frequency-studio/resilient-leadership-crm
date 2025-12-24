import { getAccessToken } from "@/lib/gmail/get-access-token";
import { getContactFromEmail } from "./get-contact-from-email";
import { extractNamesFromEmail } from "@/util/email-name-extraction";
import { EnrichedContactData } from "./types";
import { reportException, ErrorLevel } from "@/lib/error-reporting";

/**
 * Enrich contact data from email address using Google People API
 * Falls back to email-based name extraction if People API doesn't return name data
 * 
 * @param email - Email address to enrich
 * @param userId - User ID for accessing Google OAuth tokens
 * @returns Enriched contact data with firstName, lastName, company, and source
 */
export async function enrichContactFromEmail(
  email: string,
  userId: string
): Promise<EnrichedContactData> {
  if (!email || !email.includes("@")) {
    // Invalid email, fall back to email extraction
    const extracted = extractNamesFromEmail(email || "");
    return {
      firstName: extracted.firstName,
      lastName: extracted.lastName,
      company: null,
      photoUrl: null,
      source: "email_extraction",
    };
  }

  try {
    // Get access token for People API
    // Note: getAccessToken throws if no account is linked, which we'll catch below
    const accessToken = await getAccessToken(userId);

    // Try People API first
    const peopleApiData = await getContactFromEmail(email, accessToken);

    if (peopleApiData) {
      // If we got data from People API, merge with email extraction if needed
      // Use email extraction to fill in missing name parts
      const extractedNames = extractNamesFromEmail(email);
      
      // Determine the best source for each field
      const firstName = peopleApiData.firstName || extractedNames.firstName;
      const lastName = peopleApiData.lastName || extractedNames.lastName;
      
      // If we got any name data from People API, prefer it, otherwise use email extraction
      const source = (peopleApiData.firstName || peopleApiData.lastName) ? "people_api" : "email_extraction";
      
      return {
        firstName,
        lastName,
        company: peopleApiData.company,
        photoUrl: peopleApiData.photoUrl,
        source,
      };
    }

    // People API didn't find the contact, fall back to email extraction
    const extracted = extractNamesFromEmail(email);
    return {
      firstName: extracted.firstName,
      lastName: extracted.lastName,
      company: null,
      photoUrl: null,
      source: "email_extraction",
    };
  } catch (error) {
    // Handle various error cases gracefully
    const errorMessage = error instanceof Error ? error.message : String(error);

    // If no Google account is linked or token is invalid, fall back silently
    if (
      errorMessage.includes("No Gmail account linked") ||
      errorMessage.includes("invalid_grant") ||
      errorMessage.includes("401") ||
      errorMessage.includes("403")
    ) {
      // Log but don't fail - fall back to email extraction
      reportException(error, {
        context: "Google account not linked or invalid token, falling back to email extraction",
        tags: { component: "google-people-enrichment", userId },
        extra: { email },
        level: ErrorLevel.WARNING,
      });

      const extracted = extractNamesFromEmail(email);
      return {
        firstName: extracted.firstName,
        lastName: extracted.lastName,
        company: null,
        photoUrl: null,
        source: "email_extraction",
      };
    }

    // Check if it's a 429 rate limit error - these should be handled by getContactFromEmail
    // but if they slip through, handle gracefully
    if (errorMessage.includes("429") || errorMessage.includes("Too Many Requests")) {
      reportException(error, {
        context: "Rate limit exceeded in People API, falling back to email extraction",
        tags: { component: "google-people-enrichment", userId },
        extra: { email, errorMessage },
        level: ErrorLevel.WARNING,
      });
    } else {
      // For other errors (network, etc.), log but still fall back
      reportException(error, {
        context: "Error enriching contact from People API, falling back to email extraction",
        tags: { component: "google-people-enrichment", userId },
        extra: { email, errorMessage },
        level: ErrorLevel.WARNING,
      });
    }

    // Always fall back to email extraction on error
    const extracted = extractNamesFromEmail(email);
    return {
      firstName: extracted.firstName,
      lastName: extracted.lastName,
      company: null,
      photoUrl: null,
      source: "email_extraction",
    };
  }
}

