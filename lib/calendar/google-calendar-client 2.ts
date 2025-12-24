import { reportException } from "@/lib/error-reporting";

export interface GoogleCalendarEventPayload {
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string; // ISO 8601 for timed events
    date?: string; // YYYY-MM-DD for all-day events
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  attendees?: Array<{
    email: string;
    displayName?: string;
    responseStatus?: string;
  }>;
  etag: string;
  updated?: string; // ISO 8601 timestamp
  status?: string;
}

/**
 * Thin wrapper around Google Calendar API
 * Handles token refresh, error mapping, and retry logic
 */
export class GoogleCalendarClient {
  constructor(private accessToken: string) {}

  /**
   * Create a new calendar event
   */
  async createEvent(
    calendarId: string,
    payload: GoogleCalendarEventPayload
  ): Promise<GoogleCalendarEvent> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await this.handleError(response, "createEvent");
      }

      const data = await response.json();
      return data as GoogleCalendarEvent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      reportException(error, {
        context: "Creating calendar event",
        tags: { component: "google-calendar-client", calendarId },
      });
      throw new Error(`Failed to create calendar event: ${errorMessage}`);
    }
  }

  /**
   * Update an existing calendar event
   * @param ifMatchEtag - Optional etag for conflict detection (If-Match header)
   */
  async updateEvent(
    calendarId: string,
    eventId: string,
    payload: Partial<GoogleCalendarEventPayload>,
    ifMatchEtag?: string
  ): Promise<GoogleCalendarEvent> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

    const headers: HeadersInit = {
      Authorization: `Bearer ${this.accessToken}`,
      "Content-Type": "application/json",
    };

    // Add If-Match header for conflict detection
    if (ifMatchEtag) {
      headers["If-Match"] = ifMatchEtag;
    }

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        await this.handleError(response, "updateEvent", {
          calendarId,
          eventId,
          ifMatchEtag,
        });
      }

      const data = await response.json();
      return data as GoogleCalendarEvent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      reportException(error, {
        context: "Updating calendar event",
        tags: { component: "google-calendar-client", calendarId, eventId },
      });
      throw new Error(`Failed to update calendar event: ${errorMessage}`);
    }
  }

  /**
   * Delete a calendar event
   * @param ifMatchEtag - Optional etag for conflict detection (If-Match header)
   */
  async deleteEvent(
    calendarId: string,
    eventId: string,
    ifMatchEtag?: string
  ): Promise<void> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

    const headers: HeadersInit = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    // Add If-Match header for conflict detection
    if (ifMatchEtag) {
      headers["If-Match"] = ifMatchEtag;
    }

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        // 404 is acceptable for delete (event already deleted)
        if (response.status === 404) {
          return;
        }
        await this.handleError(response, "deleteEvent", {
          calendarId,
          eventId,
          ifMatchEtag,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      reportException(error, {
        context: "Deleting calendar event",
        tags: { component: "google-calendar-client", calendarId, eventId },
      });
      throw new Error(`Failed to delete calendar event: ${errorMessage}`);
    }
  }

  /**
   * Get a single event by ID
   */
  async getEvent(
    calendarId: string,
    eventId: string
  ): Promise<GoogleCalendarEvent> {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${encodeURIComponent(eventId)}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        await this.handleError(response, "getEvent", {
          calendarId,
          eventId,
        });
      }

      const data = await response.json();
      return data as GoogleCalendarEvent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      reportException(error, {
        context: "Getting calendar event",
        tags: { component: "google-calendar-client", calendarId, eventId },
      });
      throw new Error(`Failed to get calendar event: ${errorMessage}`);
    }
  }

  /**
   * Map Google Calendar API errors to user-friendly messages
   */
  private async handleError(
    response: Response,
    operation: string,
    context?: Record<string, unknown>
  ): Promise<never> {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || response.statusText;
    const errorCode = errorData.error?.code || response.status;

    // Map specific error codes
    let userMessage = `Failed to ${operation}: ${errorMessage}`;
    let errorType = "UNKNOWN_ERROR";

    switch (response.status) {
      case 401:
      case 403:
        userMessage = "Calendar access denied. Please reconnect your Google account with Calendar permissions.";
        errorType = "AUTH_ERROR";
        break;
      case 404:
        userMessage = "Calendar event not found. It may have been deleted.";
        errorType = "NOT_FOUND";
        break;
      case 409:
      case 412:
        // Conflict - etag mismatch
        userMessage = "Event was modified elsewhere. Please refresh and try again.";
        errorType = "CONFLICT";
        break;
      case 429:
        userMessage = "Too many requests. Please wait a moment and try again.";
        errorType = "RATE_LIMIT";
        break;
      default:
        if (errorCode >= 500) {
          userMessage = "Google Calendar service error. Please try again later.";
          errorType = "SERVICE_ERROR";
        }
    }

    const error = new Error(userMessage) as Error & {
      errorType?: string;
      statusCode?: number;
      conflict?: boolean;
      googleEvent?: GoogleCalendarEvent;
    };

    error.errorType = errorType;
    error.statusCode = response.status;

    // Mark conflicts for special handling
    if (response.status === 409 || response.status === 412) {
      error.conflict = true;
    }

    reportException(error, {
      context: `Google Calendar API error in ${operation}`,
      tags: {
        component: "google-calendar-client",
        operation,
        errorType,
        statusCode: String(response.status),
      },
      extra: {
        errorData,
        context,
      },
    });

    throw error;
  }
}

