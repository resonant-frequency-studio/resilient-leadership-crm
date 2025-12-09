import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { reportException } from "@/lib/error-reporting";
import { revalidateTag } from "next/cache";

/**
 * GET /api/admin/cleanup-tags
 * Get all tags with usage counts
 */
export async function GET() {
  try {
    const userId = await getUserId();
    
    // Get all contacts
    const contactsSnapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("contacts")
      .get();

    // Count tag usage
    const tagUsage: Record<string, number> = {};
    const contactTags: Array<{ contactId: string; tags: string[] }> = [];

    contactsSnapshot.forEach((doc) => {
      const data = doc.data();
      const tags = data.tags || [];
      contactTags.push({ contactId: doc.id, tags });
      
      tags.forEach((tag: string) => {
        tagUsage[tag] = (tagUsage[tag] || 0) + 1;
      });
    });

    // Convert to array and sort by usage (descending)
    const tagsWithUsage = Object.entries(tagUsage)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      success: true,
      tags: tagsWithUsage,
      totalContacts: contactsSnapshot.size,
      totalUniqueTags: tagsWithUsage.length,
    });
  } catch (error) {
    reportException(error, {
      context: "Getting tag usage stats",
      tags: { component: "cleanup-tags-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/cleanup-tags
 * Remove specified tags from all contacts
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const { tagsToRemove, dryRun = false } = body;

    if (!Array.isArray(tagsToRemove) || tagsToRemove.length === 0) {
      return NextResponse.json(
        { error: "tagsToRemove must be a non-empty array" },
        { status: 400 }
      );
    }

    // Get all contacts
    const contactsSnapshot = await adminDb
      .collection("users")
      .doc(userId)
      .collection("contacts")
      .get();

    let processed = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    const errorDetails: string[] = [];
    const details: Array<{
      contactId: string;
      email: string;
      action: "updated" | "skipped" | "error";
      tagsRemoved?: string[];
      error?: string;
    }> = [];

    const batchSize = 10;
    const contacts = contactsSnapshot.docs;

    for (let i = 0; i < contacts.length; i += batchSize) {
      const batch = contacts.slice(i, i + batchSize);

      const promises = batch.map(async (doc) => {
        try {
          const data = doc.data();
          const currentTags = (data.tags || []) as string[];
          
          // Filter out tags to remove
          const newTags = currentTags.filter(
            (tag) => !tagsToRemove.includes(tag)
          );

          // Skip if no changes
          if (currentTags.length === newTags.length) {
            return {
              success: true,
              contactId: doc.id,
              email: data.primaryEmail || "unknown",
              action: "skipped" as const,
              tagsRemoved: [],
            };
          }

          const tagsRemoved = currentTags.filter((tag) =>
            tagsToRemove.includes(tag)
          );

          if (!dryRun) {
            await doc.ref.update({
              tags: newTags.length > 0 ? newTags : null,
              updatedAt: FieldValue.serverTimestamp(),
            });
          }

          return {
            success: true,
            contactId: doc.id,
            email: data.primaryEmail || "unknown",
            action: "updated" as const,
            tagsRemoved,
          };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          return {
            success: false,
            contactId: doc.id,
            email: doc.data().primaryEmail || "unknown",
            action: "error" as const,
            error: errorMsg,
          };
        }
      });

      const results = await Promise.all(promises);

      results.forEach((result) => {
        processed++;
        if (result.success) {
          if (result.action === "updated") {
            updated++;
          } else {
            skipped++;
          }
          details.push({
            contactId: result.contactId,
            email: result.email,
            action: result.action,
            tagsRemoved: result.tagsRemoved,
          });
        } else {
          errors++;
          errorDetails.push(`${result.contactId}: ${result.error}`);
          details.push({
            contactId: result.contactId,
            email: result.email,
            action: "error",
            error: result.error,
          });
        }
      });
    }

    // Invalidate cache if any updates were made
    if (!dryRun && updated > 0) {
      revalidateTag("contacts", "max");
      revalidateTag(`contacts-${userId}`, "max");
      // Invalidate individual contact caches
      details
        .filter((d) => d.action === "updated")
        .forEach((d) => {
          revalidateTag(`contact-${userId}-${d.contactId}`, "max");
        });
    }

    return NextResponse.json({
      success: true,
      message: dryRun
        ? `Dry run completed. Would update ${updated} contact(s).`
        : `Successfully removed tags from ${updated} contact(s).`,
      dryRun,
      processed,
      updated,
      skipped,
      errors,
      errorDetails: errorDetails.length > 0 ? errorDetails : undefined,
      details: details.slice(0, 100), // Limit details to first 100
    });
  } catch (error) {
    reportException(error, {
      context: "Cleaning up tags",
      tags: { component: "cleanup-tags-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

