import { adminDb } from "@/lib/firebase-admin";
import { SyncJob } from "@/types/firestore";
import { syncJobsPath } from "@/lib/firestore-paths";
import { reportException } from "@/lib/error-reporting";
import { convertTimestampToISO } from "@/util/timestamp-utils-server";
import { unstable_cache } from "next/cache";

/**
 * Convert a SyncJob document to have ISO string timestamps
 */
function convertSyncJobTimestamps(syncJob: SyncJob & { updatedAt?: unknown; createdAt?: unknown }): SyncJob & { updatedAt?: string | null; createdAt?: string | null } {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { updatedAt: _updatedAt, createdAt: _createdAt, ...rest } = syncJob;
  const converted: SyncJob & { updatedAt?: string | null; createdAt?: string | null } = {
    ...rest,
    startedAt: convertTimestampToISO(syncJob.startedAt) || new Date().toISOString(),
    finishedAt: syncJob.finishedAt ? convertTimestampToISO(syncJob.finishedAt) : null,
  };
  
  // Convert updatedAt and createdAt if they exist
  if ("updatedAt" in syncJob) {
    converted.updatedAt = convertTimestampToISO(syncJob.updatedAt);
  }
  if ("createdAt" in syncJob) {
    converted.createdAt = convertTimestampToISO(syncJob.createdAt);
  }
  
  return converted;
}

/**
 * Internal function to fetch last sync (uncached)
 */
async function getLastSyncForUserUncached(
  userId: string
): Promise<SyncJob | null> {
  try {
    const snapshot = await adminDb
      .collection(syncJobsPath(userId))
      .orderBy("startedAt", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = {
      ...(doc.data() as SyncJob),
      syncJobId: doc.id,
    };

    return convertSyncJobTimestamps(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for quota errors
    if (
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("Quota exceeded")
    ) {
      reportException(error, {
        context: "Getting last sync (quota exceeded)",
        tags: { component: "sync-jobs-server", userId },
      });
      throw new Error("Database quota exceeded. Please wait a few hours or upgrade your plan.");
    }

    reportException(error, {
      context: "Getting last sync",
      tags: { component: "sync-jobs-server", userId },
    });
    throw error;
  }
}

/**
 * Get the most recent sync job for a user (cached)
 * 
 * @param userId - The user ID
 * @returns The most recent sync job or null if none exists
 */
export async function getLastSyncForUser(
  userId: string
): Promise<SyncJob | null> {
  return unstable_cache(
    async () => getLastSyncForUserUncached(userId),
    [`last-sync-${userId}`],
    {
      tags: [`sync-jobs`, `sync-jobs-${userId}`],
      revalidate: 60, // 1 minute (sync jobs change more frequently)
    }
  )();
}

/**
 * Internal function to fetch sync history (uncached)
 */
async function getSyncHistoryForUserUncached(
  userId: string,
  limit: number = 10
): Promise<SyncJob[]> {
  try {
    const snapshot = await adminDb
      .collection(syncJobsPath(userId))
      .orderBy("startedAt", "desc")
      .limit(limit)
      .get();

    if (snapshot.empty) {
      return [];
    }

    const syncJobs = snapshot.docs.map((doc) => {
      const data = {
        ...(doc.data() as SyncJob),
        syncJobId: doc.id,
      };
      return convertSyncJobTimestamps(data);
    });

    return syncJobs;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check for quota errors
    if (
      errorMessage.includes("RESOURCE_EXHAUSTED") ||
      errorMessage.includes("Quota exceeded")
    ) {
      reportException(error, {
        context: "Getting sync history (quota exceeded)",
        tags: { component: "sync-jobs-server", userId },
      });
      throw new Error("Database quota exceeded. Please wait a few hours or upgrade your plan.");
    }

    reportException(error, {
      context: "Getting sync history",
      tags: { component: "sync-jobs-server", userId },
    });
    throw error;
  }
}

/**
 * Get sync history for a user (cached)
 * 
 * @param userId - The user ID
 * @param limit - Maximum number of sync jobs to return (default: 10)
 * @returns Array of sync jobs ordered by startedAt descending
 */
export async function getSyncHistoryForUser(
  userId: string,
  limit: number = 10
): Promise<SyncJob[]> {
  return unstable_cache(
    async () => getSyncHistoryForUserUncached(userId, limit),
    [`sync-history-${userId}-${limit}`],
    {
      tags: [`sync-jobs`, `sync-jobs-${userId}`],
      revalidate: 60, // 1 minute (sync jobs change more frequently)
    }
  )();
}

