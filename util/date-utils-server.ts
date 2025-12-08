import { ActionItem } from "@/types/firestore";

/**
 * Compute if an action item is overdue
 * 
 * @param actionItem - The action item to check
 * @param serverTime - The server time to use for comparison (ensures consistency)
 * @returns true if the action item is overdue, false otherwise
 */
export function computeIsOverdue(
  actionItem: ActionItem,
  serverTime: Date
): boolean {
  if (actionItem.status !== "pending" || !actionItem.dueDate) {
    return false;
  }

  const dueDate = actionItem.dueDate;
  let date: Date | null = null;

  if (dueDate instanceof Date) {
    date = dueDate;
  } else if (typeof dueDate === "string") {
    date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      return false;
    }
  } else if (typeof dueDate === "object" && "toDate" in dueDate) {
    date = (dueDate as { toDate: () => Date }).toDate();
  } else if (typeof dueDate === "object" && "toMillis" in dueDate) {
    date = new Date((dueDate as { toMillis: () => number }).toMillis());
  }

  return date ? date < serverTime : false;
}

/**
 * Get the date category for a due date
 * 
 * @param dueDate - The due date (can be Date, string, or Firestore timestamp)
 * @param serverTime - The server time to use for comparison
 * @returns "overdue" | "today" | "thisWeek" | "upcoming"
 */
export function getDateCategory(
  dueDate: unknown,
  serverTime: Date
): "overdue" | "today" | "thisWeek" | "upcoming" {
  if (!dueDate) return "upcoming";

  let date: Date | null = null;

  if (dueDate instanceof Date) {
    date = dueDate;
  } else if (typeof dueDate === "string") {
    // Handle ISO date strings (with or without time)
    const dateStr = dueDate.split("T")[0]; // Get just the date part
    date = new Date(dateStr + "T00:00:00"); // Add time to avoid timezone issues
    if (isNaN(date.getTime())) {
      return "upcoming";
    }
  } else if (typeof dueDate === "object" && "toDate" in dueDate) {
    date = (dueDate as { toDate: () => Date }).toDate();
  } else if (typeof dueDate === "object" && "toMillis" in dueDate) {
    date = new Date((dueDate as { toMillis: () => number }).toMillis());
  } else {
    return "upcoming";
  }

  if (!date) return "upcoming";

  // Normalize to midnight for date comparison
  const today = new Date(
    serverTime.getFullYear(),
    serverTime.getMonth(),
    serverTime.getDate()
  );
  const due = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Compare dates (ignoring time)
  if (due < today) return "overdue";
  if (due.getTime() === today.getTime()) return "today";

  const daysDiff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff <= 7) return "thisWeek";
  return "upcoming";
}

/**
 * Get the number of days until a touchpoint date
 * 
 * @param touchpointDate - The touchpoint date (can be Date, string, or Firestore timestamp)
 * @param serverTime - The server time to use for comparison
 * @returns The number of days until the touchpoint, or null if invalid
 */
export function getDaysUntilTouchpoint(
  touchpointDate: Date | string | unknown | null,
  serverTime: Date
): number | null {
  if (!touchpointDate) return null;

  let date: Date | null = null;

  if (touchpointDate instanceof Date) {
    date = touchpointDate;
  } else if (typeof touchpointDate === "string") {
    date = new Date(touchpointDate);
    if (isNaN(date.getTime())) {
      return null;
    }
  } else if (typeof touchpointDate === "object" && "toDate" in touchpointDate) {
    date = (touchpointDate as { toDate: () => Date }).toDate();
  } else if (typeof touchpointDate === "object" && "toMillis" in touchpointDate) {
    date = new Date((touchpointDate as { toMillis: () => number }).toMillis());
  }

  if (!date) return null;

  const diffMs = date.getTime() - serverTime.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

