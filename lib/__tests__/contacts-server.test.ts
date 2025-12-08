import {
  getContactForUser,
  getAllContactsForUser,
  getContactsMapForUser,
  getUniqueSegmentsForUser,
} from "../contacts-server";
import { adminDb } from "../firebase-admin";
import { createMockDocSnapshot, createMockQuerySnapshot } from "../__mocks__/firebase-admin";
import { Contact } from "@/types/firestore";

// Mock the firebase-admin module
jest.mock("../firebase-admin", () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const mockModule = require("../__mocks__/firebase-admin");
  return {
    adminDb: mockModule.adminDb,
  };
});

// Mock error reporting
jest.mock("../error-reporting", () => ({
  reportException: jest.fn(),
}));

describe("contacts-server", () => {
  const mockUserId = "user123";
  const mockContactId = "contact456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getContactForUser", () => {
    it("should return a contact when found", async () => {
      const mockContact: Contact = {
        contactId: mockContactId,
        primaryEmail: "test@example.com",
        firstName: "Test",
        lastName: "User",
        createdAt: { toDate: () => new Date("2024-01-01") },
        updatedAt: { toDate: () => new Date("2024-01-02") },
      };

      const mockDoc = createMockDocSnapshot(mockContact, mockContactId);
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDoc),
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDocRef),
      };
      
      (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

      const result = await getContactForUser(mockUserId, mockContactId);

      expect(result).toBeDefined();
      expect(result?.contactId).toBe(mockContactId);
      expect(result?.primaryEmail).toBe("test@example.com");
      expect(typeof result?.createdAt).toBe("string"); // Should be ISO string
      expect(typeof result?.updatedAt).toBe("string"); // Should be ISO string
    });

    it("should return null when contact not found", async () => {
      const mockDoc = createMockDocSnapshot(null, mockContactId);
      mockDoc.exists = false;
      
      const mockDocRef = {
        get: jest.fn().mockResolvedValue(mockDoc),
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDocRef),
      };
      
      (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

      const result = await getContactForUser(mockUserId, mockContactId);

      expect(result).toBeNull();
    });

    it("should handle quota exceeded errors", async () => {
      const quotaError = new Error("RESOURCE_EXHAUSTED: Quota exceeded");

      const mockDocRef = {
        get: jest.fn().mockRejectedValue(quotaError),
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDocRef),
      };
      
      (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

      await expect(
        getContactForUser(mockUserId, mockContactId)
      ).rejects.toThrow("Database quota exceeded");
    });

    it("should handle other errors", async () => {
      const error = new Error("Network error");

      const mockDocRef = {
        get: jest.fn().mockRejectedValue(error),
      };
      const mockCollection = {
        doc: jest.fn().mockReturnValue(mockDocRef),
      };
      
      (adminDb.collection as jest.Mock).mockReturnValue(mockCollection);

      await expect(
        getContactForUser(mockUserId, mockContactId)
      ).rejects.toThrow("Network error");
    });
  });

  describe("getAllContactsForUser", () => {
    it("should return empty array when no contacts exist", async () => {
      const emptySnapshot = createMockQuerySnapshot([]);

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(emptySnapshot),
      });

      const result = await getAllContactsForUser(mockUserId);

      expect(result).toEqual([]);
    });

    it("should return all contacts with converted timestamps", async () => {
      const mockContact1: Contact = {
        contactId: "contact1",
        primaryEmail: "test1@example.com",
        firstName: "Test",
        lastName: "One",
        createdAt: { toDate: () => new Date("2024-01-01") },
        updatedAt: { toDate: () => new Date("2024-01-02") },
      };

      const mockContact2: Contact = {
        contactId: "contact2",
        primaryEmail: "test2@example.com",
        firstName: "Test",
        lastName: "Two",
        createdAt: { toDate: () => new Date("2024-01-03") },
        updatedAt: { toDate: () => new Date("2024-01-04") },
      };

      const mockDocs = [
        createMockDocSnapshot(mockContact1, "contact1"),
        createMockDocSnapshot(mockContact2, "contact2"),
      ];
      const snapshot = createMockQuerySnapshot(mockDocs);

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(snapshot),
      });

      const result = await getAllContactsForUser(mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0].contactId).toBe("contact1");
      expect(result[1].contactId).toBe("contact2");
      expect(typeof result[0].createdAt).toBe("string");
      expect(typeof result[1].createdAt).toBe("string");
    });

    it("should handle quota exceeded errors", async () => {
      const quotaError = new Error("RESOURCE_EXHAUSTED: Quota exceeded");

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockRejectedValue(quotaError),
      });

      await expect(getAllContactsForUser(mockUserId)).rejects.toThrow(
        "Database quota exceeded"
      );
    });
  });

  describe("getContactsMapForUser", () => {
    it("should return a Map keyed by contactId", async () => {
      const mockContact1: Contact = {
        contactId: "contact1",
        primaryEmail: "test1@example.com",
        createdAt: { toDate: () => new Date("2024-01-01") },
        updatedAt: { toDate: () => new Date("2024-01-02") },
      };

      const mockContact2: Contact = {
        contactId: "contact2",
        primaryEmail: "test2@example.com",
        createdAt: { toDate: () => new Date("2024-01-03") },
        updatedAt: { toDate: () => new Date("2024-01-04") },
      };

      const mockDocs = [
        createMockDocSnapshot(mockContact1, "contact1"),
        createMockDocSnapshot(mockContact2, "contact2"),
      ];
      const snapshot = createMockQuerySnapshot(mockDocs);

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(snapshot),
      });

      const result = await getContactsMapForUser(mockUserId);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(2);
      expect(result.get("contact1")?.primaryEmail).toBe("test1@example.com");
      expect(result.get("contact2")?.primaryEmail).toBe("test2@example.com");
    });

    it("should return empty Map when no contacts exist", async () => {
      const emptySnapshot = createMockQuerySnapshot([]);

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(emptySnapshot),
      });

      const result = await getContactsMapForUser(mockUserId);

      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });
  });

  describe("getUniqueSegmentsForUser", () => {
    it("should return empty array when no contacts exist", async () => {
      const emptySnapshot = createMockQuerySnapshot([]);

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(emptySnapshot),
      });

      const result = await getUniqueSegmentsForUser(mockUserId);

      expect(result).toEqual([]);
    });

    it("should return unique segments sorted alphabetically", async () => {
      const mockContact1: Contact = {
        contactId: "contact1",
        primaryEmail: "test1@example.com",
        segment: "Enterprise",
        createdAt: { toDate: () => new Date("2024-01-01") },
        updatedAt: { toDate: () => new Date("2024-01-02") },
      };

      const mockContact2: Contact = {
        contactId: "contact2",
        primaryEmail: "test2@example.com",
        segment: "SMB",
        createdAt: { toDate: () => new Date("2024-01-03") },
        updatedAt: { toDate: () => new Date("2024-01-04") },
      };

      const mockContact3: Contact = {
        contactId: "contact3",
        primaryEmail: "test3@example.com",
        segment: "Enterprise", // Duplicate segment
        createdAt: { toDate: () => new Date("2024-01-05") },
        updatedAt: { toDate: () => new Date("2024-01-06") },
      };

      const mockContact4: Contact = {
        contactId: "contact4",
        primaryEmail: "test4@example.com",
        // No segment
        createdAt: { toDate: () => new Date("2024-01-07") },
        updatedAt: { toDate: () => new Date("2024-01-08") },
      };

      const mockDocs = [
        createMockDocSnapshot(mockContact1, "contact1"),
        createMockDocSnapshot(mockContact2, "contact2"),
        createMockDocSnapshot(mockContact3, "contact3"),
        createMockDocSnapshot(mockContact4, "contact4"),
      ];
      const snapshot = createMockQuerySnapshot(mockDocs);

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(snapshot),
      });

      const result = await getUniqueSegmentsForUser(mockUserId);

      expect(result).toEqual(["Enterprise", "SMB"]);
      expect(result.length).toBe(2); // Should not include duplicates or empty segments
    });

    it("should handle contacts with null or undefined segments", async () => {
      const mockContact1: Contact = {
        contactId: "contact1",
        primaryEmail: "test1@example.com",
        segment: null,
        createdAt: { toDate: () => new Date("2024-01-01") },
        updatedAt: { toDate: () => new Date("2024-01-02") },
      };

      const mockContact2: Contact = {
        contactId: "contact2",
        primaryEmail: "test2@example.com",
        segment: "Valid Segment",
        createdAt: { toDate: () => new Date("2024-01-03") },
        updatedAt: { toDate: () => new Date("2024-01-04") },
      };

      const mockDocs = [
        createMockDocSnapshot(mockContact1, "contact1"),
        createMockDocSnapshot(mockContact2, "contact2"),
      ];
      const snapshot = createMockQuerySnapshot(mockDocs);

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockResolvedValue(snapshot),
      });

      const result = await getUniqueSegmentsForUser(mockUserId);

      expect(result).toEqual(["Valid Segment"]);
    });

    it("should handle quota exceeded errors", async () => {
      const quotaError = new Error("RESOURCE_EXHAUSTED: Quota exceeded");

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockRejectedValue(quotaError),
      });

      await expect(getUniqueSegmentsForUser(mockUserId)).rejects.toThrow(
        "Database quota exceeded"
      );
    });

    it("should handle other errors", async () => {
      const error = new Error("Network error");

      (adminDb.collection as jest.Mock).mockReturnValue({
        get: jest.fn().mockRejectedValue(error),
      });

      await expect(getUniqueSegmentsForUser(mockUserId)).rejects.toThrow(
        "Network error"
      );
    });
  });
});

