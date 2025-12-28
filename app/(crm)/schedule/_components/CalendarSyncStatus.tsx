"use client";

import { formatRelativeTime } from "@/util/time-utils";
import { SyncJob } from "@/types/firestore";

interface CalendarSyncStatusProps {
  lastSync: SyncJob | null;
  loading: boolean;
}

export default function CalendarSyncStatus({ lastSync, loading }: CalendarSyncStatusProps) {
  if (loading) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-theme-dark text-sm">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span>
        Up to date as of {lastSync?.finishedAt ? formatRelativeTime(lastSync.finishedAt) : "never synced"}
      </span>
      <span className="text-theme-medium">•</span>
      <a
        href="/sync"
        className="text-blue-600 hover:text-blue-800 underline text-sm"
      >
        Sync preferences
      </a>
    </div>
  );
}

