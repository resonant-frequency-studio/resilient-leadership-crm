import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { adminDb } from "@/lib/firebase-admin";
import { contactsPath } from "@/lib/firestore-paths";
import { Contact } from "@/types/firestore";
import { FieldValue } from "firebase-admin/firestore";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { reportException } from "@/lib/error-reporting";

/**
 * POST /api/admin/bulk-unlink-contacts-from-events
 * Bulk unlink all contacts from calendar events
 * This clears old links so the new exact email matching logic can re-link only valid matches
 * 
 * Body:
 *   - dryRun: boolean (default: false) - If true, only reports what would be unlinked
 *   - alsoUnlinkEvents: boolean (default: true) - If true, also clears matchedContactId from events (removes from timeline)
 *   - batchSize: number (default: 50) - Number of contacts to process per batch
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { 
      dryRun = false, 
      alsoUnlinkEvents = true,
      batchSize = 50 
    } = await request.json();

    const results = {
      contactsProcessed: 0,
      contactsUnlinked: 0,
      contactsSkipped: 0,
      contactsErrors: 0,
      eventsProcessed: 0,
      eventsUnlinked: 0,
      eventsSkipped: 0,
      eventsErrors: 0,
      contactDetails: [] as Array<{
        contactId: string;
        email: string;
        linkedEventId: string | null;
        action: "unlinked" | "skipped" | "error";
        error?: string;
      }>,
      eventDetails: [] as Array<{
        eventId: string;
        eventTitle: string;
        matchedContactId: string | null;
        action: "unlinked" | "skipped" | "error";
        error?: string;
      }>,
    };

    // Step 1: Clear matchedContactId from ALL events (this clears the timeline)
    // This is the main issue - events incorrectly linked to contacts
    if (alsoUnlinkEvents) {
      const eventsRef = adminDb
        .collection("users")
        .doc(userId)
        .collection("calendarEvents");
      
      let lastEventDoc: QueryDocumentSnapshot | null = null;
      let hasMoreEvents = true;
      const batchSizeForQuery = Math.min(batchSize, 50);

      while (hasMoreEvents) {
        try {
          let query = eventsRef
            .where("matchedContactId", "!=", null)
            .limit(batchSizeForQuery);
          
          if (lastEventDoc) {
            query = query.startAfter(lastEventDoc);
          }

          const snapshot = await query.get();
          
          if (snapshot.empty) {
            hasMoreEvents = false;
            break;
          }

          for (const eventDoc of snapshot.docs) {
            results.eventsProcessed++;
            const eventData = eventDoc.data();
            const matchedContactId = eventData.matchedContactId || null;
            const eventTitle = eventData.title || "Untitled Event";

            try {
              if (dryRun) {
                results.eventsUnlinked++;
                results.eventDetails.push({
                  eventId: eventDoc.id,
                  eventTitle,
                  matchedContactId,
                  action: "unlinked",
                });
              } else {
                // Clear matchedContactId and related fields from event
                await eventDoc.ref.update({
                  matchedContactId: FieldValue.delete(),
                  matchConfidence: FieldValue.delete(),
                  matchMethod: FieldValue.delete(),
                  contactSnapshot: FieldValue.delete(),
                  // Keep matchOverriddenByUser and matchDeniedContactIds for user preferences
                  updatedAt: FieldValue.serverTimestamp(),
                });

                results.eventsUnlinked++;
                results.eventDetails.push({
                  eventId: eventDoc.id,
                  eventTitle,
                  matchedContactId,
                  action: "unlinked",
                });
              }
            } catch (error) {
              results.eventsErrors++;
              const errorMessage = error instanceof Error ? error.message : String(error);
              results.eventDetails.push({
                eventId: eventDoc.id,
                eventTitle,
                matchedContactId,
                action: "error",
                error: errorMessage,
              });
              reportException(error as Error, {
                context: "Unlinking event from contact",
                tags: { 
                  component: "bulk-unlink-contacts-from-events", 
                  userId, 
                  eventId: eventDoc.id,
                  contactId: matchedContactId 
                },
              });
            }
          }

          lastEventDoc = snapshot.docs[snapshot.docs.length - 1];
          hasMoreEvents = snapshot.docs.length === batchSizeForQuery;

          // Small delay between batches to avoid quota issues
          if (hasMoreEvents) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("Quota exceeded")) {
            return NextResponse.json({
              error: "Firestore quota exceeded",
              message: "You have hit your Firestore quota limit. Please wait a few hours for the quota to reset, or upgrade your Firebase plan.",
              ...results,
              quotaLimitReached: true,
            }, { status: 429 });
          }
          throw error;
        }
      }
    }

    // Step 2: Clear linkedGoogleEventId from contacts (touchpoint links)
    const contactsRef = adminDb.collection(contactsPath(userId));
    let lastContactDoc: QueryDocumentSnapshot | null = null;
    let hasMoreContacts = true;
    const batchSizeForQuery = Math.min(batchSize, 50);

    while (hasMoreContacts) {
      try {
        let query = contactsRef
          .where("linkedGoogleEventId", "!=", null)
          .limit(batchSizeForQuery);
        
        if (lastContactDoc) {
          query = query.startAfter(lastContactDoc);
        }

        const snapshot = await query.get();
        
        if (snapshot.empty) {
          hasMoreContacts = false;
          break;
        }

        const contacts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as (Contact & { id: string })[];

        for (const contact of contacts) {
          results.contactsProcessed++;
          const linkedEventId = contact.linkedGoogleEventId || null;

          try {
            if (dryRun) {
              results.contactsUnlinked++;
              results.contactDetails.push({
                contactId: contact.id,
                email: contact.primaryEmail || "no email",
                linkedEventId,
                action: "unlinked",
              });
            } else {
              // Clear touchpoint link fields from contact
              await adminDb
                .collection(contactsPath(userId))
                .doc(contact.id)
                .update({
                  linkedGoogleEventId: FieldValue.delete(),
                  linkedGoogleCalendarId: FieldValue.delete(),
                  linkStatus: FieldValue.delete(),
                  updatedAt: FieldValue.serverTimestamp(),
                });

              results.contactsUnlinked++;
              results.contactDetails.push({
                contactId: contact.id,
                email: contact.primaryEmail || "no email",
                linkedEventId,
                action: "unlinked",
              });
            }
          } catch (error) {
            results.contactsErrors++;
            const errorMessage = error instanceof Error ? error.message : String(error);
            results.contactDetails.push({
              contactId: contact.id,
              email: contact.primaryEmail || "no email",
              linkedEventId,
              action: "error",
              error: errorMessage,
            });
            reportException(error as Error, {
              context: "Unlinking contact from event",
              tags: { 
                component: "bulk-unlink-contacts-from-events", 
                userId, 
                contactId: contact.id 
              },
            });
          }
        }

        lastContactDoc = snapshot.docs[snapshot.docs.length - 1];
        hasMoreContacts = snapshot.docs.length === batchSizeForQuery;

        // Small delay between batches to avoid quota issues
        if (hasMoreContacts) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("Quota exceeded")) {
          return NextResponse.json({
            error: "Firestore quota exceeded",
            message: "You have hit your Firestore quota limit. Please wait a few hours for the quota to reset, or upgrade your Firebase plan.",
            ...results,
            quotaLimitReached: true,
          }, { status: 429 });
        }
        throw error;
      }
    }

    const totalUnlinked = results.contactsUnlinked + results.eventsUnlinked;
    const totalProcessed = results.contactsProcessed + results.eventsProcessed;

    return NextResponse.json({
      success: true,
      dryRun,
      alsoUnlinkEvents,
      ...results,
      processed: totalProcessed,
      unlinked: totalUnlinked,
      message: dryRun 
        ? `Would unlink ${results.eventsUnlinked} events from timeline${alsoUnlinkEvents ? "" : " (timeline clearing disabled)"} and ${results.contactsUnlinked} contacts from touchpoint links` 
        : `Successfully unlinked ${results.eventsUnlinked} events from timeline${alsoUnlinkEvents ? "" : " (timeline clearing was disabled)"} and ${results.contactsUnlinked} contacts from touchpoint links`,
    });
  } catch (error) {
    reportException(error as Error, {
      context: "Bulk unlinking contacts from events",
      tags: { component: "bulk-unlink-contacts-from-events" },
    });

    return NextResponse.json(
      { 
        error: "Failed to bulk unlink contacts from events",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

