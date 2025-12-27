import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { runContactsSyncJob } from "@/lib/google-contacts/sync-job-runner";
import { reportException } from "@/lib/error-reporting";
import { getAllUsersWithContactsAccess } from "@/lib/calendar/cron-helpers";

/**
 * POST /api/contacts/sync-cron
 * Internal cron endpoint for syncing contacts
 * This endpoint is designed to be called by Vercel cron jobs
 * It syncs contacts for all users with Contacts access
 */
export async function POST(req: Request) {
  try {
    // Validate this is a Vercel cron request
    const authHeader = req.headers.get("authorization");
    const url = new URL(req.url);
    const secretParam = url.searchParams.get("secret");
    const cronSecret = process.env.CRON_SECRET;
    const isVercelCron = req.headers.get("x-vercel-cron") !== null;

    // Allow if it's a Vercel cron request OR if secret is provided (header or query param)
    const isValid =
      isVercelCron ||
      (cronSecret &&
        (authHeader === `Bearer ${cronSecret}` || secretParam === cronSecret));

    if (!isValid) {
      return NextResponse.json(
        { error: "Unauthorized - cron secret or Vercel cron header required" },
        { status: 401 }
      );
    }

    // Get all users with Contacts access and sync their contacts
    const users = await getAllUsersWithContactsAccess(adminDb);
    let totalImported = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    const errors: string[] = [];

    for (const userId of users) {
      try {
        const result = await runContactsSyncJob({
          userId,
        });
        if (result.success) {
          totalImported += result.processedContacts;
          totalSkipped += result.skippedContacts;
        } else {
          totalErrors++;
          errors.push(`User ${userId}: ${result.errorMessage || "Sync failed"}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`User ${userId}: ${errorMessage}`);
        totalErrors++;
        reportException(error, {
          context: "Syncing contacts for user in cron",
          tags: { component: "contacts-sync-cron", userId },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      usersProcessed: users.length,
      totalImported,
      totalSkipped,
      totalErrors,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    reportException(err, {
      context: "Contacts sync cron job",
      tags: { component: "contacts-sync-cron" },
      extra: { originalError: errorMessage },
    });
    
    return NextResponse.json(
      { 
        ok: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

