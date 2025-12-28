import { renderHook, waitFor, act } from "@testing-library/react";
import { useContactsRealtime } from "../useContactsRealtime";
import { db } from "@/lib/firebase-client";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";
import { Contact } from "@/types/firestore";
import { createMockContact } from "@/components/__tests__/test-utils";

// Mock Firebase
jest.mock("@/lib/firebase-client", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock("@/lib/error-reporting", () => ({
  reportException: jest.fn(),
}));

const mockCollection = collection as jest.MockedFunction<typeof collection>;
const mockOnSnapshot = onSnapshot as jest.MockedFunction<typeof onSnapshot>;

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

describe("useContactsRealtime", () => {
  const mockUserId = "user123";
  let unsubscribe: jest.Mock;
  let onNextCallback: (snapshot: QuerySnapshot) => void;
  let onErrorCallback: (error: Error) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    unsubscribe = jest.fn();
    mockCollection.mockReturnValue({} as ReturnType<typeof collection>);
    
    // Capture callbacks
    mockOnSnapshot.mockImplementation((_ref, onNext, onError) => {
      onNextCallback = onNext as (snapshot: QuerySnapshot) => void;
      onErrorCallback = onError as (error: Error) => void;
      return unsubscribe;
    });
  });

  describe("Initialization", () => {
    it("should return empty contacts and loading true initially", () => {
      const { result } = renderHook(() => useContactsRealtime(mockUserId));

      expect(result.current.contacts).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.hasConfirmedNoContacts).toBe(false);
    });

    it("should not set up listener when userId is null", async () => {
      const { result } = renderHook(() => useContactsRealtime(null));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.contacts).toEqual([]);
      expect(mockOnSnapshot).not.toHaveBeenCalled();
    });

    it("should set up Firestore listener when userId is provided", () => {
      renderHook(() => useContactsRealtime(mockUserId));

      expect(mockCollection).toHaveBeenCalledWith(db, `users/${mockUserId}/contacts`);
      expect(mockOnSnapshot).toHaveBeenCalled();
    });
  });

  describe("Successful data fetch", () => {
    it("should update contacts when snapshot is received", async () => {
      const mockContacts: Contact[] = [
        createMockContact({ contactId: "1", firstName: "John" }),
        createMockContact({ contactId: "2", firstName: "Jane" }),
      ];

      const { result } = renderHook(() => useContactsRealtime(mockUserId));

      // Simulate cached snapshot first
      act(() => {
        const cachedSnapshot = createMockQuerySnapshot(mockContacts);
        (cachedSnapshot.metadata as any).fromCache = true;
        onNextCallback(cachedSnapshot);
      });

      // Should still be loading (waiting for server snapshot)
      expect(result.current.loading).toBe(true);
      expect(result.current.contacts).toEqual(mockContacts);

      // Simulate server snapshot
      act(() => {
        const serverSnapshot = createMockQuerySnapshot(mockContacts);
        (serverSnapshot.metadata as any).fromCache = false;
        onNextCallback(serverSnapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.contacts).toEqual(mockContacts);
      expect(result.current.error).toBeNull();
    });

    it("should ensure contactId matches document ID", async () => {
      const contactData = createMockContact({ contactId: "different-id" });
      const docId = "actual-doc-id";
      
      const mockSnapshot = {
        docs: [{
          id: docId,
          data: () => contactData,
          exists: true,
          metadata: { fromCache: false, hasPendingWrites: false },
          ref: {} as any,
          get: jest.fn(),
        }],
        empty: false,
        size: 1,
        metadata: { fromCache: false, hasPendingWrites: false },
        query: {} as any,
        docChanges: jest.fn(() => []),
        forEach: jest.fn(),
        isEqual: jest.fn(() => false),
      } as unknown as QuerySnapshot;

      const { result } = renderHook(() => useContactsRealtime(mockUserId));

      act(() => {
        onNextCallback(mockSnapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // contactId should be set to document ID
      expect(result.current.contacts[0].contactId).toBe(docId);
    });

    it("should default archived to false if missing", async () => {
      const contactData = createMockContact({ contactId: "1", archived: undefined });
      
      const mockSnapshot = createMockQuerySnapshot([contactData]);
      (mockSnapshot.metadata as any).fromCache = false;

      const { result } = renderHook(() => useContactsRealtime(mockUserId));

      act(() => {
        onNextCallback(mockSnapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.contacts[0].archived).toBe(false);
    });
  });

  describe("Empty state handling", () => {
    it("should set hasConfirmedNoContacts when both cache and server are empty", async () => {
      const { result } = renderHook(() => useContactsRealtime(mockUserId));

      // Simulate cached empty snapshot
      act(() => {
        const cachedSnapshot = createMockQuerySnapshot([]);
        (cachedSnapshot.metadata as any).fromCache = true;
        onNextCallback(cachedSnapshot);
      });

      expect(result.current.hasConfirmedNoContacts).toBe(false);

      // Simulate server empty snapshot
      act(() => {
        const serverSnapshot = createMockQuerySnapshot([]);
        (serverSnapshot.metadata as any).fromCache = false;
        onNextCallback(serverSnapshot);
      });

      await waitFor(() => {
        expect(result.current.hasConfirmedNoContacts).toBe(true);
      });
    });

    it("should not set hasConfirmedNoContacts if cache had contacts", async () => {
      const mockContacts: Contact[] = [createMockContact({ contactId: "1" })];

      const { result } = renderHook(() => useContactsRealtime(mockUserId));

      // Simulate cached snapshot with contacts
      act(() => {
        const cachedSnapshot = createMockQuerySnapshot(mockContacts);
        (cachedSnapshot.metadata as any).fromCache = true;
        onNextCallback(cachedSnapshot);
      });

      // Simulate server empty snapshot
      act(() => {
        const serverSnapshot = createMockQuerySnapshot([]);
        (serverSnapshot.metadata as any).fromCache = false;
        onNextCallback(serverSnapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.hasConfirmedNoContacts).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should handle Firestore errors", async () => {
      const { result } = renderHook(() => useContactsRealtime(mockUserId));

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
        context: "Fetching contacts (real-time)",
        tags: { component: "useContactsRealtime", userId: mockUserId },
      });
    });

    it("should handle setup errors", async () => {
      mockCollection.mockImplementation(() => {
        throw new Error("Setup error");
      });

      const { result } = renderHook(() => useContactsRealtime(mockUserId));

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("Cleanup", () => {
    it("should unsubscribe on unmount", () => {
      const { unmount } = renderHook(() => useContactsRealtime(mockUserId));

      expect(mockOnSnapshot).toHaveBeenCalled();

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });

    it("should reset state when userId changes to null", async () => {
      const { result, rerender } = renderHook(
        ({ userId }) => useContactsRealtime(userId),
        { initialProps: { userId: mockUserId } }
      );

      // Set up some state
      act(() => {
        const snapshot = createMockQuerySnapshot([createMockContact({ contactId: "1" })]);
        (snapshot.metadata as any).fromCache = false;
        onNextCallback(snapshot);
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Change userId to null
      rerender({ userId: null });

      await waitFor(() => {
        expect(result.current.contacts).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.hasConfirmedNoContacts).toBe(false);
      });
    });
  });
});

