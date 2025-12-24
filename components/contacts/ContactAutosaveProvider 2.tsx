"use client";

import { createContext, useContext, useState, useCallback, useMemo, useRef, ReactNode } from "react";

interface ContactAutosaveContextType {
  // State
  dirtyKeys: Set<string>;
  isSaving: boolean;
  pendingCount: number;
  lastSavedAt: number | null;
  lastError: { message: string; key?: string } | null;
  hasUnsavedChanges: boolean;

  // Actions
  markDirty: (key: string) => void;
  markClean: (key: string) => void;
  registerPending: (promise: Promise<unknown | void>, key?: string) => void;
  setError: (error: { message: string; key?: string }) => void;
  registerFlushCallback: (callback: () => Promise<void>) => void;
  flush: () => Promise<boolean>;
  clearError: () => void;
}

export const ContactAutosaveContext = createContext<ContactAutosaveContextType | undefined>(undefined);

export function ContactAutosaveProvider({ children }: { children: ReactNode }) {
  const [dirtyKeys, setDirtyKeys] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const [lastError, setLastError] = useState<{ message: string; key?: string } | null>(null);
  const [pendingPromises, setPendingPromises] = useState<Set<Promise<unknown | void>>>(new Set());
  const flushCallbackRef = useRef<(() => Promise<void>) | null>(null);

  const markDirty = useCallback((key: string) => {
    setDirtyKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
    // Clear error when marking dirty (user is making new changes)
    setLastError(null);
  }, []);

  const markClean = useCallback((key: string) => {
    setDirtyKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    setLastSavedAt(Date.now());
  }, []);

  const setError = useCallback((error: { message: string; key?: string }) => {
    setLastError(error);
  }, []);

  const registerPending = useCallback((promise: Promise<unknown | void>, key?: string) => {
    setPendingPromises((prev) => {
      const next = new Set(prev);
      next.add(promise);
      return next;
    });
    setPendingCount((prev) => prev + 1);
    setIsSaving(true);

    promise
      .then(() => {
        setPendingPromises((prev) => {
          const next = new Set(prev);
          next.delete(promise);
          return next;
        });
        setPendingCount((prev) => {
          const newCount = prev - 1;
          if (newCount === 0) {
            setIsSaving(false);
          }
          return newCount;
        });
      })
      .catch((error) => {
        setPendingPromises((prev) => {
          const next = new Set(prev);
          next.delete(promise);
          return next;
        });
        setPendingCount((prev) => {
          const newCount = prev - 1;
          if (newCount === 0) {
            setIsSaving(false);
          }
          return newCount;
        });
        // Set error if provided
        const errorMessage = error instanceof Error ? error.message : "Failed to save changes";
        setLastError({ message: errorMessage, key });
      });
  }, []);

  const registerFlushCallback = useCallback((callback: () => Promise<void>) => {
    flushCallbackRef.current = callback;
  }, []);

  const flush = useCallback(async (): Promise<boolean> => {
    // First, trigger the hook's flush to execute any scheduled saves
    if (flushCallbackRef.current) {
      try {
        await flushCallbackRef.current();
      } catch (error) {
        // Errors are handled by individual save functions
      }
    }

    // Then wait for all pending promises to complete
    if (pendingPromises.size > 0) {
      try {
        await Promise.allSettled(Array.from(pendingPromises));
      } catch (error) {
        // Individual promises handle their own errors
      }
    }

    // Return true if everything is saved, false if there are still errors or dirty keys
    return dirtyKeys.size === 0 && pendingCount === 0 && lastError === null;
  }, [pendingPromises, dirtyKeys, pendingCount, lastError]);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const hasUnsavedChanges = useMemo(() => {
    return dirtyKeys.size > 0 || pendingCount > 0;
  }, [dirtyKeys, pendingCount]);

  const value: ContactAutosaveContextType = {
    dirtyKeys,
    isSaving,
    pendingCount,
    lastSavedAt,
    lastError,
    hasUnsavedChanges,
    markDirty,
    markClean,
    registerPending,
    setError,
    registerFlushCallback,
    flush,
    clearError,
  };

  return (
    <ContactAutosaveContext.Provider value={value}>
      {children}
    </ContactAutosaveContext.Provider>
  );
}

export function useContactAutosave() {
  const context = useContext(ContactAutosaveContext);
  if (context === undefined) {
    throw new Error("useContactAutosave must be used within ContactAutosaveProvider");
  }
  return context;
}

