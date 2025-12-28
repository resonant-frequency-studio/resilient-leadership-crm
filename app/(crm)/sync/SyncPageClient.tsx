"use client";

import { useState } from "react";
import ThemedSuspense from "@/components/ThemedSuspense";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import { useContacts } from "@/hooks/useContacts";
import { useAuth } from "@/hooks/useAuth";
import { useContactsSyncJob } from "@/hooks/useContactsSyncJob";
import { useCalendarSubscriptionStatus } from "@/hooks/useCalendarSubscriptionStatus";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { extractErrorMessage } from "@/components/ErrorMessage";
import { reportException } from "@/lib/error-reporting";
import { SyncJob } from "@/types/firestore";
import EmptyState from "@/components/dashboard/EmptyState";
import Modal from "@/components/Modal";
import GmailSyncSection from "./_components/GmailSyncSection";
import CalendarSyncSection from "./_components/CalendarSyncSection";
import ContactsSyncSection from "./_components/ContactsSyncSection";
import SyncHistoryTable from "./_components/SyncHistoryTable";
import { useSyncHandlers } from "./_components/hooks/useSyncHandlers";

interface SyncPageClientProps {
  userId: string;
  initialLastSync: SyncJob | null;
  initialSyncHistory: SyncJob[];
}

export default function SyncPageClient({
  userId,
  initialLastSync,
  initialSyncHistory,
}: SyncPageClientProps) {
  const { user } = useAuth();
  const effectiveUserId = userId || user?.uid || "";
  // Use real-time hook for updates
  const { lastSync: realtimeLastSync, syncHistory: realtimeSyncHistory, error, loading: syncLoading } = useSyncStatus(userId);
  const { data: contacts = [], isLoading: contactsLoading } = useContacts(effectiveUserId);
  const { data: subscriptionStatus } = useCalendarSubscriptionStatus(effectiveUserId);
  const [currentContactsSyncJobId, setCurrentContactsSyncJobId] = useState<string | null>(null);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [clearError, setClearError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Use sync handlers hook
  const {
    syncing,
    syncError,
    setSyncError,
    handleManualSync,
    syncingCalendar,
    calendarSyncError,
    calendarSyncSuccess,
    setCalendarSyncError,
    handleCalendarSync,
    syncingContacts,
    contactsSyncError,
    setContactsSyncError,
    handleContactsSync,
  } = useSyncHandlers({ userId, effectiveUserId });

  // Track the current contacts sync job if one is running
  const { syncJob: contactsSyncJob } = useContactsSyncJob(
    userId || null,
    currentContactsSyncJobId
  );

  // Use real-time data if available, otherwise fall back to initial data
  const lastSync = realtimeLastSync || initialLastSync;
  const syncHistory = realtimeSyncHistory.length > 0 ? realtimeSyncHistory : initialSyncHistory;
  
  // Show loading state if either is loading (suspense mode)
  if (contactsLoading || syncLoading) {
    return <ThemedSuspense isLoading={true} variant="sync" />;
  }
  
  // Show empty state only after loading completes AND there's no data
  if (!contactsLoading && !syncLoading && contacts.length === 0) {
    return <EmptyState wrapInCard={true} size="lg" />;
  }

  // Handle contacts sync with job tracking
  const handleContactsSyncWithTracking = async (): Promise<string | null> => {
    setCurrentContactsSyncJobId(null);
    const syncJobId = await handleContactsSync();
    if (syncJobId) {
      setCurrentContactsSyncJobId(syncJobId);
    }
    return syncJobId;
  };

  const formatDate = (date: unknown): string => {
    if (!date) return "N/A";
    
    if (date instanceof Date) {
      return date.toLocaleString();
    }
    
    if (typeof date === "object" && "toDate" in date) {
      return (date as { toDate: () => Date }).toDate().toLocaleString();
    }
    
    if (typeof date === "string" || typeof date === "number") {
      return new Date(date).toLocaleString();
    }
    
    return "Invalid date";
  };

  const handleClearHistory = async () => {
    setClearingHistory(true);
    setClearError(null);
    setShowClearConfirm(false);

    try {
      const response = await fetch("/api/sync-jobs/clear", {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to clear sync history");
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || "Failed to clear sync history");
      }

      // History will update automatically via real-time listener
      setClearError(null);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setClearError(errorMessage);
      reportException(error, {
        context: "Clear sync history error",
        tags: { component: "SyncPageClient" },
      });
    } finally {
      setClearingHistory(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete":
        return "text-green-600 bg-green-50 border-green-200";
      case "running":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-theme-dark bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Clear History Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="Clear Sync History"
        closeOnBackdropClick={!clearingHistory}
      >
        <p className="text-theme-dark mb-6">
          Are you sure you want to clear sync history? This will keep only the most recent sync job. This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={() => setShowClearConfirm(false)}
            disabled={clearingHistory}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClearHistory}
            disabled={clearingHistory}
            loading={clearingHistory}
            variant="danger"
            size="sm"
            error={clearError}
          >
            Clear History
          </Button>
        </div>
      </Modal>

      {/* Sync Gmail Button - Static, renders immediately */}
      <GmailSyncSection
        onSync={handleManualSync}
        syncing={syncing}
        error={syncError}
        onDismissError={() => setSyncError(null)}
      />

      {/* Sync Calendar Button - Static, renders immediately */}
      <CalendarSyncSection
        subscriptionStatus={subscriptionStatus}
        onSync={handleCalendarSync}
        syncing={syncingCalendar}
        error={calendarSyncError}
        success={calendarSyncSuccess}
        onDismissError={() => setCalendarSyncError(null)}
      />

      {/* Import Contacts Button - Static, renders immediately */}
      <ContactsSyncSection
        onSync={handleContactsSyncWithTracking}
        syncing={syncingContacts}
        error={contactsSyncError}
        syncJob={contactsSyncJob}
        onDismissError={() => setContactsSyncError(null)}
        onDismissJob={() => setCurrentContactsSyncJobId(null)}
      />


      {error && (
        <Card padding="md" className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-yellow-800">{error}</p>
          </div>
        </Card>
      )}

      {/* Sync Data - Only dynamic data is suspended */}
      <ThemedSuspense
        fallback={
          <div className="space-y-8">
            <Card padding="md" className="animate-pulse">
              <div className="h-6 bg-theme-light rounded w-32 mb-4" />
              <div className="h-32 bg-theme-light rounded" />
            </Card>
            <Card padding="md" className="animate-pulse">
              <div className="h-6 bg-theme-light rounded w-32 mb-4" />
              <div className="h-64 bg-theme-light rounded" />
            </Card>
          </div>
        }
      >
        {/* Last Sync Status - Show Gmail, Calendar, and Contacts */}
        {(() => {
          const lastGmailSync = syncHistory.find(job => job.service === "gmail" || !job.service) || lastSync;
          const lastCalendarSync = syncHistory.find(job => job.service === "calendar");
          const lastContactsSync = syncHistory.find(job => job.service === "contacts");
          
          return (
            <>
              {lastGmailSync && (
                <Card padding="md">
                  <h2 className="text-xl font-semibold text-theme-darkest mb-4">Last Gmail Sync</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          lastGmailSync.status
                        )}`}
                      >
                        {lastGmailSync.status.charAt(0).toUpperCase() + lastGmailSync.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Started At</p>
                      <p className="text-theme-darkest">{formatDate(lastGmailSync.startedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Type</p>
                      <p className="text-theme-darkest capitalize">{lastGmailSync.type || "auto"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Threads Processed</p>
                      <p className="text-2xl font-bold text-theme-darkest">{lastGmailSync.processedThreads || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Messages Processed</p>
                      <p className="text-2xl font-bold text-theme-darkest">{lastGmailSync.processedMessages || 0}</p>
                    </div>
                    {lastGmailSync.finishedAt != null && (
                      <div>
                        <p className="text-sm font-medium text-theme-medium mb-1">Finished At</p>
                        <p className="text-theme-darkest">{formatDate(lastGmailSync.finishedAt)}</p>
                      </div>
                    )}
                  </div>
                  {lastGmailSync.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                      <p className="text-sm text-red-800 mb-2">
                        <strong>Error:</strong> {extractErrorMessage(lastGmailSync.errorMessage)}
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {lastCalendarSync && (
                <Card padding="md">
                  <h2 className="text-xl font-semibold text-theme-darkest mb-4">Last Calendar Sync</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          lastCalendarSync.status
                        )}`}
                      >
                        {lastCalendarSync.status.charAt(0).toUpperCase() + lastCalendarSync.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Started At</p>
                      <p className="text-theme-darkest">{formatDate(lastCalendarSync.startedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Type</p>
                      <p className="text-theme-darkest capitalize">{lastCalendarSync.type || "initial"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Events Processed</p>
                      <p className="text-2xl font-bold text-theme-darkest">{lastCalendarSync.processedEvents || 0}</p>
                    </div>
                    {lastCalendarSync.finishedAt != null && (
                      <div>
                        <p className="text-sm font-medium text-theme-medium mb-1">Finished At</p>
                        <p className="text-theme-darkest">{formatDate(lastCalendarSync.finishedAt)}</p>
                      </div>
                    )}
                  </div>
                  {lastCalendarSync.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                      <p className="text-sm text-red-800 mb-2">
                        <strong>Error:</strong> {extractErrorMessage(lastCalendarSync.errorMessage)}
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {lastContactsSync && (
                <Card padding="md">
                  <h2 className="text-xl font-semibold text-theme-darkest mb-4">Last Contacts Import</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Status</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          lastContactsSync.status
                        )}`}
                      >
                        {lastContactsSync.status.charAt(0).toUpperCase() + lastContactsSync.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Started At</p>
                      <p className="text-theme-darkest">{formatDate(lastContactsSync.startedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Type</p>
                      <p className="text-theme-darkest capitalize">{lastContactsSync.type || "initial"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Contacts Imported</p>
                      <p className="text-2xl font-bold text-theme-darkest">{lastContactsSync.processedContacts || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-theme-medium mb-1">Contacts Skipped</p>
                      <p className="text-2xl font-bold text-theme-darkest">{lastContactsSync.skippedContacts || 0}</p>
                    </div>
                    {lastContactsSync.finishedAt != null && (
                      <div>
                        <p className="text-sm font-medium text-theme-medium mb-1">Finished At</p>
                        <p className="text-theme-darkest">{formatDate(lastContactsSync.finishedAt)}</p>
                      </div>
                    )}
                  </div>
                  {lastContactsSync.errorMessage && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm">
                      <p className="text-sm text-red-800 mb-2">
                        <strong>Error:</strong> {extractErrorMessage(lastContactsSync.errorMessage)}
                      </p>
                    </div>
                  )}
                </Card>
              )}
            </>
          );
        })()}

        {/* Sync History */}
        <SyncHistoryTable
          syncHistory={syncHistory}
          onClearHistory={() => setShowClearConfirm(true)}
          clearingHistory={clearingHistory}
          clearError={clearError}
          onDismissClearError={() => setClearError(null)}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
        />
      </ThemedSuspense>
    </div>
  );
}

