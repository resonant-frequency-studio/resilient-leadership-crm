import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { getOverdueTouchpoints } from "@/lib/touchpoints-server";
import { reportException } from "@/lib/error-reporting";

/**
 * GET /api/touchpoints/overdue
 * Get contacts with overdue touchpoints
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "3", 10);
    
    const touchpoints = await getOverdueTouchpoints(userId, limit);
    return NextResponse.json({ touchpoints });
  } catch (error) {
    reportException(error, {
      context: "Fetching overdue touchpoints",
      tags: { component: "touchpoints-overdue-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

