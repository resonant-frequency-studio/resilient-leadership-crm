"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActionItem } from "@/types/firestore";

/**
 * Hook to fetch action items
 * @param userId - The user ID
 * @param contactId - Optional contact ID. If provided, fetches action items for that contact only
 * @param initialData - Optional initial data from server prefetch
 */
export function useActionItems(
  userId: string,
  contactId?: string,
  initialData?: ActionItem[] | Array<ActionItem & { contactId: string }>
) {
  const queryClient = useQueryClient();

  const queryKey = contactId
    ? ["action-items", userId, contactId]
    : ["action-items", userId];

  // Check if data exists in cache first (from previous navigation or prefetch)
  const cachedData = queryClient.getQueryData<ActionItem[] | Array<ActionItem & { contactId: string }>>(queryKey);
  const dataToUse = initialData || cachedData;

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (contactId) {
        const response = await fetch(`/api/action-items?contactId=${encodeURIComponent(contactId)}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch action items");
        }
        const data = await response.json();
        return data.actionItems as ActionItem[];
      } else {
        const response = await fetch("/api/action-items/all");
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch action items");
        }
        const data = await response.json();
        return data.actionItems as Array<ActionItem & { contactId: string }>;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId,
    initialData: dataToUse,
    // If fetching single contact's action items, check if all action items are cached
    placeholderData: () => {
      if (contactId && !dataToUse) {
        const allActionItems = queryClient.getQueryData<Array<ActionItem & { contactId: string }>>([
          "action-items",
          userId,
        ]);
        if (allActionItems) {
          return allActionItems.filter((item) => item.contactId === contactId);
        }
      }
      return undefined;
    },
    // Don't refetch if we have cached data
    refetchOnMount: !dataToUse,
    refetchOnWindowFocus: false,
  });
}

