/**
 * Format date for datetime-local input (YYYY-MM-DDTHH:mm)
 * or date input (YYYY-MM-DD) for all-day events
 */
export function formatForInput(date: Date, isAllDay: boolean): string {
  if (isAllDay) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Parse datetime-local input to ISO string
 */
export function parseFromInput(value: string, isAllDay: boolean): string {
  if (isAllDay) {
    // For all-day, use date at midnight
    return `${value}T00:00:00`;
  }
  // For timed events, use the datetime value directly
  return value;
}

