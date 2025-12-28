"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { ErrorMessage, extractErrorMessage } from "@/components/ErrorMessage";
import { SyncJob } from "@/types/firestore";

interface SyncHistoryTableProps {
  syncHistory: SyncJob[];
  onClearHistory: () => void;
  clearingHistory: boolean;
  clearError: string | null;
  onDismissClearError: () => void;
  formatDate: (date: unknown) => string;
  getStatusColor: (status: string) => string;
}

export default function SyncHistoryTable({
  syncHistory,
  onClearHistory,
  clearingHistory,
  clearError,
  onDismissClearError,
  formatDate,
  getStatusColor,
}: SyncHistoryTableProps) {
  return (
    <Card padding="md">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-theme-darkest mb-1">Sync History</h2>
          <p className="text-xs sm:text-sm text-theme-medium">
            View past sync operations for Gmail, Calendar, and Contacts. Each entry shows what was synced, when it started, and the results.
          </p>
        </div>
        {syncHistory.length > 1 && (
          <div className="shrink-0 sm:ml-4">
            <Button
              onClick={onClearHistory}
              disabled={clearingHistory}
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              icon={
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              }
              title="Removes all sync history except the most recent sync job for each service. This action cannot be undone."
            >
              Clear History
            </Button>
          </div>
        )}
      </div>
      
      {clearError && (
        <ErrorMessage
          message={clearError}
          dismissible
          onDismiss={onDismissClearError}
          className="mb-4"
        />
      )}

      {syncHistory.length === 0 ? (
        <p className="text-theme-medium text-center py-8">No sync history available yet</p>
      ) : (
        <div className="space-y-3">
          {syncHistory.map((job) => {
            const isGmail = job.service === "gmail" || !job.service;
            const isCalendar = job.service === "calendar";
            const isContacts = job.service === "contacts";
            
            return (
              <div
                key={job.syncJobId}
                className="flex items-center justify-between p-4 bg-card-highlight-light rounded-sm"
              >
                <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-theme-medium mb-1">Service</p>
                    <p className="text-sm font-medium text-theme-darkest capitalize">
                      {isGmail ? "Gmail" : isCalendar ? "Calendar" : isContacts ? "Contacts" : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-theme-medium mb-1">Started</p>
                    <p className="text-sm font-medium text-theme-darkest">
                      {formatDate(job.startedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-theme-medium mb-1">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </div>
                  {isGmail ? (
                    <>
                      <div>
                        <p className="text-xs text-theme-medium mb-1">Threads</p>
                        <p className="text-sm font-medium text-theme-darkest">
                          {job.processedThreads || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-theme-medium mb-1">Messages</p>
                        <p className="text-sm font-medium text-theme-darkest">
                          {job.processedMessages || 0}
                        </p>
                      </div>
                    </>
                  ) : isCalendar ? (
                    <div>
                      <p className="text-xs text-theme-medium mb-1">Events</p>
                      <p className="text-sm font-medium text-theme-darkest">
                        {job.processedEvents || 0}
                      </p>
                    </div>
                  ) : isContacts ? (
                    <>
                      <div>
                        <p className="text-xs text-theme-medium mb-1">Imported</p>
                        <p className="text-sm font-medium text-theme-darkest">
                          {job.processedContacts || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-theme-medium mb-1">Skipped</p>
                        <p className="text-sm font-medium text-theme-darkest">
                          {job.skippedContacts || 0}
                        </p>
                      </div>
                    </>
                  ) : null}
                </div>
                {job.errorMessage && (
                  <div className="ml-4 text-xs text-red-600 max-w-xs">
                    {extractErrorMessage(job.errorMessage)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

