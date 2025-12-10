"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Pipeline counts by segment
 */
export interface PipelineCounts {
  [segment: string]: number;
}

/**
 * Hook to fetch pipeline counts (segment distribution)
 */
export function usePipelineCounts(userId: string) {
  return useQuery({
    queryKey: ["pipeline-counts", userId],
    queryFn: async () => {
      const response = await fetch("/api/pipeline-counts");
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch pipeline counts");
      }
      const data = await response.json();
      return data.counts as PipelineCounts;
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute - segments don't change frequently
  });
}

