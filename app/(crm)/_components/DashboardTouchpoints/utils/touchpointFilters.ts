import { Contact } from "@/types/firestore";
import { getDaysUntilTouchpoint } from "@/util/date-utils-server";

export interface ContactWithTouchpoint extends Contact {
  id: string;
  touchpointDate: Date;
  daysUntil: number;
  needsReminder: boolean;
}

/**
 * Converts various date formats to a Date object.
 */
export const getTouchpointDate = (date: unknown): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (typeof date === "string") return new Date(date);
  if (typeof date === "object" && "toDate" in date) {
    return (date as { toDate: () => Date }).toDate();
  }
  return null;
};

/**
 * Converts various date formats to a Date object for last email dates.
 */
export const getLastEmailDate = (date: unknown): Date | null => {
  if (!date) return null;
  if (date instanceof Date) return date;
  if (typeof date === "string") return new Date(date);
  if (typeof date === "object" && "toDate" in date) {
    return (date as { toDate: () => Date }).toDate();
  }
  return null;
};

/**
 * Filters and maps contacts with touchpoints due today.
 */
export const filterTodayTouchpoints = (
  contacts: Contact[],
  serverTime: Date,
  limit: number = 3
): ContactWithTouchpoint[] => {
  const todayStart = new Date(serverTime);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(serverTime);
  todayEnd.setHours(23, 59, 59, 999);

  return contacts
    .filter((contact) => {
      if (contact.archived) return false;
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
      if (!touchpointDate) return false;
      const status = contact.touchpointStatus;
      if (status === "completed" || status === "cancelled") return false;
      return touchpointDate >= todayStart && touchpointDate <= todayEnd;
    })
    .map((contact) => {
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate)!;
      const daysUntil = getDaysUntilTouchpoint(contact.nextTouchpointDate, serverTime) || 0;
      return {
        ...contact,
        id: contact.contactId,
        touchpointDate,
        daysUntil,
        needsReminder: false,
      };
    })
    .sort((a, b) => a.touchpointDate.getTime() - b.touchpointDate.getTime())
    .slice(0, limit);
};

/**
 * Filters and maps contacts with overdue touchpoints (within last 30 days).
 */
export const filterOverdueTouchpoints = (
  contacts: Contact[],
  serverTime: Date,
  limit: number = 3
): ContactWithTouchpoint[] => {
  const thirtyDaysAgo = new Date(serverTime);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return contacts
    .filter((contact) => {
      if (contact.archived) return false;
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
      if (!touchpointDate) return false;
      const status = contact.touchpointStatus;
      if (status === "completed" || status === "cancelled") return false;
      return touchpointDate < serverTime && touchpointDate >= thirtyDaysAgo;
    })
    .map((contact) => {
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate)!;
      const daysUntil = getDaysUntilTouchpoint(contact.nextTouchpointDate, serverTime) || 0;
      return {
        ...contact,
        id: contact.contactId,
        touchpointDate,
        daysUntil,
        needsReminder: false,
      };
    })
    .sort((a, b) => a.touchpointDate.getTime() - b.touchpointDate.getTime())
    .slice(0, limit);
};

/**
 * Filters and maps contacts with upcoming touchpoints (next 7 days).
 */
export const filterUpcomingTouchpoints = (
  contacts: Contact[],
  serverTime: Date,
  limit: number = 3
): ContactWithTouchpoint[] => {
  const sevenDaysAhead = new Date(serverTime);
  sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);

  return contacts
    .filter((contact) => {
      if (contact.archived) return false;
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
      if (!touchpointDate) return false;
      const status = contact.touchpointStatus;
      if (status === "completed" || status === "cancelled") return false;
      return touchpointDate > serverTime && touchpointDate <= sevenDaysAhead;
    })
    .map((contact) => {
      const touchpointDate = getTouchpointDate(contact.nextTouchpointDate)!;
      const daysUntil = getDaysUntilTouchpoint(contact.nextTouchpointDate, serverTime) || 0;
      return {
        ...contact,
        id: contact.contactId,
        touchpointDate,
        daysUntil,
        needsReminder: daysUntil <= 7 && daysUntil >= 0,
      };
    })
    .sort((a, b) => a.touchpointDate.getTime() - b.touchpointDate.getTime())
    .slice(0, limit);
};

/**
 * Filters and maps recently active contacts (within 30-60 days).
 */
export const filterRecentContacts = (
  contacts: Contact[],
  serverTime: Date,
  limit: number = 3
): Contact[] => {
  const thirtyDaysAgo = new Date(serverTime);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date(serverTime);
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  return contacts
    .filter((contact) => {
      if (contact.archived) return false;
      const lastEmail = getLastEmailDate(contact.lastEmailDate);
      if (lastEmail) {
        // Primary: last interaction within last 30 days
        if (lastEmail >= thirtyDaysAgo) {
          return true;
        }
        // Secondary: last interaction within 30-60 days AND has active threads
        if (lastEmail >= sixtyDaysAgo && contact.threadCount && contact.threadCount > 0) {
          return true;
        }
      }
      return false;
    })
    .map((contact) => ({
      ...contact,
      id: contact.contactId,
    }))
    .slice(0, limit);
};

/**
 * Counts total contacts with touchpoints due today.
 */
export const countTodayTouchpoints = (contacts: Contact[], serverTime: Date): number => {
  const todayStart = new Date(serverTime);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(serverTime);
  todayEnd.setHours(23, 59, 59, 999);

  return contacts.filter((contact) => {
    if (contact.archived) return false;
    const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
    if (!touchpointDate) return false;
    const status = contact.touchpointStatus;
    if (status === "completed" || status === "cancelled") return false;
    return touchpointDate >= todayStart && touchpointDate <= todayEnd;
  }).length;
};

/**
 * Counts total contacts with overdue touchpoints (within last 30 days).
 */
export const countOverdueTouchpoints = (contacts: Contact[], serverTime: Date): number => {
  const thirtyDaysAgo = new Date(serverTime);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return contacts.filter((contact) => {
    if (contact.archived) return false;
    const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
    if (!touchpointDate) return false;
    const status = contact.touchpointStatus;
    if (status === "completed" || status === "cancelled") return false;
    return touchpointDate < serverTime && touchpointDate >= thirtyDaysAgo;
  }).length;
};

/**
 * Counts total contacts with upcoming touchpoints (next 7 days).
 */
export const countUpcomingTouchpoints = (contacts: Contact[], serverTime: Date): number => {
  const sevenDaysAhead = new Date(serverTime);
  sevenDaysAhead.setDate(sevenDaysAhead.getDate() + 7);

  return contacts.filter((contact) => {
    if (contact.archived) return false;
    const touchpointDate = getTouchpointDate(contact.nextTouchpointDate);
    if (!touchpointDate) return false;
    const status = contact.touchpointStatus;
    if (status === "completed" || status === "cancelled") return false;
    return touchpointDate > serverTime && touchpointDate <= sevenDaysAhead;
  }).length;
};

