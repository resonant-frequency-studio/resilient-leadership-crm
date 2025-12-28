import { renderHook, act, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useSessionManagement } from "../useSessionManagement";
import { User } from "firebase/auth";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock fetch
global.fetch = jest.fn();

// Mock reportException
jest.mock("@/lib/error-reporting", () => ({
  reportException: jest.fn(),
}));

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe("useSessionManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Login page", () => {
    it("should not check session on login page", () => {
      renderHook(() =>
        useSessionManagement(
          true, // isLoginPage
          false, // loading
          { uid: "user-123" } as User // user
        )
      );

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Loading state", () => {
    it("should not check session while loading", () => {
      renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          true, // loading
          null // user
        )
      );

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("No user", () => {
    it("should check session cookie when no Firebase user", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      } as Response);

      const { result } = renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          false, // loading
          null // user
        )
      );

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/auth/check", {
          credentials: "include",
        });
      });

      await waitFor(() => {
        expect(result.current.hasSessionCookie).toBe(true);
      });
    });

    it("should set hasSessionCookie to false on fetch error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          false, // loading
          null // user
        )
      );

      await waitFor(() => {
        expect(result.current.hasSessionCookie).toBe(false);
      });
    });
  });

  describe("Authenticated user", () => {
    it("should check session periodically when user is authenticated", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
      } as Response);

      renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          false, // loading
          { uid: "user-123" } as User // user
        )
      );

      // Wait for initial delay (2 seconds)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Advance 5 minutes for periodic check
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });

    it("should redirect after multiple session check failures", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
      } as Response);

      renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          false, // loading
          { uid: "user-123" } as User // user
        )
      );

      // Wait for initial delay
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Trigger second failure
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/login?expired=true");
      });
    });

    it("should reset failure count on successful check", async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: false } as Response)
        .mockResolvedValueOnce({ ok: true } as Response);

      renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          false, // loading
          { uid: "user-123" } as User // user
        )
      );

      // Wait for initial delay
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Advance for periodic check (should succeed and reset count)
      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });

      // Should not redirect after success
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should set hasSessionCookie to true when user exists", () => {
      const { result } = renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          false, // loading
          { uid: "user-123" } as User // user
        )
      );

      expect(result.current.hasSessionCookie).toBe(true);
    });
  });

  describe("Error handling", () => {
    it("should not increment failure count on network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          false, // loading
          { uid: "user-123" } as User // user
        )
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      // Should not redirect on network errors
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Cleanup", () => {
    it("should clear interval on unmount", () => {
      mockFetch.mockResolvedValue({
        ok: true,
      } as Response);

      const { unmount } = renderHook(() =>
        useSessionManagement(
          false, // isLoginPage
          false, // loading
          { uid: "user-123" } as User // user
        )
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      unmount();

      // Advance time - should not trigger more checks
      const callCount = mockFetch.mock.calls.length;

      act(() => {
        jest.advanceTimersByTime(5 * 60 * 1000);
      });

      expect(mockFetch.mock.calls.length).toBe(callCount);
    });
  });
});

