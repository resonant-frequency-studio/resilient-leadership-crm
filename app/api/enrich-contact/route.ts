import { NextRequest, NextResponse } from "next/server";
import { enrichContactFromEmail } from "@/lib/google-people/enrich-contact-from-email";
import { getUserId } from "@/lib/auth-utils";
import { reportException } from "@/lib/error-reporting";

/**
 * API endpoint to enrich contact data from email using People API
 * POST /api/enrich-contact
 * Body: { email: string, userId?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, userId: providedUserId } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Use provided userId or get from session
    let userId: string;
    if (providedUserId) {
      userId = providedUserId;
    } else {
      try {
        userId = await getUserId();
      } catch {
        return NextResponse.json(
          { error: "User authentication required" },
          { status: 401 }
        );
      }
    }

    const enrichedData = await enrichContactFromEmail(email, userId);

    return NextResponse.json(enrichedData);
  } catch (error) {
    reportException(error, {
      context: "Error enriching contact from email",
      tags: { component: "enrich-contact-api" },
    });

    return NextResponse.json(
      {
        error: "Failed to enrich contact",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

