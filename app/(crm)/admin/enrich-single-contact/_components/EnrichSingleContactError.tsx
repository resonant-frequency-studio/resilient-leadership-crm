"use client";

interface EnrichSingleContactErrorProps {
  error: string;
}

export default function EnrichSingleContactError({
  error,
}: EnrichSingleContactErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <div
      className="rounded-sm border p-4 sm:p-6"
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
    </div>
  );
}

