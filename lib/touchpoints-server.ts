import { Contact } from "@/types/firestore";
import { reportException } from "@/lib/error-reporting";
import { getDaysUntilTouchpoint } from "@/util/date-utils-server";

/**
 * Contact with touchpoint information
 */
export interface ContactWithTouchpoint extends Contact {
  id: string;
  touchpointDate: Date;
  daysUntil: number;
  needsReminder: boolean;
}

/**
 * Helper function to safely get touchpoint date
 */
function getTouchpointDate(date: unknown): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (typeof date === "string") return new Date(date);
  if (typeof date === "object" && "toDate" in date) {
    return (date as { toDate: () => Date }).toDate();
  }
  return null;
}

/**
 * Get contacts with touchpoints due today
 */
export async function getTodayTouchpoints(
  userId: string,
  limit: number = 3
): Promise<ContactWithTouchpoint[]> {
  try {
    const { getAllContactsForUserUncached } = await import("./contacts-server");
    const contacts = await getAllContactsForUserUncached(userId);
    const serverTime = new Date();
    const todayStart = new Date(serverTime);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(serverTime);
    todayEnd.setHours(23, 59, 59, 999);

    const touchpoints: ContactWithTouchpoint[] = [];

    for (const contact of contacts) {
      if (contact.archived) continue;
      
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
      if (!touchpointDate) continue;
      
      const status = contact.touchpointStatus;
      if (status === "completed" || status === "cancelled") continue;

      // Check if touchpoint is due today
      if (touchpointDate >= todayStart && touchpointDate <= todayEnd) {
        const daysUntil = getDaysUntilTouchpoint(contact.nextTouchpointDate, serverTime) || 0;
        touchpoints.push({
          ...contact,
          id: contact.contactId,
          touchpointDate,
          daysUntil,
          needsReminder: false,
        });
      }
    }

    // Sort by time of day (earliest first)
    touchpoints.sort((a, b) => a.touchpointDate.getTime() - b.touchpointDate.getTime());
    
    return touchpoints.slice(0, limit);
  } catch (error) {
    reportException(error, {
      context: "Getting today touchpoints",
      tags: { component: "touchpoints-server", userId },
    });
    throw error;
  }
}

/**
 * Get contacts with overdue touchpoints
 */
export async function getOverdueTouchpoints(
  userId: string,
  limit: number = 3
): Promise<ContactWithTouchpoint[]> {
  try {
    const { getAllContactsForUserUncached } = await import("./contacts-server");
    const contacts = await getAllContactsForUserUncached(userId);
    const serverTime = new Date();

    const touchpoints: ContactWithTouchpoint[] = [];

    for (const contact of contacts) {
      if (contact.archived) continue;
      
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
      if (!touchpointDate) continue;
      
      const status = contact.touchpointStatus;
      if (status === "completed" || status === "cancelled") continue;

      // Only include overdue (past dates)
      if (touchpointDate < serverTime) {
        const daysUntil = getDaysUntilTouchpoint(contact.nextTouchpointDate, serverTime) || 0;
        touchpoints.push({
          ...contact,
          id: contact.contactId,
          touchpointDate,
          daysUntil,
          needsReminder: false,
        });
      }
    }

    // Sort by most overdue first (oldest first)
    touchpoints.sort((a, b) => a.touchpointDate.getTime() - b.touchpointDate.getTime());
    
    return touchpoints.slice(0, limit);
  } catch (error) {
    reportException(error, {
      context: "Getting overdue touchpoints",
      tags: { component: "touchpoints-server", userId },
    });
    throw error;
  }
}

/**
 * Get contacts with upcoming touchpoints
 */
export async function getUpcomingTouchpoints(
  userId: string,
  limit: number = 3
): Promise<ContactWithTouchpoint[]> {
  try {
    const { getAllContactsForUserUncached } = await import("./contacts-server");
    const contacts = await getAllContactsForUserUncached(userId);
    const serverTime = new Date();
    const maxDaysAhead = 60;
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + maxDaysAhead);

    const touchpoints: ContactWithTouchpoint[] = [];

    for (const contact of contacts) {
      if (contact.archived) continue;
      
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
      if (!touchpointDate) continue;
      
      const status = contact.touchpointStatus;
      if (status === "completed" || status === "cancelled") continue;

      // Only include future dates (not overdue) within next 60 days
      if (touchpointDate >= serverTime && touchpointDate <= maxDate) {
        const daysUntil = getDaysUntilTouchpoint(contact.nextTouchpointDate, serverTime) || 0;
        const needsReminder = daysUntil <= 7 && daysUntil >= 0;
        touchpoints.push({
          ...contact,
          id: contact.contactId,
          touchpointDate,
          daysUntil,
          needsReminder,
        });
      }
    }

    // Sort by soonest first
    touchpoints.sort((a, b) => a.touchpointDate.getTime() - b.touchpointDate.getTime());
    
    return touchpoints.slice(0, limit);
  } catch (error) {
    reportException(error, {
      context: "Getting upcoming touchpoints",
      tags: { component: "touchpoints-server", userId },
    });
    throw error;
  }
}

