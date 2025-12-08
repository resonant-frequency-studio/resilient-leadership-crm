"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Contact } from "@/types/firestore";

/**
 * Hook to fetch all contacts for a user
 */
export function useContacts(userId: string, initialData?: Contact[]) {
  const queryClient = useQueryClient();
  
  // Check if data exists in cache first (from previous navigation or prefetch)
  const cachedData = queryClient.getQueryData<Contact[]>(["contacts", userId]);
  const dataToUse = initialData || cachedData;

  return useQuery({
    queryKey: ["contacts", userId],
    queryFn: async () => {
      const response = await fetch("/api/contacts");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch contacts");
      }
      const data = await response.json();
      return data.contacts as Contact[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId,
    initialData: dataToUse, // Use server-prefetched or cached data
    // Don't refetch if we have cached data
    refetchOnMount: !dataToUse,
    refetchOnWindowFocus: false,
    // Use cached data as placeholder to avoid loading state
    placeholderData: cachedData,
  });
}

