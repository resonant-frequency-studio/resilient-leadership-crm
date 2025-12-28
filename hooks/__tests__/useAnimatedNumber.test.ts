import { renderHook, act, waitFor } from "@testing-library/react";
import { useAnimatedNumber } from "../useAnimatedNumber";

// Mock requestAnimationFrame
const mockRAF = jest.fn((callback: FrameRequestCallback) => {
  setTimeout(callback, 16); // Simulate ~60fps
  return 1;
});
const mockCAF = jest.fn((id: number) => {});

global.requestAnimationFrame = mockRAF;
global.cancelAnimationFrame = mockCAF;

describe("useAnimatedNumber", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Initial state", () => {
    it("should start at 0", () => {
      const { result } = renderHook(() => useAnimatedNumber(100));

      expect(result.current).toBe(0);
    });
  });

  describe("Animation", () => {
    it("should animate to target value", async () => {
      const { result, rerender } = renderHook(
        ({ target }) => useAnimatedNumber(target),
        { initialProps: { target: 100 } }
      );

      // Trigger animation
      act(() => {
        jest.advanceTimersByTime(16);
      });

      // Should start animating
      await waitFor(() => {
        expect(result.current).toBeGreaterThan(0);
      }, { timeout: 1000 });

      // Advance time to complete animation
      act(() => {
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(result.current).toBe(100);
      });
    });

    it("should use custom duration", async () => {
      const { result } = renderHook(() =>
        useAnimatedNumber(100, { duration: 1000 })
      );

      act(() => {
        jest.advanceTimersByTime(16);
      });

      await waitFor(() => {
        expect(result.current).toBeGreaterThan(0);
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current).toBe(100);
      });
    });

    it("should use custom easing function", async () => {
      const linearEasing = (t: number) => t;
      const { result } = renderHook(() =>
        useAnimatedNumber(100, { easing: linearEasing })
      );

      act(() => {
        jest.advanceTimersByTime(16);
      });

      await waitFor(() => {
        expect(result.current).toBeGreaterThan(0);
      });
    });
  });

  describe("Edge cases", () => {
    it("should set to 0 immediately if target is 0 or less", () => {
      const { result } = renderHook(() => useAnimatedNumber(0));

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe(0);
    });

    it("should set to 0 immediately if target is negative", () => {
      const { result } = renderHook(() => useAnimatedNumber(-10));

      act(() => {
        jest.advanceTimersByTime(0);
      });

      expect(result.current).toBe(0);
    });

    it("should not animate if already at target", () => {
      const { result, rerender } = renderHook(
        ({ target }) => useAnimatedNumber(target),
        { initialProps: { target: 100 } }
      );

      // Animate to 100
      act(() => {
        jest.advanceTimersByTime(600);
      });

      const initialCallCount = mockRAF.mock.calls.length;

      // Set target to same value
      rerender({ target: 100 });

      act(() => {
        jest.advanceTimersByTime(16);
      });

      // Should not trigger new animation
      expect(mockRAF.mock.calls.length).toBe(initialCallCount);
    });
  });

  describe("Target changes", () => {
    it("should animate from current value to new target", async () => {
      const { result, rerender } = renderHook(
        ({ target }) => useAnimatedNumber(target),
        { initialProps: { target: 50 } }
      );

      // Animate to 50
      act(() => {
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(result.current).toBe(50);
      });

      // Change target to 100
      rerender({ target: 100 });

      act(() => {
        jest.advanceTimersByTime(16);
      });

      await waitFor(() => {
        expect(result.current).toBeGreaterThan(50);
      });

      act(() => {
        jest.advanceTimersByTime(600);
      });

      await waitFor(() => {
        expect(result.current).toBe(100);
      });
    });
  });

  describe("Cleanup", () => {
    it("should clean up animation on unmount", () => {
      const { result, unmount } = renderHook(
        ({ target }) => useAnimatedNumber(target),
        { initialProps: { target: 100 } }
      );

      // Advance time to potentially trigger animation
      act(() => {
        jest.advanceTimersByTime(16);
      });

      // Unmount should clean up without errors
      // The cleanup function in useEffect will cancel any active animation
      expect(() => unmount()).not.toThrow();
    });
  });
});

