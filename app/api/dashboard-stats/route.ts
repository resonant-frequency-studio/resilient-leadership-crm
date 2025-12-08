import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { getDashboardStats } from "@/lib/dashboard-stats-server";
import { reportException } from "@/lib/error-reporting";

/**
 * GET /api/dashboard-stats
 * Get dashboard statistics for the authenticated user
 */
export async function GET() {
  try {
    const userId = await getUserId();
    const stats = await getDashboardStats(userId);
    return NextResponse.json({ stats });
  } catch (error) {
    reportException(error, {
      context: "Fetching dashboard stats",
      tags: { component: "dashboard-stats-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

