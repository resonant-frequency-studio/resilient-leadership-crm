"use client";

import { useQuery } from "@tanstack/react-query";
import { ContactWithTouchpoint } from "@/lib/touchpoints-server";

/**
 * Hook to fetch today's touchpoints (up to 3)
 */
export function useDashboardTodayTouchpoints(userId: string) {
  return useQuery({
    queryKey: ["dashboard-touchpoints", userId, "today"],
    queryFn: async () => {
      const response = await fetch("/api/touchpoints/today?limit=3");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch today touchpoints");
      }
      const data = await response.json();
      return data.touchpoints as ContactWithTouchpoint[];
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch overdue touchpoints (up to 3)
 */
export function useDashboardOverdueTouchpoints(userId: string) {
  return useQuery({
    queryKey: ["dashboard-touchpoints", userId, "overdue"],
    queryFn: async () => {
      const response = await fetch("/api/touchpoints/overdue?limit=3");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch overdue touchpoints");
      }
      const data = await response.json();
      return data.touchpoints as ContactWithTouchpoint[];
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/**
 * Hook to fetch upcoming touchpoints (up to 3)
 */
export function useDashboardUpcomingTouchpoints(userId: string) {
  return useQuery({
    queryKey: ["dashboard-touchpoints", userId, "upcoming"],
    queryFn: async () => {
      const response = await fetch("/api/touchpoints/upcoming?limit=3");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch upcoming touchpoints");
      }
      const data = await response.json();
      return data.touchpoints as ContactWithTouchpoint[];
    },
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });
}

