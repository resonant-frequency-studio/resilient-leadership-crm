/**
 * Convert Firestore Timestamp to ISO string for JSON serialization
 * 
 * This function handles multiple timestamp formats:
 * - Firestore Timestamp objects (with toDate() or toMillis() methods)
 * - Serialized Firestore Timestamps (with _seconds/_nanoseconds or seconds/nanoseconds)
 * - JavaScript Date objects
 * - ISO string dates (returns as-is)
 * 
 * @param value - The timestamp value to convert
 * @returns ISO string representation or null if value is null/undefined/invalid
 */
export function convertTimestampToISO(value: unknown): string | null {
  if (!value) return null;
  
  // Handle Firestore Timestamp objects with toDate() method
  if (value && typeof value === "object" && "toDate" in value) {
    const timestamp = value as { toDate: () => Date };
    return timestamp.toDate().toISOString();
  }
  
  // Handle Firestore Timestamp objects with toMillis() method
  if (value && typeof value === "object" && "toMillis" in value) {
    const timestamp = value as { toMillis: () => number };
    return new Date(timestamp.toMillis()).toISOString();
  }
  
  // Handle Firestore Timestamp serialized format with underscores
  if (value && typeof value === "object" && "_seconds" in value && "_nanoseconds" in value) {
    const timestamp = value as { _seconds: number; _nanoseconds: number };
    return new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000).toISOString();
  }
  
  // Handle Firestore Timestamp serialized format without underscores
  if (value && typeof value === "object" && "seconds" in value && "nanoseconds" in value) {
    const timestamp = value as { seconds: number; nanoseconds: number };
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toISOString();
  }
  
  // Handle JavaScript Date objects
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  // Handle ISO strings (return as-is)
  if (typeof value === "string") {
    return value;
  }
  
  return null;
}

/**
 * Convert Firestore Timestamp to ISO string, preserving unknown type for compatibility
 * This is a wrapper that returns unknown instead of string | null for cases where
 * the original value should be preserved if it can't be converted.
 * 
 * @param value - The timestamp value to convert
 * @returns ISO string if convertible, otherwise the original value
 */
export function convertTimestamp(value: unknown): unknown {
  const converted = convertTimestampToISO(value);
  return converted !== null ? converted : value;
}

