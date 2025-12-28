"use client";

export default function CleanupTagsWarning() {
  return (
    <div
      className="rounded-sm border p-4 sm:p-6"
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
            Removing tags will permanently delete them from all contacts. This action cannot be undone.
            Use dry run mode first to preview changes.
          </p>
        </div>
      </div>
    </div>
  );
}

