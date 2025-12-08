import { getUserId } from "@/lib/auth-utils";
import { getLastSyncForUser, getSyncHistoryForUser } from "@/lib/sync-jobs-server";
import SyncPageClient from "../SyncPageClient";

export default async function SyncData() {
  const userId = await getUserId();

  // Fetch initial sync data on server
  const [lastSync, syncHistory] = await Promise.all([
    getLastSyncForUser(userId).catch(() => null), // Return null on error
    getSyncHistoryForUser(userId, 10).catch(() => []), // Return empty array on error
  ]);

  return (
    <SyncPageClient
      userId={userId}
      initialLastSync={lastSync}
      initialSyncHistory={syncHistory}
    />
  );
}

