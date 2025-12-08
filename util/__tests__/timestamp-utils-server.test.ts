import { convertTimestampToISO, convertTimestamp } from "../timestamp-utils-server";

describe("timestamp-utils-server", () => {
  describe("convertTimestampToISO", () => {
    it("should return null for null/undefined", () => {
      expect(convertTimestampToISO(null)).toBeNull();
      expect(convertTimestampToISO(undefined)).toBeNull();
    });

    it("should convert Firestore Timestamp with toDate()", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const timestamp = {
        toDate: () => date,
      };

      const result = convertTimestampToISO(timestamp);
      expect(result).toBe("2024-01-15T12:00:00.000Z");
    });

    it("should convert Firestore Timestamp with toMillis()", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const timestamp = {
        toMillis: () => date.getTime(),
      };

      const result = convertTimestampToISO(timestamp);
      expect(result).toBe("2024-01-15T12:00:00.000Z");
    });

    it("should convert serialized Firestore Timestamp with underscores", () => {
      const timestamp = {
        _seconds: 1705324800,
        _nanoseconds: 154000000,
      };

      const result = convertTimestampToISO(timestamp);
      expect(result).toBe(new Date(1705324800 * 1000 + 154000000 / 1000000).toISOString());
    });

    it("should convert serialized Firestore Timestamp without underscores", () => {
      const timestamp = {
        seconds: 1705324800,
        nanoseconds: 154000000,
      };

      const result = convertTimestampToISO(timestamp);
      expect(result).toBe(new Date(1705324800 * 1000 + 154000000 / 1000000).toISOString());
    });

    it("should convert JavaScript Date objects", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const result = convertTimestampToISO(date);
      expect(result).toBe("2024-01-15T12:00:00.000Z");
    });

    it("should return ISO strings as-is", () => {
      const isoString = "2024-01-15T12:00:00.000Z";
      const result = convertTimestampToISO(isoString);
      expect(result).toBe(isoString);
    });

    it("should return null for invalid values", () => {
      expect(convertTimestampToISO(123)).toBeNull();
      expect(convertTimestampToISO({})).toBeNull();
      expect(convertTimestampToISO([])).toBeNull();
    });
  });

  describe("convertTimestamp", () => {
    it("should return ISO string for convertible values", () => {
      const date = new Date("2024-01-15T12:00:00Z");
      const timestamp = {
        toDate: () => date,
      };

      const result = convertTimestamp(timestamp);
      expect(result).toBe("2024-01-15T12:00:00.000Z");
    });

    it("should return original value for non-convertible values", () => {
      const originalValue = { some: "value" };
      const result = convertTimestamp(originalValue);
      expect(result).toBe(originalValue);
    });

    it("should return null for null/undefined", () => {
      expect(convertTimestamp(null)).toBe(null);
      expect(convertTimestamp(undefined)).toBe(undefined);
    });
  });
});

