import { renderHook, act } from "@testing-library/react";
import { useSidebarDrag } from "../useSidebarDrag";

describe("useSidebarDrag", () => {
  let mockSetIsCollapsed: jest.Mock;
  let mockHandlePointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  let mockHandleKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSetIsCollapsed = jest.fn();
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    document.body.style.pointerEvents = "";

    // Mock pointer capture methods
    const mockElement = {
      setPointerCapture: jest.fn(),
      releasePointerCapture: jest.fn(),
      hasPointerCapture: jest.fn(() => false),
    } as unknown as HTMLElement;

    const { result } = renderHook(() =>
      useSidebarDrag(false, mockSetIsCollapsed)
    );

    mockHandlePointerDown = result.current.handlePointerDown;
    mockHandleKeyDown = result.current.handleKeyDown;
  });

  afterEach(() => {
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    document.body.style.pointerEvents = "";
  });

  describe("Keyboard handling", () => {
    it("should toggle on Enter key", () => {
      const event = {
        key: "Enter",
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLDivElement>;

      act(() => {
        mockHandleKeyDown(event);
      });

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockSetIsCollapsed).toHaveBeenCalledWith(true);
    });

    it("should toggle on Space key", () => {
      const event = {
        key: " ",
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLDivElement>;

      act(() => {
        mockHandleKeyDown(event);
      });

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockSetIsCollapsed).toHaveBeenCalledWith(true);
    });

    it("should not toggle on other keys", () => {
      const event = {
        key: "Tab",
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent<HTMLDivElement>;

      act(() => {
        mockHandleKeyDown(event);
      });

      expect(mockSetIsCollapsed).not.toHaveBeenCalled();
    });
  });

  describe("Pointer events", () => {
    it("should handle click (no drag) as toggle", () => {
      const mockElement = {
        setPointerCapture: jest.fn(),
        releasePointerCapture: jest.fn(),
        hasPointerCapture: jest.fn(() => false),
      } as unknown as HTMLElement;

      const event = {
        target: mockElement,
        currentTarget: mockElement,
        pointerId: 1,
        clientX: 100,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as unknown as React.PointerEvent<HTMLDivElement>;

      // Mock window event listeners
      const mockAddEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();
      window.addEventListener = mockAddEventListener;
      window.removeEventListener = mockRemoveEventListener;

      act(() => {
        mockHandlePointerDown(event);
      });

      // Simulate pointer up without movement
      const pointerUpEvent = {
        pointerId: 1,
        preventDefault: jest.fn(),
      } as PointerEvent;

      const upHandler = mockAddEventListener.mock.calls.find(
        (call) => call[0] === "pointerup"
      )?.[1] as (e: PointerEvent) => void;

      if (upHandler) {
        act(() => {
          upHandler(pointerUpEvent);
        });
      }

      // Should toggle since no drag occurred
      expect(mockSetIsCollapsed).toHaveBeenCalled();
    });

    it("should prevent default and stop propagation", () => {
      const mockElement = {
        setPointerCapture: jest.fn(),
        releasePointerCapture: jest.fn(),
        hasPointerCapture: jest.fn(() => false),
      } as unknown as HTMLElement;

      const event = {
        target: mockElement,
        currentTarget: mockElement,
        pointerId: 1,
        clientX: 100,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as unknown as React.PointerEvent<HTMLDivElement>;

      window.addEventListener = jest.fn();

      act(() => {
        mockHandlePointerDown(event);
      });

      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it("should set body styles during drag", () => {
      const mockElement = {
        setPointerCapture: jest.fn(),
        releasePointerCapture: jest.fn(),
        hasPointerCapture: jest.fn(() => false),
      } as unknown as HTMLElement;

      const event = {
        target: mockElement,
        currentTarget: mockElement,
        pointerId: 1,
        clientX: 100,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as unknown as React.PointerEvent<HTMLDivElement>;

      window.addEventListener = jest.fn();

      act(() => {
        mockHandlePointerDown(event);
      });

      expect(document.body.style.userSelect).toBe("none");
      expect(document.body.style.cursor).toBe("grabbing");
    });
  });

  describe("Edge cases", () => {
    it("should handle pointer capture failure gracefully", () => {
      const mockElement = {
        setPointerCapture: jest.fn(() => {
          throw new Error("Capture failed");
        }),
        releasePointerCapture: jest.fn(),
        hasPointerCapture: jest.fn(() => false),
      } as unknown as HTMLElement;

      const event = {
        target: mockElement,
        currentTarget: mockElement,
        pointerId: 1,
        clientX: 100,
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as unknown as React.PointerEvent<HTMLDivElement>;

      window.addEventListener = jest.fn();

      // Should not throw
      act(() => {
        mockHandlePointerDown(event);
      });

      // Styles should be restored
      expect(document.body.style.userSelect).toBe("");
    });
  });
});

