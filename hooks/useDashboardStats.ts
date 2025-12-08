"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Dashboard statistics type
 */
export interface DashboardStats {
  totalContacts: number;
  contactsWithEmail: number;
  contactsWithThreads: number;
  averageEngagementScore: number;
  segmentDistribution: Record<string, number>;
  leadSourceDistribution: Record<string, number>;
  tagDistribution: Record<string, number>;
  sentimentDistribution: Record<string, number>;
  engagementLevels: {
    high: number;
    medium: number;
    low: number;
    none: number;
  };
  upcomingTouchpoints: number;
}

/**
 * Hook to fetch dashboard statistics for a user
 */
export function useDashboardStats(userId: string, initialData?: DashboardStats) {
  const queryClient = useQueryClient();
  
  // Check if data exists in cache first (from previous navigation or prefetch)
  const cachedData = queryClient.getQueryData<DashboardStats>(["dashboard-stats", userId]);
  const dataToUse = initialData || cachedData;

  return useQuery({
    queryKey: ["dashboard-stats", userId],
    queryFn: async () => {
      const response = await fetch("/api/dashboard-stats");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch dashboard stats");
      }
      const data = await response.json();
      return data.stats as DashboardStats;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId,
    initialData: dataToUse,
    // Don't refetch if we have cached data
    refetchOnMount: !dataToUse,
    refetchOnWindowFocus: false,
    // Use cached data as placeholder to avoid loading state
    placeholderData: cachedData,
  });
}
