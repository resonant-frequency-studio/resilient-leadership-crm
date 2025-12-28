"use client";

import Card from "@/components/Card";

interface EnrichContactsErrorProps {
  error: string;
}

export default function EnrichContactsError({ error }: EnrichContactsErrorProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--chip-danger-bg)',
        borderColor: 'var(--card-overdue-dark)',
      }}
      className="rounded-sm border"
    >
      <Card padding="md" className="bg-transparent border-0 shadow-none">
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
    </div>
  );
}

