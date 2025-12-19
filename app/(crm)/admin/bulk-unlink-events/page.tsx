"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { reportException } from "@/lib/error-reporting";

export default function BulkUnlinkEventsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [alsoUnlinkEvents, setAlsoUnlinkEvents] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    dryRun: boolean;
    alsoUnlinkEvents: boolean;
    processed: number;
    unlinked: number;
    contactsProcessed: number;
    contactsUnlinked: number;
    contactsErrors: number;
    eventsProcessed: number;
    eventsUnlinked: number;
    eventsErrors: number;
    quotaLimitReached?: boolean;
    contactDetails?: Array<{
      contactId: string;
      email: string;
      linkedEventId: string | null;
      action: "unlinked" | "skipped" | "error";
      error?: string;
    }>;
    eventDetails?: Array<{
      eventId: string;
      eventTitle: string;
      matchedContactId: string | null;
      action: "unlinked" | "skipped" | "error";
      error?: string;
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleUnlink = async () => {
    if (!dryRun && !confirm(
      "This will unlink ALL contacts from their calendar events and clear the timeline. " +
      "After the next calendar sync, only contacts with exact email matches will be re-linked. " +
      "This action will modify your data. Continue?"
    )) {
      return;
    }

    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/bulk-unlink-contacts-from-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          dryRun,
          alsoUnlinkEvents,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If it's a quota error, set it as result so we can show the special UI
        if (response.status === 429 || data.quotaLimitReached) {
          setResult({
            ...data,
            processed: data.processed || 0,
            unlinked: data.unlinked || 0,
            contactsProcessed: data.contactsProcessed || 0,
            contactsUnlinked: data.contactsUnlinked || 0,
            contactsErrors: data.contactsErrors || 0,
            eventsProcessed: data.eventsProcessed || 0,
            eventsUnlinked: data.eventsUnlinked || 0,
            eventsErrors: data.eventsErrors || 0,
          });
          return;
        }
        throw new Error(data.error || data.message || "Unlink failed");
      }

      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      reportException(err, {
        context: "Bulk unlinking contacts from events",
        tags: { component: "BulkUnlinkEventsPage" },
      });
    } finally {
      setRunning(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-theme-darkest mb-2">Bulk Unlink Contacts from Events</h1>
        <p className="text-theme-dark text-lg">
          Unlink all contacts from calendar events to allow proper re-linking with exact email matching
        </p>
      </div>

      <Card padding="md" className="bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-blue-600 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What this does</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li><strong>Finds ALL events with <code className="bg-blue-100 px-1 rounded">matchedContactId</code> set</strong> and clears them (this removes events from contact timelines)</li>
              <li>Finds all contacts with <code className="bg-blue-100 px-1 rounded">linkedGoogleEventId</code> set and clears touchpoint link fields</li>
              <li>This fixes contacts that have incorrectly linked events in their timeline</li>
              <li>After the next calendar sync, only contacts with exact email matches will be re-linked</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-theme-darkest mb-2">Unlink Options</h2>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
            <input
              type="checkbox"
              id="dryRun"
              checked={dryRun}
              onChange={(e) => setDryRun(e.target.checked)}
              disabled={running}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="dryRun" className="text-sm font-medium text-theme-darker cursor-pointer">
              Dry run (preview changes without unlinking)
            </label>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm">
            <input
              type="checkbox"
              id="alsoUnlinkEvents"
              checked={alsoUnlinkEvents}
              onChange={(e) => setAlsoUnlinkEvents(e.target.checked)}
              disabled={running}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="alsoUnlinkEvents" className="text-sm font-medium text-theme-darker cursor-pointer">
              Also unlink events from timeline (clears <code className="bg-gray-100 px-1 rounded">matchedContactId</code> from events)
            </label>
            <p className="text-xs text-theme-dark mt-1 ml-7">
              Recommended: This removes improperly linked events from contact timelines. The next calendar sync will re-link only exact email matches.
            </p>
          </div>

          <Button
            onClick={handleUnlink}
            disabled={running}
            loading={running}
            variant={dryRun ? "primary" : "danger"}
            size="lg"
            fullWidth
          >
            {dryRun ? "Preview Unlink" : "Unlink All Contacts from Events"}
          </Button>
        </div>
      </Card>

      {error && (
        <Card padding="md" className="bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 shrink-0 mt-0.5"
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
            <div>
              <p className="text-red-800 font-medium mb-2">{error}</p>
              {error.includes("quota") || error.includes("Quota") ? (
                <div className="text-sm text-red-700 space-y-1">
                  <p>Firestore free tier limits:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>50,000 reads per day</li>
                    <li>20,000 writes per day</li>
                  </ul>
                  <p className="mt-2">Quotas reset daily. You can:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Wait a few hours for the quota to reset</li>
                    <li>Upgrade your Firebase plan for higher limits</li>
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      )}

      {result?.quotaLimitReached && (
        <Card padding="md" className="bg-orange-50 border-orange-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-orange-600 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="text-orange-900 font-semibold mb-2">Firestore Quota Exceeded</h3>
              <p className="text-sm text-orange-800 mb-2">
                {result.message}
              </p>
              <div className="mt-3 text-sm text-orange-800">
                <p className="font-medium mb-1">Your options:</p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Wait a few hours for daily quota to reset (resets at midnight Pacific Time)</li>
                  <li>Upgrade to Firebase Blaze plan for higher limits</li>
                  <li>Run the unlink again later - it will continue from where it left off</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      )}

      {result && (
        <Card padding="md" className="bg-green-50 border-green-200">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-green-900">
                {result.message}
              </h3>
            </div>

            <div className="bg-[#EEEEEC] rounded-sm p-4 space-y-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Total Processed</p>
                  <p className="text-lg font-bold text-theme-darkest">{result.processed}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Unlinked</p>
                  <p className="text-lg font-bold text-green-600">{result.unlinked}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Errors</p>
                  <p className="text-lg font-bold text-red-600">{(result.contactsErrors || 0) + (result.eventsErrors || 0)}</p>
                </div>
              </div>

              {result.alsoUnlinkEvents && (
                <div className="mb-4 p-3 bg-blue-50 rounded-sm border border-blue-200">
                  <p className="text-xs font-medium text-blue-900 mb-2">Events (Timeline Clearing):</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-blue-700">Processed:</span>{" "}
                      <span className="font-semibold">{result.eventsProcessed || 0}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Unlinked:</span>{" "}
                      <span className="font-semibold text-green-600">{result.eventsUnlinked || 0}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Errors:</span>{" "}
                      <span className="font-semibold text-red-600">{result.eventsErrors || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-4 p-3 bg-green-50 rounded-sm border border-green-200">
                <p className="text-xs font-medium text-green-900 mb-2">Contacts (Touchpoint Links):</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-green-700">Processed:</span>{" "}
                    <span className="font-semibold">{result.contactsProcessed || 0}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Unlinked:</span>{" "}
                    <span className="font-semibold text-green-600">{result.contactsUnlinked || 0}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Errors:</span>{" "}
                    <span className="font-semibold text-red-600">{result.contactsErrors || 0}</span>
                  </div>
                </div>
              </div>

              {result.eventDetails && result.eventDetails.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-theme-darker mb-2">
                    Sample Events Unlinked (showing first 10):
                  </p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.eventDetails.slice(0, 10).map((detail, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-2 rounded ${
                          detail.action === "unlinked"
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="font-medium text-theme-darkest mb-1">
                          {detail.eventTitle}
                        </div>
                        {detail.action === "unlinked" && (
                          <div className="text-theme-dark">
                            Unlinked from contact: <code className="bg-blue-100 px-1 rounded text-xs">{detail.matchedContactId || "N/A"}</code>
                          </div>
                        )}
                        {detail.action === "error" && (
                          <div className="text-red-600">{detail.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  {result.eventDetails.length > 10 && (
                    <p className="text-xs text-gray-500 mt-2">
                      ... and {result.eventDetails.length - 10} more events
                    </p>
                  )}
                </div>
              )}

              {result.contactDetails && result.contactDetails.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs font-medium text-theme-darker mb-2">
                    Sample Contacts Unlinked (showing first 10):
                  </p>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {result.contactDetails.slice(0, 10).map((detail, idx) => (
                      <div
                        key={idx}
                        className={`text-xs p-2 rounded ${
                          detail.action === "unlinked"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                      >
                        <div className="font-medium text-theme-darkest mb-1">
                          {detail.email}
                        </div>
                        {detail.action === "unlinked" && (
                          <div className="text-theme-dark">
                            Unlinked from event: <code className="bg-green-100 px-1 rounded text-xs">{detail.linkedEventId || "N/A"}</code>
                          </div>
                        )}
                        {detail.action === "error" && (
                          <div className="text-red-600">{detail.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  {result.contactDetails.length > 10 && (
                    <p className="text-xs text-gray-500 mt-2">
                      ... and {result.contactDetails.length - 10} more contacts
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card padding="md" className="bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-yellow-900 mb-1">After Running</h3>
            <p className="text-xs text-yellow-800 mb-2">
              After running this unlink operation:
            </p>
            <ul className="text-xs text-yellow-800 list-disc list-inside space-y-1">
              <li>All contact-to-event links will be cleared</li>
              <li>Timeline events will be removed (if &quot;Also unlink events from timeline&quot; is checked)</li>
              <li>On the next calendar sync, only contacts with exact email matches will be re-linked</li>
              <li>This ensures your timeline only shows properly matched events</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

