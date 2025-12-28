/**
 * Convert Firestore timestamp to Date
 */
export function getDate(timestamp: unknown): Date {
  if (timestamp instanceof Date) return timestamp;
  if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
    return (timestamp as { toDate: () => Date }).toDate();
  }
  if (typeof timestamp === "string") {
    return new Date(timestamp);
  }
  return new Date();
}

/**
 * Check if an event is an all-day event
 * All-day events are stored in UTC at midnight (00:00:00 UTC) for start
 * and 23:59:59.999 UTC for end (even for multi-day events)
 */
export function isAllDayEvent(startTime: Date, endTime: Date): boolean {
  const startUTC = new Date(startTime.toISOString());
  const endUTC = new Date(endTime.toISOString());
  const startIsMidnightUTC = startUTC.getUTCHours() === 0 && startUTC.getUTCMinutes() === 0 && startUTC.getUTCSeconds() === 0;
  const endIsEndOfDayUTC = endUTC.getUTCHours() === 23 && endUTC.getUTCMinutes() === 59 && endUTC.getUTCSeconds() === 59;
  
  // If start is midnight UTC and end is end of day UTC, it's an all-day event
  return startIsMidnightUTC && endIsEndOfDayUTC;
}

