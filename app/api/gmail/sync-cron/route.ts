import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { runSyncJob } from "@/lib/gmail/sync-job-runner";
import { reportException } from "@/lib/error-reporting";
import { getAllUsersWithGmailAccess } from "@/lib/calendar/cron-helpers";

/**
 * POST /api/gmail/sync-cron
 * Internal cron endpoint for syncing Gmail threads
 * This endpoint is designed to be called by Vercel cron jobs
 * It syncs Gmail threads for all users with Gmail access
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

    // Get all users with Gmail access and sync their threads
    const users = await getAllUsersWithGmailAccess(adminDb);
    let totalThreads = 0;
    let totalMessages = 0;
    let totalErrors = 0;
    const errors: string[] = [];

    for (const userId of users) {
      try {
        const result = await runSyncJob({
          userId,
          type: "auto", // Auto-detect incremental vs full sync
        });
        if (result.success) {
          totalThreads += result.processedThreads;
          totalMessages += result.processedMessages;
        } else {
          totalErrors++;
          errors.push(`User ${userId}: ${result.errorMessage || "Sync failed"}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        errors.push(`User ${userId}: ${errorMessage}`);
        totalErrors++;
        reportException(error, {
          context: "Syncing Gmail threads for user in cron",
          tags: { component: "gmail-sync-cron", userId },
        });
      }
    }

    return NextResponse.json({
      ok: true,
      usersProcessed: users.length,
      totalThreads,
      totalMessages,
      totalErrors,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    reportException(err, {
      context: "Gmail sync cron job",
      tags: { component: "gmail-sync-cron" },
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

