import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

/**
 * Get or create a QueryClient instance for SSR.
 * Uses React's cache() to ensure one QueryClient per request in Next.js App Router.
 */
export const getQueryClient = cache(() => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000, // 10 minutes (increased from 5)
        gcTime: 30 * 60 * 1000, // 30 minutes (increased from 10)
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch on mount if data exists
        refetchOnReconnect: false, // Don't refetch on reconnect
        retry: 1, // Only retry once on failure
      },
    },
  });
});

