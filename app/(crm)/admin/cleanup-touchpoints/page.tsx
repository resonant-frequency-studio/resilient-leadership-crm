"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/components/Loading";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { reportException } from "@/lib/error-reporting";

export default function CleanupTouchpointsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [daysBack, setDaysBack] = useState<number>(30);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    stats?: {
      totalChecked: number;
      foundOldTouchpoints: number;
      successfullyUpdated: number;
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
    if (!confirm(
      `This will skip ALL touchpoints overdue by more than ${daysBack} days. ` +
      "This action cannot be undone. Continue?"
    )) {
      return;
    }

    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/cleanup-old-touchpoints", {
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
        context: "Cleaning up old touchpoints",
        tags: { component: "CleanupTouchpointsPage" },
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
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-theme-darkest mb-2">Cleanup Old Touchpoints</h1>
        <p className="text-theme-dark text-lg">
          Skip touchpoints overdue by a specified number of days
        </p>
      </div>

      <Card 
        padding="md" 
        className="border"
        style={{
          backgroundColor: 'var(--warning-yellow-bg)',
          borderColor: 'var(--warning-yellow-border)',
        }}
      >
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{ color: 'var(--warning-yellow-text-accent)' }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div>
            <h3 
              className="text-lg font-semibold mb-2"
              style={{ color: 'var(--warning-yellow-text-primary)' }}
            >
              Warning
            </h3>
            <p 
              className="text-sm"
              style={{ color: 'var(--warning-yellow-text-secondary)' }}
            >
              This script will mark all touchpoints overdue by more than {daysBack} days as &quot;Skipped&quot;. 
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Card>

      <Card padding="md">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-theme-darkest mb-2">What this does:</h2>
            <ul className="list-disc list-inside space-y-1 text-theme-darker">
              <li>Finds all contacts with touchpoints overdue by more than {daysBack} days</li>
              <li>Only updates touchpoints that are still &quot;pending&quot; (not already completed/cancelled)</li>
              <li>Sets status to &quot;cancelled&quot; (Not needed right now) with an auto-generated reason</li>
              <li>These touchpoints will disappear from your dashboard</li>
            </ul>
          </div>

          <div>
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
              Touchpoints overdue by more than {daysBack} days will be skipped
            </p>
          </div>

          <Button
            onClick={handleCleanup}
            disabled={running}
            loading={running}
            variant="danger"
            size="lg"
            fullWidth
          >
            Run Cleanup Script
          </Button>
        </div>
      </Card>

      {error && (
        <Card 
          padding="md" 
          className="border"
          style={{
            backgroundColor: 'var(--chip-danger-bg)',
            borderColor: 'var(--card-overdue-dark)',
          }}
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'var(--card-overdue-dark)' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="font-medium text-theme-darkest">{error}</p>
          </div>
        </Card>
      )}

      {result && (
        <Card 
          padding="md" 
          className="border"
          style={{
            backgroundColor: result.success ? 'var(--chip-green-bg)' : 'var(--chip-danger-bg)',
            borderColor: result.success ? 'var(--chip-green-text)' : 'var(--card-overdue-dark)',
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ 
                  color: result.success 
                    ? 'var(--chip-green-text)' 
                    : 'var(--card-overdue-dark)' 
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={result.success 
                    ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"}
                />
              </svg>
              <h3 className="text-lg font-semibold text-theme-darkest">
                {result.message}
              </h3>
            </div>

            {result.stats && (
              <Card padding="md" className="bg-card-highlight-light border border-theme-light">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-theme-dark">Total Contacts Checked</p>
                      <p className="text-lg font-bold text-theme-darkest">{result.stats.totalChecked}</p>
                    </div>
                    <div>
                      <p className="text-xs text-theme-dark">Old Touchpoints Found</p>
                      <p className="text-lg font-bold text-orange-600">{result.stats.foundOldTouchpoints}</p>
                    </div>
                    <div>
                      <p className="text-xs text-theme-dark">Successfully Updated</p>
                      <p className="text-lg font-bold text-green-600">{result.stats.successfullyUpdated}</p>
                    </div>
                    <div>
                      <p className="text-xs text-theme-dark">Errors</p>
                      <p className="text-lg font-bold text-red-600">{result.stats.errors}</p>
                    </div>
                  </div>

                  {result.stats.errorsDetails && result.stats.errorsDetails.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-theme-light">
                      <p className="text-xs font-medium text-theme-darker mb-2">Error Details:</p>
                      <ul className="text-xs text-red-600 space-y-1">
                        {result.stats.errorsDetails.map((err, idx) => (
                          <li key={idx} className="font-mono">{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </Card>
      )}

    </div>
  );
}

