"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { ErrorMessage } from "@/components/ErrorMessage";

interface CalendarSubscriptionStatus {
  hasActiveSubscription?: boolean;
  expiresAt?: string | Date | unknown;
}

interface CalendarSyncSectionProps {
  subscriptionStatus: CalendarSubscriptionStatus | null | undefined;
  onSync: () => void;
  syncing: boolean;
  error: string | null;
  success: string | null;
  onDismissError: () => void;
}

export default function CalendarSyncSection({
  subscriptionStatus,
  onSync,
  syncing,
  error,
  success,
  onDismissError,
}: CalendarSyncSectionProps) {
  return (
    <Card padding="md" className="bg-sync-purple-bg border-sync-purple-border">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-semibold text-sync-purple-text-primary">Sync Calendar</h3>
            {subscriptionStatus?.hasActiveSubscription && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Real-time sync active
              </span>
            )}
          </div>
          <div className="text-xs text-sync-purple-text-secondary mb-3">
            {subscriptionStatus?.hasActiveSubscription ? (
              <>
                <p className="mb-1 font-medium text-sync-purple-text-primary">
                  Automatic sync is enabled. Calendar changes sync in real-time between Google Calendar and your CRM.
                </p>
                <p className="mb-1 mt-2">Click below to manually sync calendar events now. This will:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Fetch calendar events from the past 30-180 days (depending on sync type)</li>
                  <li>Match events to contacts by email addresses in attendee lists</li>
                  <li>Create calendar event records linked to your contacts</li>
                  <li>Extract meeting insights and action items from event descriptions</li>
                </ul>
                {subscriptionStatus.expiresAt && (
                  <p className="mt-2 text-sync-purple-text-secondary italic">
                    Automatic sync expires: {new Date(subscriptionStatus.expiresAt as string | Date).toLocaleDateString()} (auto-renewed daily)
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="mb-1 font-medium text-sync-purple-text-primary">
                  Set up automatic calendar sync to keep your CRM calendar in sync with Google Calendar in real-time.
                </p>
                <p className="mb-1 mt-2">Click below to sync calendar events and enable automatic sync. This will:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  <li>Fetch calendar events from the past 30-180 days (depending on sync type)</li>
                  <li>Match events to contacts by email addresses in attendee lists</li>
                  <li>Create calendar event records linked to your contacts</li>
                  <li>Extract meeting insights and action items from event descriptions</li>
                  <li>Enable automatic real-time sync between Google Calendar and your CRM</li>
                </ul>
              </>
            )}
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
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
          >
            {subscriptionStatus?.hasActiveSubscription ? 'Sync Calendar Now' : 'Set Up Calendar Sync'}
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
      {success && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-sm">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </p>
        </div>
      )}
    </Card>
  );
}

