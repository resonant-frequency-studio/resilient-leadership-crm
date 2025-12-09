"use client";

import { useQuery } from "@tanstack/react-query";
import { Contact } from "@/types/firestore";

/**
 * Hook to fetch all contacts for a user
 * 
 * ⚠️ CRITICAL: Does NOT use placeholderData - it masks stale data and prevents React Query
 * from recognizing when fresh data arrives after invalidation.
 * 
 * placeholderData was causing React Query to return cached data even after invalidation,
 * because it overrides the query response with old cached values.
 */
export function useContacts(userId: string, initialData?: Contact[]) {
  return useQuery({
    queryKey: ["contacts", userId],
    queryFn: async () => {
      // Force no-store to ensure fresh data from API (which also uses no-store)
      const response = await fetch("/api/contacts", { cache: "no-store" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch contacts");
      }
      const data = await response.json();
      return data.contacts as Contact[];
    },
    enabled: !!userId,
    staleTime: 0, // Contacts list changes frequently - always refetch
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // ONLY use initialData for SSR - do NOT use placeholderData
    // placeholderData was preventing React Query from recognizing fresh data
    initialData, // Only if SSR provides initial list
  });
}

