import { renderHook, act } from "@testing-library/react";
import { useSidebarState } from "../useSidebarState";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

describe("useSidebarState", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("Initial state", () => {
    it("should start collapsed if localStorage has 'true'", () => {
      localStorage.setItem("sidebarCollapsed", "true");

      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isCollapsed).toBe(true);
    });

    it("should start expanded if localStorage has 'false'", () => {
      localStorage.setItem("sidebarCollapsed", "false");

      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isCollapsed).toBe(false);
    });

    it("should start expanded if localStorage is empty", () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isCollapsed).toBe(false);
    });
  });

  describe("Toggle collapse", () => {
    it("should toggle from expanded to collapsed", () => {
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isCollapsed).toBe(false);

      act(() => {
        result.current.toggleCollapse();
      });

      expect(result.current.isCollapsed).toBe(true);
    });

    it("should toggle from collapsed to expanded", () => {
      localStorage.setItem("sidebarCollapsed", "true");
      const { result } = renderHook(() => useSidebarState());

      expect(result.current.isCollapsed).toBe(true);

      act(() => {
        result.current.toggleCollapse();
      });

      expect(result.current.isCollapsed).toBe(false);
    });

    it("should persist state to localStorage when toggling", () => {
      const { result } = renderHook(() => useSidebarState());

      act(() => {
        result.current.toggleCollapse();
      });

      expect(localStorage.getItem("sidebarCollapsed")).toBe("true");

      act(() => {
        result.current.toggleCollapse();
      });

      expect(localStorage.getItem("sidebarCollapsed")).toBe("false");
    });
  });

  describe("Direct state updates", () => {
    it("should update state and persist to localStorage", () => {
      const { result } = renderHook(() => useSidebarState());

      act(() => {
        result.current.setIsCollapsed(true);
      });

      expect(result.current.isCollapsed).toBe(true);
      expect(localStorage.getItem("sidebarCollapsed")).toBe("true");

      act(() => {
        result.current.setIsCollapsed(false);
      });

      expect(result.current.isCollapsed).toBe(false);
      expect(localStorage.getItem("sidebarCollapsed")).toBe("false");
    });
  });
});

