"use client";

import { useSyncJobs } from "@/hooks/useSyncJobs";
import { SyncJob } from "@/types/firestore";
import SyncPageClient from "../SyncPageClient";
import { useQueryClient } from "@tanstack/react-query";

export default function SyncPageClientWrapper({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  
  // Get prefetched data from React Query cache (from server prefetch)
  const prefetchedLastSync = queryClient.getQueryData<SyncJob | null>(["sync-jobs", userId, "last"]);
  const prefetchedSyncHistory = queryClient.getQueryData<SyncJob[]>(["sync-jobs", userId, "history"]);
  
  const { data: lastSyncData } = useSyncJobs(userId, false, prefetchedLastSync);
  const { data: syncHistoryData } = useSyncJobs(userId, true, prefetchedSyncHistory);

  // Type guard to ensure lastSync is a single SyncJob, not an array
  const lastSync = Array.isArray(lastSyncData) ? null : (lastSyncData as SyncJob | null);
  const syncHistory = Array.isArray(syncHistoryData) ? (syncHistoryData as SyncJob[]) : [];

  return (
    <SyncPageClient
      userId={userId}
      initialLastSync={lastSync}
      initialSyncHistory={syncHistory}
    />
  );
}

