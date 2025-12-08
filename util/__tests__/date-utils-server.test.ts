import {
  computeIsOverdue,
  getDateCategory,
  getDaysUntilTouchpoint,
} from "../date-utils-server";
import { ActionItem } from "@/types/firestore";

// Helper type for Firestore timestamp mock
interface FirestoreTimestamp {
  toDate: () => Date;
}

describe("date-utils-server", () => {
  const mockServerTime = new Date("2024-01-15T12:00:00Z");

  describe("computeIsOverdue", () => {
    it("should return false for completed action items", () => {
      const actionItem: ActionItem = {
        actionItemId: "item1",
        contactId: "contact1",
        userId: "user1",
        text: "Test",
        status: "completed",
        dueDate: new Date("2024-01-10"),
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      expect(computeIsOverdue(actionItem, mockServerTime)).toBe(false);
    });

    it("should return false when no due date", () => {
      const actionItem: ActionItem = {
        actionItemId: "item1",
        contactId: "contact1",
        userId: "user1",
        text: "Test",
        status: "pending",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      expect(computeIsOverdue(actionItem, mockServerTime)).toBe(false);
    });

    it("should return true for overdue dates (Date object)", () => {
      const actionItem: ActionItem = {
        actionItemId: "item1",
        contactId: "contact1",
        userId: "user1",
        text: "Test",
        status: "pending",
        dueDate: new Date("2024-01-10"), // Before server time
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      expect(computeIsOverdue(actionItem, mockServerTime)).toBe(true);
    });

    it("should return false for future dates (Date object)", () => {
      const actionItem: ActionItem = {
        actionItemId: "item1",
        contactId: "contact1",
        userId: "user1",
        text: "Test",
        status: "pending",
        dueDate: new Date("2024-01-20"), // After server time
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      expect(computeIsOverdue(actionItem, mockServerTime)).toBe(false);
    });

    it("should handle ISO string dates", () => {
      const actionItem: ActionItem = {
        actionItemId: "item1",
        contactId: "contact1",
        userId: "user1",
        text: "Test",
        status: "pending",
        dueDate: "2024-01-10T00:00:00Z", // Before server time
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      expect(computeIsOverdue(actionItem, mockServerTime)).toBe(true);
    });

    it("should handle Firestore timestamp objects", () => {
      const pastDate = new Date("2024-01-10");
      const timestamp: FirestoreTimestamp = {
        toDate: () => pastDate,
      };
      const actionItem: ActionItem = {
        actionItemId: "item1",
        contactId: "contact1",
        userId: "user1",
        text: "Test",
        status: "pending",
        dueDate: timestamp as unknown,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-02"),
      };

      expect(computeIsOverdue(actionItem, mockServerTime)).toBe(true);
    });
  });

  describe("getDateCategory", () => {
    it("should return 'upcoming' for null/undefined", () => {
      expect(getDateCategory(null, mockServerTime)).toBe("upcoming");
      expect(getDateCategory(undefined, mockServerTime)).toBe("upcoming");
    });

    it("should return 'overdue' for past dates", () => {
      const pastDate = new Date("2024-01-10");
      expect(getDateCategory(pastDate, mockServerTime)).toBe("overdue");
    });

    it("should return 'today' for today's date", () => {
      const today = new Date("2024-01-15T10:00:00Z");
      expect(getDateCategory(today, mockServerTime)).toBe("today");
    });

    it("should return 'thisWeek' for dates within 7 days", () => {
      const thisWeek = new Date("2024-01-18");
      expect(getDateCategory(thisWeek, mockServerTime)).toBe("thisWeek");
    });

    it("should return 'upcoming' for dates more than 7 days away", () => {
      const upcoming = new Date("2024-01-25");
      expect(getDateCategory(upcoming, mockServerTime)).toBe("upcoming");
    });

    it("should handle ISO string dates", () => {
      expect(getDateCategory("2024-01-10T00:00:00Z", mockServerTime)).toBe("overdue");
      expect(getDateCategory("2024-01-15T00:00:00Z", mockServerTime)).toBe("today");
      expect(getDateCategory("2024-01-20T00:00:00Z", mockServerTime)).toBe("thisWeek");
    });

    it("should handle Firestore timestamp objects", () => {
      const pastDate = new Date("2024-01-10");
      const timestamp: FirestoreTimestamp = {
        toDate: () => pastDate,
      };

      expect(getDateCategory(timestamp as unknown, mockServerTime)).toBe("overdue");
    });

    it("should return 'upcoming' for invalid date strings", () => {
      expect(getDateCategory("invalid-date", mockServerTime)).toBe("upcoming");
    });
  });

  describe("getDaysUntilTouchpoint", () => {
    it("should return null for null/undefined", () => {
      expect(getDaysUntilTouchpoint(null, mockServerTime)).toBeNull();
      expect(getDaysUntilTouchpoint(undefined, mockServerTime)).toBeNull();
    });

    it("should calculate days correctly for future dates", () => {
      const futureDate = new Date("2024-01-20T00:00:00Z");
      // 5 days difference (Jan 20 - Jan 15)
      expect(getDaysUntilTouchpoint(futureDate, mockServerTime)).toBe(5);
    });

    it("should return negative days for past dates", () => {
      const pastDate = new Date("2024-01-10T00:00:00Z");
      // -5 days difference (Jan 10 - Jan 15)
      expect(getDaysUntilTouchpoint(pastDate, mockServerTime)).toBe(-5);
    });

    it("should return 0 for today's date", () => {
      const today = new Date("2024-01-15T10:00:00Z");
      const result = getDaysUntilTouchpoint(today, mockServerTime);
      // Use toBeCloseTo to handle -0 vs 0 edge case
      expect(result).toBeCloseTo(0, 5);
    });

    it("should handle ISO string dates", () => {
      expect(getDaysUntilTouchpoint("2024-01-20T00:00:00Z", mockServerTime)).toBe(5);
      expect(getDaysUntilTouchpoint("2024-01-10T00:00:00Z", mockServerTime)).toBe(-5);
    });

    it("should handle Firestore timestamp objects", () => {
      const futureDate = new Date("2024-01-20");
      const timestamp: FirestoreTimestamp = {
        toDate: () => futureDate,
      };

      expect(getDaysUntilTouchpoint(timestamp as unknown, mockServerTime)).toBe(5);
    });

    it("should return null for invalid date strings", () => {
      expect(getDaysUntilTouchpoint("invalid-date", mockServerTime)).toBeNull();
    });
  });
});

