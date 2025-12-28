"use client";

interface CleanupResult {
  success: boolean;
  message: string;
  dryRun: boolean;
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
  errorDetails?: string[];
  details?: Array<{
    contactId: string;
    email: string;
    action: "updated" | "skipped" | "error";
    tagsRemoved?: string[];
    error?: string;
  }>;
}

interface CleanupTagsResultsProps {
  result: CleanupResult | null;
}

export default function CleanupTagsResults({
  result,
}: CleanupTagsResultsProps) {
  if (!result) {
    return null;
  }

  return (
    <div
      className="rounded-sm border p-4 sm:p-6"
      style={{
        backgroundColor: result.success ? 'var(--chip-green-bg)' : 'var(--chip-danger-bg)',
        borderColor: result.success ? 'var(--chip-green-text)' : 'var(--card-overdue-dark)',
      }}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 shrink-0 mt-0.5"
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 text-theme-darkest">
              {result.dryRun ? "Dry Run Results" : "Cleanup Complete"}
            </h3>
            <p className="text-sm mb-4 text-theme-darker">
              {result.message}
            </p>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-theme-darkest">{result.processed}</div>
                <div className="text-xs text-theme-dark">Processed</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--chip-green-text)' }}>{result.updated}</div>
                <div className="text-xs" style={{ color: 'var(--chip-green-text)' }}>Updated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-theme-darkest">{result.skipped}</div>
                <div className="text-xs text-theme-dark">Skipped</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: 'var(--card-overdue-dark)' }}>{result.errors}</div>
                <div className="text-xs" style={{ color: 'var(--card-overdue-dark)' }}>Errors</div>
              </div>
            </div>

            {result.errorDetails && result.errorDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-theme-darkest mb-2">Error Details:</h4>
                <ul className="list-disc list-inside text-xs space-y-1" style={{ color: 'var(--card-overdue-dark)' }}>
                  {result.errorDetails.slice(0, 10).map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                  {result.errorDetails.length > 10 && (
                    <li>... and {result.errorDetails.length - 10} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

