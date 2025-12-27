import { getAllUsersWithGmailAccess, getAllUsersWithContactsAccess, getAllUsersWithCalendarAccess } from "../cron-helpers";
import { adminDb } from "@/lib/firebase-admin";
import { createMockQuerySnapshot, createMockDoc } from "@/lib/__mocks__/firebase-admin";
import { reportException } from "@/lib/error-reporting";

jest.mock("@/lib/firebase-admin", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockModule = require("@/lib/__mocks__/firebase-admin");
  return {
    adminDb: mockModule.adminDb,
  };
});

jest.mock("@/lib/error-reporting", () => ({
  reportException: jest.fn(),
}));

const mockReportException = reportException as jest.MockedFunction<typeof reportException>;
const mockCollection = adminDb.collection as jest.MockedFunction<typeof adminDb.collection>;

describe("cron-helpers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsersWithGmailAccess", () => {
    it("should return users with Gmail scopes", async () => {
      const mockDocs = [
        createMockDoc({ scope: "gmail.readonly https://www.googleapis.com/auth/calendar" }, "user1"),
        createMockDoc({ scope: "gmail https://www.googleapis.com/auth/contacts" }, "user2"),
        createMockDoc({ scope: "calendar.readonly" }, "user3"), // No Gmail scope
        createMockDoc({ scope: "gmail.readonly contacts.readonly" }, "user4"),
      ];

      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot(mockDocs));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithGmailAccess(adminDb);

      expect(result).toEqual(["user1", "user2", "user4"]);
      expect(mockCollection).toHaveBeenCalledWith("googleAccounts");
    });

    it("should return empty array when no users have Gmail access", async () => {
      const mockDocs = [
        createMockDoc({ scope: "calendar.readonly" }, "user1"),
        createMockDoc({ scope: "contacts.readonly" }, "user2"),
      ];

      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot(mockDocs));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithGmailAccess(adminDb);

      expect(result).toEqual([]);
    });

    it("should handle empty collection", async () => {
      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot([]));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithGmailAccess(adminDb);

      expect(result).toEqual([]);
    });

    it("should handle users with missing scope field", async () => {
      const mockDocs = [
        createMockDoc({}, "user1"), // No scope field
        createMockDoc({ scope: "gmail.readonly" }, "user2"),
      ];

      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot(mockDocs));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithGmailAccess(adminDb);

      expect(result).toEqual(["user2"]);
    });

    it("should handle errors gracefully", async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error("Database error"));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithGmailAccess(adminDb);

      expect(result).toEqual([]);
      expect(mockReportException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          context: "Getting users with Gmail access",
          tags: { component: "cron-helpers" },
        })
      );
    });
  });

  describe("getAllUsersWithContactsAccess", () => {
    it("should return users with Contacts scopes", async () => {
      const mockDocs = [
        createMockDoc({ scope: "contacts.readonly https://www.googleapis.com/auth/calendar" }, "user1"),
        createMockDoc({ scope: "contacts https://www.googleapis.com/auth/gmail" }, "user2"),
        createMockDoc({ scope: "calendar.readonly" }, "user3"), // No Contacts scope
        createMockDoc({ scope: "contacts.readonly gmail.readonly" }, "user4"),
      ];

      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot(mockDocs));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithContactsAccess(adminDb);

      expect(result).toEqual(["user1", "user2", "user4"]);
      expect(mockCollection).toHaveBeenCalledWith("googleAccounts");
    });

    it("should return empty array when no users have Contacts access", async () => {
      const mockDocs = [
        createMockDoc({ scope: "calendar.readonly" }, "user1"),
        createMockDoc({ scope: "gmail.readonly" }, "user2"),
      ];

      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot(mockDocs));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithContactsAccess(adminDb);

      expect(result).toEqual([]);
    });

    it("should handle empty collection", async () => {
      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot([]));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithContactsAccess(adminDb);

      expect(result).toEqual([]);
    });

    it("should handle users with missing scope field", async () => {
      const mockDocs = [
        createMockDoc({}, "user1"), // No scope field
        createMockDoc({ scope: "contacts.readonly" }, "user2"),
      ];

      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot(mockDocs));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithContactsAccess(adminDb);

      expect(result).toEqual(["user2"]);
    });

    it("should handle errors gracefully", async () => {
      const mockGet = jest.fn().mockRejectedValue(new Error("Database error"));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithContactsAccess(adminDb);

      expect(result).toEqual([]);
      expect(mockReportException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          context: "Getting users with Contacts access",
          tags: { component: "cron-helpers" },
        })
      );
    });
  });

  describe("getAllUsersWithCalendarAccess", () => {
    it("should return users with Calendar scopes", async () => {
      const mockDocs = [
        createMockDoc({ scope: "calendar.readonly https://www.googleapis.com/auth/gmail" }, "user1"),
        createMockDoc({ scope: "calendar https://www.googleapis.com/auth/contacts" }, "user2"),
        createMockDoc({ scope: "gmail.readonly" }, "user3"), // No Calendar scope
        createMockDoc({ scope: "calendar.readonly contacts.readonly" }, "user4"),
      ];

      const mockGet = jest.fn().mockResolvedValue(createMockQuerySnapshot(mockDocs));
      mockCollection.mockReturnValue({
        get: mockGet,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const result = await getAllUsersWithCalendarAccess(adminDb);

      expect(result).toEqual(["user1", "user2", "user4"]);
      expect(mockCollection).toHaveBeenCalledWith("googleAccounts");
    });
  });
});

