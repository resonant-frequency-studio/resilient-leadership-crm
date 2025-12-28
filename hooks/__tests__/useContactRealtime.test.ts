import { renderHook, waitFor, act } from "@testing-library/react";
import { useContactRealtime } from "../useContactRealtime";
import { db } from "@/lib/firebase-client";
import { doc, onSnapshot, query, where, collection, getDocs, DocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import { Contact } from "@/types/firestore";
import { createMockContact } from "@/components/__tests__/test-utils";

// Mock Firebase
jest.mock("@/lib/firebase-client", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("@/lib/error-reporting", () => ({
  reportException: jest.fn(),
}));

const mockDoc = doc as jest.MockedFunction<typeof doc>;
const mockOnSnapshot = onSnapshot as jest.MockedFunction<typeof onSnapshot>;
const mockQuery = query as jest.MockedFunction<typeof query>;
const mockWhere = where as jest.MockedFunction<typeof where>;
const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockGetDocs = getDocs as jest.MockedFunction<typeof getDocs>;

// Helper to create a mock document snapshot
function createMockDocSnapshot(contact: Contact | null, docId: string): DocumentSnapshot {
  return {
    exists: () => contact !== null,
    id: docId,
    data: () => contact,
    metadata: { fromCache: false, hasPendingWrites: false },
    ref: {} as ReturnType<typeof doc> & { path: string },
    get: jest.fn(),
  } as unknown as DocumentSnapshot;
}

// Helper to create a mock query snapshot
function createMockQuerySnapshot(contacts: Contact[]): QuerySnapshot {
  const docs = contacts.map((contact, index) => ({
    id: contact.contactId || `doc-${index}`,
    data: () => contact,
    exists: true,
    metadata: { fromCache: false, hasPendingWrites: false },
    ref: {} as any,
    get: jest.fn(),
  }));

  return {
    docs,
    empty: docs.length === 0,
    size: docs.length,
    metadata: { fromCache: false, hasPendingWrites: false },
    query: {} as any,
    docChanges: jest.fn(() => []),
    forEach: jest.fn(),
    isEqual: jest.fn(() => false),
  } as unknown as QuerySnapshot;
}

describe("useContactRealtime", () => {
  const mockUserId = "user123";
  const mockContactId = "contact-1";
  let unsubscribe: jest.Mock;
  let onNextCallback: (snapshot: DocumentSnapshot) => void;
  let onErrorCallback: (error: Error) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    unsubscribe = jest.fn();
    mockDoc.mockReturnValue({} as ReturnType<typeof doc>);
    mockQuery.mockReturnValue({} as any);
    mockWhere.mockReturnValue({} as any);
    mockCollection.mockReturnValue({} as ReturnType<typeof collection>);
    mockGetDocs.mockResolvedValue(createMockQuerySnapshot([]) as any);
    
    // Capture callbacks
    mockOnSnapshot.mockImplementation((_ref, onNext, onError) => {
      onNextCallback = onNext as (snapshot: DocumentSnapshot) => void;
      onErrorCallback = onError as (error: Error) => void;
      return unsubscribe;
    });
  });

  describe("Initialization", () => {
    it("should return null contact and loading true initially", () => {
      const { result } = renderHook(() => useContactRealtime(mockUserId, mockContactId));

      expect(result.current.contact).toBeNull();
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("should not set up listener when userId is null", async () => {
      const { result } = renderHook(() => useContactRealtime(null, mockContactId));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.contact).toBeNull();
      expect(mockOnSnapshot).not.toHaveBeenCalled();
    });

    it("should not set up listener when contactId is null", async () => {
      const { result } = renderHook(() => useContactRealtime(mockUserId, null));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.contact).toBeNull();
      expect(mockOnSnapshot).not.toHaveBeenCalled();
    });

    it("should set up Firestore listener when both userId and contactId are provided", () => {
      renderHook(() => useContactRealtime(mockUserId, mockContactId));

      expect(mockDoc).toHaveBeenCalledWith(db, `users/${mockUserId}/contacts/${mockContactId}`);
      expect(mockOnSnapshot).toHaveBeenCalled();
    });

    it("should decode contactId in URL", () => {
      const encodedId = "contact%20with%20spaces";
      const decodedId = "contact with spaces";

      renderHook(() => useContactRealtime(mockUserId, encodedId));

      expect(mockDoc).toHaveBeenCalledWith(db, `users/${mockUserId}/contacts/${decodedId}`);
    });
  });

  describe("Successful data fetch", () => {
    it("should update contact when document exists", async () => {
      const mockContact = createMockContact({ contactId: mockContactId, firstName: "John" });

      const { result } = renderHook(() => useContactRealtime(mockUserId, mockContactId));

      act(() => {
        const snapshot = createMockDocSnapshot(mockContact, mockContactId);
        onNextCallback(snapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.contact).toEqual({
        ...mockContact,
        contactId: mockContactId, // Should use document ID
      });
      expect(result.current.error).toBeNull();
    });

    it("should ensure contactId matches document ID", async () => {
      const contactData = createMockContact({ contactId: "different-id" });
      const docId = "actual-doc-id";

      const { result } = renderHook(() => useContactRealtime(mockUserId, docId));

      act(() => {
        const snapshot = createMockDocSnapshot(contactData, docId);
        onNextCallback(snapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // contactId should be set to document ID
      expect(result.current.contact?.contactId).toBe(docId);
    });

    it("should query by contactId field when document ID lookup fails", async () => {
      const mockContact = createMockContact({ contactId: "contact-1", firstName: "John" });
      const querySnapshot = createMockQuerySnapshot([mockContact]);

      // Set up the query result before triggering the fallback
      mockGetDocs.mockResolvedValueOnce(querySnapshot as any);

      const { result } = renderHook(() => useContactRealtime(mockUserId, "contact-1"));

      // Simulate document not found
      act(() => {
        const snapshot = createMockDocSnapshot(null, "contact-1");
        onNextCallback(snapshot);
      });

      // Should trigger fallback query
      await waitFor(() => {
        expect(mockCollection).toHaveBeenCalledWith(db, `users/${mockUserId}/contacts`);
        expect(mockWhere).toHaveBeenCalledWith("contactId", "==", "contact-1");
        expect(mockGetDocs).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.contact).toEqual({
          ...mockContact,
          contactId: "contact-1",
        });
      });
    });

    it("should return null when contact is not found", async () => {
      // Set up empty query result before triggering the fallback
      mockGetDocs.mockResolvedValueOnce(createMockQuerySnapshot([]) as any);

      const { result } = renderHook(() => useContactRealtime(mockUserId, "non-existent"));

      // Simulate document not found
      act(() => {
        const snapshot = createMockDocSnapshot(null, "non-existent");
        onNextCallback(snapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.contact).toBeNull();
      });
    });
  });

  describe("Error handling", () => {
    it("should handle Firestore document listener errors", async () => {
      const { result } = renderHook(() => useContactRealtime(mockUserId, mockContactId));

      const mockError = new Error("Firestore error");

      act(() => {
        onErrorCallback(mockError);
      });

      await waitFor(() => {
        expect(result.current.error).toBe(mockError);
        expect(result.current.loading).toBe(false);
      });

      const { reportException } = require("@/lib/error-reporting");
      expect(reportException).toHaveBeenCalledWith(mockError, {
        context: "Fetching contact (real-time)",
        tags: { component: "useContactRealtime", userId: mockUserId, contactId: mockContactId },
      });
    });

    it("should handle query errors in fallback", async () => {
      // Set up query error before triggering the fallback
      const queryError = new Error("Query error");
      mockGetDocs.mockRejectedValueOnce(queryError);

      const { result } = renderHook(() => useContactRealtime(mockUserId, "contact-1"));

      // Simulate document not found
      act(() => {
        const snapshot = createMockDocSnapshot(null, "contact-1");
        onNextCallback(snapshot);
      });

      await waitFor(() => {
        expect(result.current.error).toBe(queryError);
        expect(result.current.loading).toBe(false);
      });

      const { reportException } = require("@/lib/error-reporting");
      expect(reportException).toHaveBeenCalledWith(queryError, {
        context: "Querying contact by contactId field",
        tags: { component: "useContactRealtime", userId: mockUserId, contactId: "contact-1" },
      });
    });

    it("should handle setup errors", async () => {
      mockDoc.mockImplementation(() => {
        throw new Error("Setup error");
      });

      const { result } = renderHook(() => useContactRealtime(mockUserId, mockContactId));

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("Cleanup", () => {
    it("should unsubscribe on unmount", () => {
      const { unmount } = renderHook(() => useContactRealtime(mockUserId, mockContactId));

      expect(mockOnSnapshot).toHaveBeenCalled();

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });

    it("should reset state when userId changes to null", async () => {
      const { result, rerender } = renderHook(
        ({ userId, contactId }) => useContactRealtime(userId, contactId),
        { initialProps: { userId: mockUserId, contactId: mockContactId } }
      );

      // Set up some state
      act(() => {
        const snapshot = createMockDocSnapshot(
          createMockContact({ contactId: mockContactId }),
          mockContactId
        );
        onNextCallback(snapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Change userId to null
      rerender({ userId: null, contactId: mockContactId });

      await waitFor(() => {
        expect(result.current.contact).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });

    it("should reset state when contactId changes", async () => {
      const { result, rerender } = renderHook(
        ({ userId, contactId }) => useContactRealtime(userId, contactId),
        { initialProps: { userId: mockUserId, contactId: "contact-1" } }
      );

      // Set up some state
      act(() => {
        const snapshot = createMockDocSnapshot(
          createMockContact({ contactId: "contact-1" }),
          "contact-1"
        );
        onNextCallback(snapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Change contactId
      rerender({ userId: mockUserId, contactId: "contact-2" });

      await waitFor(() => {
        expect(result.current.contact).toBeNull();
        expect(result.current.loading).toBe(true);
      });
    });
  });
});

