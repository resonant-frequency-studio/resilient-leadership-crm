import { deleteGoogleEvent, DeleteEventOptions } from "./write-calendar-event";

/**
 * Delete a calendar event from Google Calendar
 * This is a convenience wrapper around deleteGoogleEvent
 */
export async function deleteCalendarEvent(
  options: DeleteEventOptions
): Promise<void> {
  return deleteGoogleEvent(options);
}

