"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { ErrorMessage } from "@/components/ErrorMessage";

interface GmailSyncSectionProps {
  onSync: () => void;
  syncing: boolean;
  error: string | null;
  onDismissError: () => void;
}

export default function GmailSyncSection({
  onSync,
  syncing,
  error,
  onDismissError,
}: GmailSyncSectionProps) {
  return (
    <Card padding="md" className="bg-sync-blue-bg border-sync-blue-border">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-sync-blue-text-primary">Sync Gmail</h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Automatic sync active
            </span>
          </div>
          <div className="text-xs text-sync-blue-text-secondary mb-3">
            <p className="mb-1 font-medium text-sync-blue-text-primary">
              Automatic sync is enabled. Gmail threads sync automatically every 15-30 minutes using efficient incremental sync.
            </p>
            <p className="mb-1 mt-2">Click below to manually sync Gmail threads now. This will:</p>
            <ul className="list-disc list-inside mt-1 space-y-0.5">
              <li>Download recent email threads (or all threads if this is your first sync)</li>
              <li>Match emails to existing contacts by email address</li>
              <li>Store email messages and thread metadata in your CRM</li>
              <li>Update contact last email dates and thread counts</li>
            </ul>
          </div>
        </div>
        <div className="shrink-0">
          <Button
            onClick={onSync}
            disabled={syncing}
            loading={syncing}
            size="sm"
            variant="secondary"
            className="w-full sm:w-auto"
            icon={
              <svg
                className="w-5 h-5"
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
            }
          >
            Sync Gmail
          </Button>
        </div>
      </div>
      {error && (
        <ErrorMessage
          message={error}
          dismissible
          onDismiss={onDismissError}
          className="mt-3"
        />
      )}
    </Card>
  );
}

