import { getUserId } from "@/lib/auth-utils";
import { getLastSyncForUser, getSyncHistoryForUser } from "@/lib/sync-jobs-server";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import SyncPageClientWrapper from "./SyncPageClientWrapper";

export default async function SyncData() {
  const userId = await getUserId();
  const queryClient = getQueryClient();

  // Prefetch sync data on server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["sync-jobs", userId, "last"],
      queryFn: () => getLastSyncForUser(userId).catch(() => null),
    }),
    queryClient.prefetchQuery({
      queryKey: ["sync-jobs", userId, "history"],
      queryFn: () => getSyncHistoryForUser(userId, 10).catch(() => []),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SyncPageClientWrapper userId={userId} />
    </HydrationBoundary>
  );
}

