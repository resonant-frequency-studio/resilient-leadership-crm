import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { reportException } from "@/lib/error-reporting";
import { revalidateTag } from "next/cache";

/**
 * POST /api/contacts/bulk-segment
 * Bulk update contacts' segments
 */
export async function POST(req: Request) {
  try {
    const userId = await getUserId();
    const body = await req.json();
    const { contactIds, segment } = body;

    if (!Array.isArray(contactIds) || contactIds.length === 0) {
      return NextResponse.json(
        { error: "contactIds must be a non-empty array" },
        { status: 400 }
      );
    }

    if (segment !== null && typeof segment !== "string") {
      return NextResponse.json(
        { error: "segment must be a string or null" },
        { status: 400 }
      );
    }

    let success = 0;
    let errors = 0;
    const errorDetails: string[] = [];
    const batchSize = 10;

    // Process in batches
    for (let i = 0; i < contactIds.length; i += batchSize) {
      const batch = contactIds.slice(i, i + batchSize);
      
      const promises = batch.map(async (contactId: string) => {
        try {
          await adminDb
            .collection("users")
            .doc(userId)
            .collection("contacts")
            .doc(contactId)
            .update({
              segment: segment || null,
              updatedAt: FieldValue.serverTimestamp(),
            });
          return { success: true, contactId };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unknown error";
          return { success: false, contactId, error: errorMsg };
        }
      });

      const results = await Promise.all(promises);
      
      results.forEach((result) => {
        if (result.success) {
          success++;
        } else {
          errors++;
          errorDetails.push(`${result.contactId}: ${result.error}`);
        }
      });
    }

    // Invalidate cache if any updates succeeded
    if (success > 0) {
      revalidateTag("contacts", "max");
      revalidateTag(`contacts-${userId}`, "max");
      // Invalidate individual contact caches
      contactIds.forEach((contactId: string) => {
        revalidateTag(`contact-${userId}-${contactId}`, "max");
      });
    }

    return NextResponse.json({
      success,
      errors,
      errorDetails,
    });
  } catch (error) {
    reportException(error, {
      context: "Bulk updating contact segments",
      tags: { component: "bulk-segment-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

