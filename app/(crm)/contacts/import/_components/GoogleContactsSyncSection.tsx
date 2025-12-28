"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { ErrorMessage } from "@/components/ErrorMessage";
import Link from "next/link";
import { SyncJob } from "@/types/firestore";

interface GoogleContactsSyncSectionProps {
  lastContactsSync: SyncJob | null;
  formatLastSyncTime: (syncJob: SyncJob | null) => string | null;
  onSync: () => Promise<void>;
  syncing: boolean;
  error: string | null;
  syncJob: SyncJob | null;
  isImporting: boolean;
  onDismissError: () => void;
  onDismissJob: () => void;
}

export default function GoogleContactsSyncSection({
  lastContactsSync,
  formatLastSyncTime,
  onSync,
  syncing,
  error,
  syncJob,
  isImporting,
  onDismissError,
  onDismissJob,
}: GoogleContactsSyncSectionProps) {
  return (
    <Card padding="md" className="bg-sync-green-bg border-sync-green-border">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-lg font-semibold text-sync-green-text-primary">Import from Google Contacts</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Automatic sync active
            </span>
          </div>
          <div className="text-sm text-sync-green-text-secondary mb-3">
            <p className="mb-1 font-medium text-sync-green-text-primary">
              <strong>Automatic sync is enabled.</strong> Your contacts sync automatically daily and also syncs Gmail threads for newly imported contacts.
            </p>
            {lastContactsSync && lastContactsSync.status === "complete" && (
              <p className="text-xs text-sync-green-text-secondary mb-2">
                Last synced: {formatLastSyncTime(lastContactsSync)} • View sync status and history on the{" "}
                <Link href="/sync" className="underline font-medium hover:text-sync-green-text-primary">
                  Sync page
                </Link>
                .
              </p>
            )}
            {(!lastContactsSync || lastContactsSync?.status !== "complete") && (
              <p className="text-xs text-sync-green-text-secondary mb-2">
                View sync status and history on the{" "}
                <Link href="/sync" className="underline font-medium hover:text-sync-green-text-primary">
                  Sync page
                </Link>
                .
              </p>
            )}
            <p className="text-xs text-sync-green-text-secondary mt-1">
              You can also manually trigger a sync now if needed.
            </p>
          </div>
          {error && (
            <ErrorMessage
              message={error}
              dismissible
              onDismiss={onDismissError}
              className="mb-4"
            />
          )}
          {syncJob && syncJob.status === "running" && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-theme-darker">
                  {syncJob.currentStep === "importing" && "Importing contacts from Google..."}
                  {syncJob.currentStep === "syncing_gmail" && "Syncing Gmail threads..."}
                  {syncJob.currentStep === "generating_insights" && "Generating contact insights..."}
                  {!syncJob.currentStep && "Processing contacts..."}
                </span>
                {syncJob.totalContacts && syncJob.processedContacts !== undefined && (
                  <span className="text-sm text-theme-dark">
                    {syncJob.processedContacts + (syncJob.skippedContacts || 0)} / {syncJob.totalContacts}
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    width: syncJob.totalContacts && syncJob.processedContacts !== undefined
                      ? `${((syncJob.processedContacts + (syncJob.skippedContacts || 0)) / syncJob.totalContacts) * 100}%`
                      : "0%",
                  }}
                ></div>
              </div>
              <p className="text-xs text-theme-dark mt-2">
                {syncJob.processedContacts || 0} imported, {syncJob.skippedContacts || 0} skipped
                {syncJob.currentStep === "syncing_gmail" || syncJob.currentStep === "generating_insights"
                  ? " • Syncing Gmail and generating insights for imported contacts..."
                  : ""}
              </p>
              <p className="text-xs text-theme-dark mt-1 italic">
                You can navigate away - processing will continue in the background
              </p>
            </div>
          )}
          {syncJob && syncJob.status === "complete" && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-sm">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">
                    Import completed successfully
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {syncJob.processedContacts || 0} contacts imported, {syncJob.skippedContacts || 0} skipped
                  </p>
                  <div className="mt-2">
                    <Link href="/contacts">
                      <Button variant="primary" size="sm">
                        View Contacts
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          {syncJob && syncJob.status === "error" && (
            <ErrorMessage
              message={syncJob.errorMessage || "Import failed"}
              dismissible
              onDismiss={onDismissJob}
              className="mb-4"
            />
          )}
          <Button
            onClick={onSync}
            disabled={syncing || isImporting || (syncJob?.status === "running")}
            loading={syncing}
            variant="secondary"
            size="md"
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
          >
            Sync Contacts Now
          </Button>
        </div>
      </div>
    </Card>
  );
}

