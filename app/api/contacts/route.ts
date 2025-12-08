import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { getAllContactsForUser } from "@/lib/contacts-server";
import { reportException } from "@/lib/error-reporting";

/**
 * GET /api/contacts
 * Get all contacts for the authenticated user
 */
export async function GET() {
  try {
    const userId = await getUserId();
    const contacts = await getAllContactsForUser(userId);
    return NextResponse.json({ contacts });
  } catch (error) {
    reportException(error, {
      context: "Fetching contacts",
      tags: { component: "contacts-api" },
    });
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

