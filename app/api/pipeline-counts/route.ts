import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { getDashboardStats } from "@/lib/dashboard-stats-server";
import { reportException } from "@/lib/error-reporting";

/**
 * GET /api/pipeline-counts
 * Get pipeline counts by segment
 */
export async function GET() {
  try {
    const userId = await getUserId();
    const stats = await getDashboardStats(userId);
    
    // Return segment distribution as pipeline counts
    return NextResponse.json({ counts: stats.segmentDistribution });
  } catch (error) {
    reportException(error, {
      context: "Fetching pipeline counts",
      tags: { component: "pipeline-counts-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

