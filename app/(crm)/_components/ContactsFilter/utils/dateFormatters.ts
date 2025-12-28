/**
 * Formats a Date object for use in HTML date input (YYYY-MM-DD).
 */
export const formatDateForInput = (date: Date | null): string => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parses a date string from HTML date input into a Date object.
 */
export const parseDateFromInput = (dateString: string): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Checks if a date range matches the default (last 12 months).
 */
export const isDefaultDateRange = (
  dateRange: { start: Date | null; end: Date | null }
): boolean => {
  if (!dateRange.start || !dateRange.end) return true;
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 12);

  // Normalize dates to start of day for comparison
  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized.getTime();
  };

  return (
    normalizeDate(dateRange.start) === normalizeDate(start) &&
    normalizeDate(dateRange.end) === normalizeDate(end)
  );
};

/**
 * Gets the default date range (last 12 months).
 */
export const getDefaultDateRange = (): { start: Date; end: Date } => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 12);
  return { start, end };
};

