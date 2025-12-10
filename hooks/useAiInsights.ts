"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * AI Insight data structure
 */
export interface AiInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  actionHref: string;
}

/**
 * Hook to fetch AI insights
 */
export function useAiInsights(userId: string) {
  return useQuery({
    queryKey: ["ai-insights", userId],
    queryFn: async () => {
      const response = await fetch("/api/insights");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch AI insights");
      }
      const data = await response.json();
      return data.insights as AiInsight[];
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes - insights don't need to update too frequently
  });
}

