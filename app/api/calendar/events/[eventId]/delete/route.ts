import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-utils";
import { adminDb } from "@/lib/firebase-admin";
import { reportException } from "@/lib/error-reporting";
import { toUserFriendlyError } from "@/lib/error-utils";
import { deleteGoogleEvent } from "@/lib/calendar/write-calendar-event";

/**
 * DELETE /api/calendar/events/[eventId]/delete
 * Delete a calendar event from Google Calendar and Firestore cache
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const userId = await getUserId();
    const { eventId } = await params;

    // Get cached event to retrieve etag and check if it exists
    const eventsCollection = adminDb
      .collection("users")
      .doc(userId)
      .collection("calendarEvents");

    const eventDoc = await eventsCollection.doc(eventId).get();

    if (!eventDoc.exists) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    const cachedEvent = eventDoc.data();
    const etag = cachedEvent?.etag;

    // Delete from Google Calendar
    try {
      await deleteGoogleEvent({
        userId,
        calendarId: undefined, // Use default 'primary'
        googleEventId: eventId,
        etag, // Optional - for conflict detection
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // If event is already deleted in Google (404), still remove from cache
      if (errorMessage.includes("404") || errorMessage.includes("not found")) {
        // Continue to remove from cache
      } else {
        // Re-throw other errors
        throw error;
      }
    }

    // Remove from Firestore cache
    await eventsCollection.doc(eventId).delete();

    // TODO: If linked to touchpoint, update touchpoint status
    // This will be handled in PR 5

    return NextResponse.json({
      ok: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    
    reportException(err, {
      context: "Deleting calendar event",
      tags: { component: "calendar-delete-api" },
      extra: { originalError: errorMessage },
    });
    
    const friendlyError = toUserFriendlyError(err);
    
    // Check for auth errors
    if (errorMessage.includes("Calendar access") || errorMessage.includes("permission")) {
      return NextResponse.json(
        { 
          error: friendlyError,
          ok: false,
          requiresReauth: true,
        },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { 
        error: friendlyError,
        ok: false,
      },
      { status: 500 }
    );
  }
}

