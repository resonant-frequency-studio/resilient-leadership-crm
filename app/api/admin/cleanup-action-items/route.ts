import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { adminDb } from "@/lib/firebase-admin";
import { ErrorLevel, reportException, reportMessage } from "@/lib/error-reporting";
import { Timestamp } from "firebase-admin/firestore";

/**
 * POST /api/admin/cleanup-action-items
 * Bulk delete all action items from contacts whose last email was more than 90 days old
 */
export async function POST() {
  try {
    const userId = await getUserId();

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
    const cutoffTimestamp = Timestamp.fromDate(cutoffDate);

    reportMessage(
      `Cleaning up action items from contacts with lastEmailDate older than ${cutoffDate.toISOString()}`,
      ErrorLevel.INFO
    );

    // Get all contacts
    const contactsSnapshot = await adminDb
      .collection(`users/${userId}/contacts`)
      .get();

    if (contactsSnapshot.empty) {
      return NextResponse.json({
        success: true,
        message: "No contacts found",
        stats: {
          totalContactsChecked: 0,
          contactsWithOldEmails: 0,
          totalActionItemsDeleted: 0,
          contactsProcessed: 0,
          errors: 0,
        },
      });
    }

    const contactsToProcess: Array<{ id: string; lastEmailDate: Date }> = [];

    // Filter contacts with lastEmailDate older than 90 days
    for (const doc of contactsSnapshot.docs) {
      const contact = doc.data();
      const lastEmailDate = contact.lastEmailDate;

      if (!lastEmailDate) {
        // If no lastEmailDate, skip this contact
        continue;
      }

      // Parse the date
      let dateObj: Date | null = null;
      if (lastEmailDate instanceof Date) {
        dateObj = lastEmailDate;
      } else if (typeof lastEmailDate === "string") {
        dateObj = new Date(lastEmailDate);
      } else if (lastEmailDate instanceof Timestamp) {
        dateObj = lastEmailDate.toDate();
      } else if (typeof lastEmailDate === "object" && lastEmailDate !== null) {
        // Firestore Timestamp format
        if ("toDate" in lastEmailDate) {
          dateObj = (lastEmailDate as { toDate: () => Date }).toDate();
        } else if ("_seconds" in lastEmailDate) {
          const seconds = (lastEmailDate as { _seconds: number })._seconds;
          dateObj = new Date(seconds * 1000);
        }
      }

      if (!dateObj || isNaN(dateObj.getTime())) {
        continue;
      }

      // Check if lastEmailDate is older than 90 days
      const lastEmailTimestamp = Timestamp.fromDate(dateObj);
      if (lastEmailTimestamp < cutoffTimestamp) {
        contactsToProcess.push({ id: doc.id, lastEmailDate: dateObj });
      }
    }

    reportMessage(
      `Found ${contactsToProcess.length} contacts with old emails`,
      ErrorLevel.INFO
    );

    // Process each contact and delete all action items
    let totalActionItemsDeleted = 0;
    let contactsProcessed = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const contact of contactsToProcess) {
      try {
        // Get all action items for this contact
        const actionItemsSnapshot = await adminDb
          .collection(`users/${userId}/contacts/${contact.id}/actionItems`)
          .get();

        const actionItemCount = actionItemsSnapshot.size;

        if (actionItemCount === 0) {
          // No action items to delete, but still count as processed
          contactsProcessed++;
          continue;
        }

        // Delete all action items in batches (Firestore batch limit is 500)
        const batchSize = 500;
        const actionItemDocs = actionItemsSnapshot.docs;

        for (let i = 0; i < actionItemDocs.length; i += batchSize) {
          const batch = adminDb.batch();
          const batchDocs = actionItemDocs.slice(i, i + batchSize);

          for (const doc of batchDocs) {
            batch.delete(doc.ref);
          }

          await batch.commit();
        }

        totalActionItemsDeleted += actionItemCount;
        contactsProcessed++;

        reportMessage(
          `Deleted ${actionItemCount} action items from contact ${contact.id}`,
          ErrorLevel.INFO
        );
      } catch (error) {
        errorCount++;
        const errorMsg = error instanceof Error ? error.message : "Unknown error";
        errors.push(`Contact ${contact.id}: ${errorMsg}`);
        reportException(error, {
          context: "Deleting action items for contact during cleanup",
          tags: {
            component: "cleanup-action-items",
            contactId: contact.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Cleanup complete: Deleted ${totalActionItemsDeleted} action items from ${contactsProcessed} contacts, ${errorCount} errors`,
      stats: {
        totalContactsChecked: contactsSnapshot.size,
        contactsWithOldEmails: contactsToProcess.length,
        totalActionItemsDeleted,
        contactsProcessed,
        errors: errorCount,
        errorsDetails: errors.slice(0, 10), // First 10 errors
      },
    });
  } catch (error) {
    reportException(error, {
      context: "Cleanup action items script error",
      tags: { component: "cleanup-action-items" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

