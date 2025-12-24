import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { contactsPath } from "@/lib/firestore-paths";
import { Contact } from "@/types/firestore";
import { FieldValue } from "firebase-admin/firestore";
import { reportException } from "@/lib/error-reporting";
import { enrichContactFromEmail } from "@/lib/google-people/enrich-contact-from-email";
import { isWellFormedName } from "@/util/email-name-extraction";

/**
 * Check if we should update the contact
 * Only update if:
 * - firstName is missing/empty OR not well-formed, AND we can extract it, OR
 * - lastName is missing/empty OR not well-formed, AND we can extract it, OR
 * - company is missing/empty AND we can extract it
 * 
 * Do NOT update if firstName, lastName, AND company are all well-formed/present
 */
function shouldUpdateContact(
  contact: Contact,
  enriched: { firstName: string | null; lastName: string | null; company: string | null; photoUrl: string | null }
): boolean {
  const firstNameWellFormed = isWellFormedName(contact.firstName);
  const lastNameWellFormed = isWellFormedName(contact.lastName);
  const hasCompany = contact.company && contact.company.trim() !== "";
  
  // Check if existing photo is a real photo or just a default avatar
  // Google uses /cm/ path for generated avatars with initials
  const hasRealPhoto = contact.photoUrl && 
                       contact.photoUrl.trim() !== "" && 
                       !contact.photoUrl.includes('/cm/');

  // If all three name/company fields are present/well-formed AND we have a real photo, don't update
  // But always update if we have a photo and contact doesn't have a real one
  if (firstNameWellFormed && lastNameWellFormed && hasCompany && hasRealPhoto && !enriched.photoUrl) {
    return false;
  }

  const needsFirstName = !contact.firstName || contact.firstName.trim() === "" || !firstNameWellFormed;
  const needsLastName = !contact.lastName || contact.lastName.trim() === "" || !lastNameWellFormed;
  const needsCompany = !hasCompany;
  const needsPhoto = !hasRealPhoto; // Treat default avatars as "no photo"

  const hasFirstName = enriched.firstName !== null;
  const hasLastName = enriched.lastName !== null;
  const hasCompanyData = enriched.company !== null;
  const hasPhotoData = enriched.photoUrl !== null;

  return (needsFirstName && hasFirstName) || (needsLastName && hasLastName) || (needsCompany && hasCompanyData) || (needsPhoto && hasPhotoData);
}

export async function POST(request: NextRequest | Request) {
  try {
    const { userId, dryRun = false } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Get all contacts for the user
    const contactsRef = adminDb.collection(contactsPath(userId));
    const contactsSnapshot = await contactsRef.get();

    if (contactsSnapshot.empty) {
      return NextResponse.json({
        message: "No contacts found",
        processed: 0,
        updated: 0,
        skipped: 0,
        errors: 0,
        details: [],
      });
    }

    const contacts = contactsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as (Contact & { id: string })[];

    const results = {
      processed: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
        details: [] as Array<{
        contactId: string;
        email: string;
        action: "updated" | "skipped" | "error";
        enriched?: { firstName: string | null; lastName: string | null; company: string | null; photoUrl: string | null; source?: string };
        current?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null };
        new?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null };
        error?: string;
      }>,
    };

    // Process contacts sequentially with delays to respect rate limits
    // People API has quotas (typically 600 requests per minute per user)
    // Process one at a time with delays to avoid 429 errors
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      results.processed++;

      try {
        if (!contact.primaryEmail) {
          results.skipped++;
          results.details.push({
            contactId: contact.id,
            email: "no email",
            action: "skipped",
            error: "No email address",
          });
          continue;
        }

        // Enrich contact using People API (with fallback to email extraction)
        const enriched = await enrichContactFromEmail(contact.primaryEmail, userId);

        // Check if we should update
        const firstNameWellFormed = isWellFormedName(contact.firstName);
        const lastNameWellFormed = isWellFormedName(contact.lastName);
        const hasCompany = contact.company && contact.company.trim() !== "";
        // Check if existing photo is a real photo or just a default avatar
        const hasRealPhoto = contact.photoUrl && 
                             contact.photoUrl.trim() !== "" && 
                             !contact.photoUrl.includes('/cm/');

        if (!shouldUpdateContact(contact, enriched)) {
          results.skipped++;
          results.details.push({
            contactId: contact.id,
            email: contact.primaryEmail,
            action: "skipped",
            enriched: {
              ...enriched,
              source: enriched.source || undefined,
            },
            current: {
              firstName: contact.firstName || null,
              lastName: contact.lastName || null,
              company: contact.company || null,
              photoUrl: contact.photoUrl || null,
            },
            error: firstNameWellFormed && lastNameWellFormed && hasCompany && hasRealPhoto
              ? "All fields are well-formed/present"
              : "Enrichment cannot provide needed information",
          });
          continue;
        }

        // Determine what to update
        // Only update fields that are missing or not well-formed
        const updates: Partial<Contact> = {
          updatedAt: FieldValue.serverTimestamp(),
        };

        const needsFirstName = !contact.firstName || contact.firstName.trim() === "" || !firstNameWellFormed;
        const needsLastName = !contact.lastName || contact.lastName.trim() === "" || !lastNameWellFormed;
        const needsCompany = !hasCompany;
        const needsPhoto = !hasRealPhoto; // Treat default avatars as "no photo"

        if (needsFirstName && enriched.firstName) {
          updates.firstName = enriched.firstName;
        }

        if (needsLastName && enriched.lastName) {
          updates.lastName = enriched.lastName;
        }

        if (needsCompany && enriched.company) {
          updates.company = enriched.company;
        }

        if (needsPhoto && enriched.photoUrl) {
          // Update with real photo
          updates.photoUrl = enriched.photoUrl;
        } else if (needsPhoto && !enriched.photoUrl && contact.photoUrl?.includes('/cm/')) {
          // Clear default avatar URLs if no real photo found
          updates.photoUrl = null;
        }

        if (!dryRun) {
          const contactRef = adminDb.collection(contactsPath(userId)).doc(contact.id);
          await contactRef.update(updates);
        }

        results.updated++;
        results.details.push({
          contactId: contact.id,
          email: contact.primaryEmail,
          action: "updated",
          enriched: {
            ...enriched,
            source: enriched.source || undefined,
          },
          current: {
            firstName: contact.firstName || null,
            lastName: contact.lastName || null,
            company: contact.company || null,
            photoUrl: contact.photoUrl || null,
          },
          new: {
            firstName: updates.firstName || contact.firstName || null,
            lastName: updates.lastName || contact.lastName || null,
            company: updates.company || contact.company || null,
            photoUrl: updates.photoUrl || contact.photoUrl || null,
          },
        });
      } catch (error) {
        results.errors++;
        results.details.push({
          contactId: contact.id,
          email: contact.primaryEmail || "no email",
          action: "error",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }

      // Add delay between requests to respect rate limits
      // People API allows ~600 requests per minute = ~10 requests per second
      // We'll do 5 requests per second to be safe (200ms delay)
      // This gives us ~300 requests per minute, well below the limit
      if (i < contacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay between requests
      }
    }

    return NextResponse.json({
      message: dryRun ? "Dry run completed" : "Contacts enriched and updated",
      dryRun,
      ...results,
    });
  } catch (error) {
    reportException(error, {
      context: "Enriching contacts with People API",
      tags: { component: "enrich-contacts-api" },
    });
    return NextResponse.json(
      {
        error: "Failed to enrich contacts with People API",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

