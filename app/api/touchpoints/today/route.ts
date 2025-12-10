import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { getTodayTouchpoints } from "@/lib/touchpoints-server";
import { reportException } from "@/lib/error-reporting";

/**
 * GET /api/touchpoints/today
 * Get contacts with touchpoints due today
 */
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "3", 10);
    
    const touchpoints = await getTodayTouchpoints(userId, limit);
    return NextResponse.json({ touchpoints });
  } catch (error) {
    reportException(error, {
      context: "Fetching today touchpoints",
      tags: { component: "touchpoints-today-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

