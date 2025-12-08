import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { getLastSyncForUser, getSyncHistoryForUser } from "@/lib/sync-jobs-server";
import { reportException } from "@/lib/error-reporting";

/**
 * GET /api/sync-jobs?history=true
 * Get sync job data for the authenticated user
 */
export async function GET(req: Request) {
  try {
    const userId = await getUserId();
    const url = new URL(req.url);
    const includeHistory = url.searchParams.get("history") === "true";
    
    if (includeHistory) {
      const syncHistory = await getSyncHistoryForUser(userId, 10);
      return NextResponse.json({ syncHistory });
    } else {
      const lastSync = await getLastSyncForUser(userId);
      return NextResponse.json({ lastSync });
    }
  } catch (error) {
    reportException(error, {
      context: "Fetching sync jobs",
      tags: { component: "sync-jobs-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

