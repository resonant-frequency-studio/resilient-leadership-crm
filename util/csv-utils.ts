import { Contact } from "@/types/firestore";
import { serverTimestamp } from "firebase/firestore";

/**
 * Normalizes an email address to create a consistent contactId
 */
export function normalizeContactId(email: string): string {
  return email.replace(/[^a-z0-9]/gi, "_");
}

/**
 * Transforms a CSV row into a Contact object
 * @param row - CSV row data
 * @param contactId - Contact ID for the contact
 * @param enrichedData - Optional enriched data from People API (used to fill gaps if CSV doesn't have the field)
 */
export function csvRowToContact(
  row: Record<string, string>,
  contactId: string,
  enrichedData?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null }
): Partial<Contact> {
  const email = row.Email?.trim().toLowerCase();
  if (!email) {
    throw new Error("Email is required");
  }

  // CSV data takes precedence, but use enriched data to fill gaps
  const firstName = row.FirstName?.trim() || enrichedData?.firstName || null;
  const lastName = row.LastName?.trim() || enrichedData?.lastName || null;
  const company = row.Company?.trim() || enrichedData?.company || null;
  // Photo URL only comes from enrichment (not from CSV)
  const photoUrl = enrichedData?.photoUrl || null;

  return {
    contactId,
    primaryEmail: email,
    firstName,
    lastName,
    company,
    photoUrl,

    // Imported CRM fields
    summary: row.Summary?.trim() || null,
    // Note: actionItems is handled separately and converted to subcollection format
    sentiment: row.Sentiment?.trim() || null,
    relationshipInsights: row.RelationshipInsights?.trim() || null,
    painPoints: row.PainPoints?.trim() || null,
    coachingThemes: row.CoachingThemes?.trim() || null,
    outreachDraft: row.OutreachDraft?.trim() || null,
    notes: row.Notes?.trim() || null,
    tags: row.Tags ? row.Tags.split(",").map((t: string) => t.trim()) : [],
    segment: row.Segment?.trim() || null,
    leadSource: row.LeadSource?.trim() || null,
    engagementScore: row.EngagementScore ? Number(row.EngagementScore) : null,

    nextTouchpointDate: row.NextTouchpointDate?.trim() || null,
    nextTouchpointMessage: row.NextTouchpointMessage?.trim() || null,

    // System fields from CSV
    lastEmailDate: row.LastEmailDate?.trim() || null,
    threadCount: row.ThreadCount ? Number(row.ThreadCount) : 0,

    // Meta
    updatedAt: serverTimestamp(),
  };
}

