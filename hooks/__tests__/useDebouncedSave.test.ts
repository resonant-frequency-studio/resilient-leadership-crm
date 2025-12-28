import { renderHook, act, waitFor } from "@testing-library/react";
import { useDebouncedSave } from "../useDebouncedSave";

describe("useDebouncedSave", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Debouncing", () => {
    it("should debounce function calls", () => {
      const saveFn = jest.fn();
      const { result } = renderHook(() => useDebouncedSave(saveFn, 500));

      act(() => {
        result.current();
        result.current();
        result.current();
      });

      expect(saveFn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(saveFn).toHaveBeenCalledTimes(1);
    });

    it("should reset timer on each call", () => {
      const saveFn = jest.fn();
      const { result } = renderHook(() => useDebouncedSave(saveFn, 500));

      act(() => {
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      act(() => {
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(400);
      });

      expect(saveFn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(saveFn).toHaveBeenCalledTimes(1);
    });

    it("should use custom delay", () => {
      const saveFn = jest.fn();
      const { result } = renderHook(() => useDebouncedSave(saveFn, 1000));

      act(() => {
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(saveFn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(saveFn).toHaveBeenCalledTimes(1);
    });

    it("should use default 500ms delay when not specified", () => {
      const saveFn = jest.fn();
      const { result } = renderHook(() => useDebouncedSave(saveFn));

      act(() => {
        result.current();
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(saveFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("Function arguments", () => {
    it("should pass arguments to debounced function", () => {
      const saveFn = jest.fn();
      const { result } = renderHook(() => useDebouncedSave(saveFn, 500));

      act(() => {
        result.current("arg1", "arg2", 123);
      });

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(saveFn).toHaveBeenCalledWith("arg1", "arg2", 123);
    });
  });

  describe("Cleanup", () => {
    it("should clear timeout on unmount", () => {
      const saveFn = jest.fn();
      const { result, unmount } = renderHook(() => useDebouncedSave(saveFn, 500));

      act(() => {
        result.current();
      });

      unmount();

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(saveFn).not.toHaveBeenCalled();
    });
  });
});

