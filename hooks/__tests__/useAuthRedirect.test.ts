import { renderHook } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { useAuthRedirect } from "../useAuthRedirect";
import { User } from "firebase/auth";

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("useAuthRedirect", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Login page", () => {
    it("should not redirect when on login page", () => {
      renderHook(() =>
        useAuthRedirect(
          true, // isLoginPage
          false, // loading
          null, // user
          null // hasSessionCookie
        )
      );

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Loading state", () => {
    it("should not redirect while loading", () => {
      renderHook(() =>
        useAuthRedirect(
          false, // isLoginPage
          true, // loading
          null, // user
          null // hasSessionCookie
        )
      );

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("should not redirect while checking session cookie", () => {
      renderHook(() =>
        useAuthRedirect(
          false, // isLoginPage
          false, // loading
          null, // user
          null // hasSessionCookie (null means still checking)
        )
      );

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Authenticated user", () => {
    it("should not redirect when user is authenticated", () => {
      const mockUser = { uid: "user-123" } as User;

      renderHook(() =>
        useAuthRedirect(
          false, // isLoginPage
          false, // loading
          mockUser, // user
          null // hasSessionCookie
        )
      );

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe("Unauthenticated user", () => {
    it("should redirect to login when not authenticated and no session cookie", () => {
      renderHook(() =>
        useAuthRedirect(
          false, // isLoginPage
          false, // loading
          null, // user
          false // hasSessionCookie
        )
      );

      expect(mockPush).toHaveBeenCalledWith("/login");
    });

    it("should not redirect when session cookie is valid", () => {
      renderHook(() =>
        useAuthRedirect(
          false, // isLoginPage
          false, // loading
          null, // user
          true // hasSessionCookie
        )
      );

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

