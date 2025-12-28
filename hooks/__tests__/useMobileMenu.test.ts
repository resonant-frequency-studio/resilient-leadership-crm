import { renderHook, act, waitFor } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "../useMobileMenu";

// Mock Next.js pathname
const mockPathname = "/";
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => mockPathname),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("useMobileMenu", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.overflow = "";
    mockUsePathname.mockReturnValue("/");
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  describe("Initial state", () => {
    it("should start with menu closed", () => {
      const { result } = renderHook(() => useMobileMenu());

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("Menu toggle", () => {
    it("should toggle menu open and closed", () => {
      const { result } = renderHook(() => useMobileMenu());

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.toggle();
      });

      expect(result.current.isOpen).toBe(false);
    });

    it("should open menu with setIsOpen", () => {
      const { result } = renderHook(() => useMobileMenu());

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);
    });

    it("should close menu with close function", () => {
      const { result } = renderHook(() => useMobileMenu());

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
    });
  });

  describe("Body scroll prevention", () => {
    it("should prevent body scroll when menu is open", () => {
      const { result } = renderHook(() => useMobileMenu());

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(document.body.style.overflow).toBe("hidden");
    });

    it("should restore body scroll when menu is closed", () => {
      const { result } = renderHook(() => useMobileMenu());

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(document.body.style.overflow).toBe("hidden");

      act(() => {
        result.current.setIsOpen(false);
      });

      expect(document.body.style.overflow).toBe("");
    });

    it("should restore body scroll on unmount", () => {
      const { result, unmount } = renderHook(() => useMobileMenu());

      act(() => {
        result.current.setIsOpen(true);
      });

      expect(document.body.style.overflow).toBe("hidden");

      unmount();

      expect(document.body.style.overflow).toBe("");
    });
  });

  describe("Auto-close on navigation", () => {
    it("should close menu when pathname changes", async () => {
      const { result, rerender } = renderHook(() => useMobileMenu());

      // Open menu
      act(() => {
        result.current.setIsOpen(true);
      });

      expect(result.current.isOpen).toBe(true);

      // Change pathname
      mockUsePathname.mockReturnValue("/contacts");
      rerender();

      await waitFor(() => {
        expect(result.current.isOpen).toBe(false);
      });
    });

    it("should not close menu when pathname doesn't change", () => {
      const { result } = renderHook(() => useMobileMenu());

      act(() => {
        result.current.setIsOpen(true);
      });

      // Rerender with same pathname
      renderHook(() => useMobileMenu());

      expect(result.current.isOpen).toBe(true);
    });
  });
});

