import { useCallback, useEffect, useRef } from "react";

/**
 * Hook to debounce a save function
 * @param saveFn The function to call when saving
 * @param delay Delay in milliseconds (default: 500ms)
 * @returns A debounced save function
 */
export function useDebouncedSave<T extends (...args: unknown[]) => void>(
  saveFn: T,
  delay: number = 500
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSave = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveFn(...args);
      }, delay);
    },
    [saveFn, delay]
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedSave;
}

