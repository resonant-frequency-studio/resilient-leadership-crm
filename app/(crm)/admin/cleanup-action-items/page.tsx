"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { reportException } from "@/lib/error-reporting";

export default function CleanupActionItemsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [daysBack, setDaysBack] = useState<number>(90);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    stats?: {
      totalContactsChecked: number;
      contactsWithOldEmails: number;
      totalActionItemsDeleted: number;
      contactsProcessed: number;
      errors: number;
      errorsDetails?: string[];
    };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleCleanup = async () => {
    if (
      !confirm(
        `This will DELETE ALL action items from contacts whose last email was more than ${daysBack} days ago. ` +
          "This action cannot be undone. Continue?"
      )
    ) {
      return;
    }

    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/cleanup-action-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: daysBack }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Cleanup failed");
      }

      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      reportException(err, {
        context: "Cleaning up action items from old contacts",
        tags: { component: "CleanupActionItemsPage" },
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-theme-darkest mb-2">
          Cleanup Action Items
        </h1>
        <p className="text-theme-dark">
          Delete all action items from contacts whose last email was more than a specified number of days ago
        </p>
      </div>

      <Card padding="lg">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-theme-darkest mb-4">
              What this script does:
            </h2>
            <ul className="list-disc list-inside space-y-2 text-theme-darker">
              <li>Finds all contacts where <code className="bg-theme-light text-foreground px-1 rounded">lastEmailDate</code> is more than {daysBack} days old</li>
              <li>Deletes ALL action items for those contacts</li>
              <li>This action cannot be undone</li>
            </ul>
          </div>

          <div className="border-t border-theme-light pt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-theme-darkest mb-2">
                Select time period:
              </label>
              <div className="flex flex-wrap gap-2">
                {[30, 60, 90, 120].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setDaysBack(days)}
                    disabled={running}
                    className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                      daysBack === days
                        ? "bg-btn-primary-bg text-btn-primary-fg border-2 border-btn-primary-border"
                        : "bg-transparent text-theme-darker border-2 border-theme-light hover:bg-theme-light"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {days} days
                  </button>
                ))}
              </div>
              <p className="text-xs text-theme-dark mt-2">
                Action items from contacts with last email more than {daysBack} days ago will be deleted
              </p>
            </div>
            <Button
              onClick={handleCleanup}
              disabled={running}
              loading={running}
              variant="danger"
              fullWidth
            >
              {running ? "Running cleanup..." : "Run Cleanup"}
            </Button>
          </div>

          {error && (
            <div 
              className="rounded-sm border p-4 sm:p-6 mt-4"
              style={{
                backgroundColor: 'var(--chip-danger-bg)',
                borderColor: 'var(--card-overdue-dark)',
              }}
            >
              <p className="font-semibold text-theme-darkest">Error</p>
              <p className="text-theme-darker">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 space-y-4">
              <div
                className="rounded-sm border p-4 sm:p-6"
                style={{
                  backgroundColor: result.success ? 'var(--chip-green-bg)' : 'var(--chip-danger-bg)',
                  borderColor: result.success ? 'var(--chip-green-text)' : 'var(--card-overdue-dark)',
                }}
              >
                <p className="font-semibold text-theme-darkest">
                  {result.success ? "Success" : "Failed"}
                </p>
                <p className="text-theme-darker">
                  {result.message}
                </p>
              </div>

              {result.stats && (
                <Card padding="md" className="bg-card-highlight-light border border-theme-light">
                  <h3 className="font-semibold text-theme-darkest mb-3">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-theme-dark">Contacts Checked</p>
                      <p className="text-2xl font-bold text-theme-darkest">
                        {result.stats.totalContactsChecked}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-theme-dark">
                        Contacts with Old Emails
                      </p>
                      <p className="text-2xl font-bold text-amber-600">
                        {result.stats.contactsWithOldEmails}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-theme-dark">
                        Action Items Deleted
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {result.stats.totalActionItemsDeleted}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-theme-dark">
                        Contacts Processed
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {result.stats.contactsProcessed}
                      </p>
                    </div>
                    {result.stats.errors > 0 && (
                      <div className="col-span-2">
                        <p className="text-sm text-theme-dark">Errors</p>
                        <p className="text-2xl font-bold text-red-600">
                          {result.stats.errors}
                        </p>
                        {result.stats.errorsDetails &&
                          result.stats.errorsDetails.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">
                                Error details (first 10):
                              </p>
                              <ul className="list-disc list-inside text-xs text-red-600 space-y-1">
                                {result.stats.errorsDetails.map((err, idx) => (
                                  <li key={idx}>{err}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

