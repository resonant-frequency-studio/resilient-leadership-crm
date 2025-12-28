import { renderHook, waitFor } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { auth } from "@/lib/firebase-client";
import { onAuthStateChanged, User } from "firebase/auth";

// Mock Firebase
jest.mock("@/lib/firebase-client", () => ({
  auth: {},
}));

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
}));

const mockOnAuthStateChanged = onAuthStateChanged as jest.MockedFunction<typeof onAuthStateChanged>;

describe("useAuth", () => {
  let unsubscribe: jest.Mock;
  let onAuthCallback: (user: User | null) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    unsubscribe = jest.fn();
    
    mockOnAuthStateChanged.mockImplementation((authInstance, callback) => {
      onAuthCallback = callback as (user: User | null) => void;
      return unsubscribe;
    });
  });

  describe("Initial state", () => {
    it("should start with loading true and user null", () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.loading).toBe(true);
      expect(result.current.user).toBeNull();
      expect(mockOnAuthStateChanged).toHaveBeenCalledWith(auth, expect.any(Function));
    });
  });

  describe("Auth state changes", () => {
    it("should update user when authenticated", async () => {
      const mockUser = { uid: "user-123", email: "test@example.com" } as User;

      const { result } = renderHook(() => useAuth());

      // Simulate auth state change
      onAuthCallback(mockUser);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toEqual(mockUser);
    });

    it("should set user to null when signed out", async () => {
      const mockUser = { uid: "user-123" } as User;

      const { result } = renderHook(() => useAuth());

      // First authenticate
      onAuthCallback(mockUser);
      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
      });

      // Then sign out
      onAuthCallback(null);

      await waitFor(() => {
        expect(result.current.user).toBeNull();
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("Cleanup", () => {
    it("should unsubscribe on unmount", () => {
      const { unmount } = renderHook(() => useAuth());

      expect(mockOnAuthStateChanged).toHaveBeenCalled();

      unmount();

      expect(unsubscribe).toHaveBeenCalled();
    });
  });
});

