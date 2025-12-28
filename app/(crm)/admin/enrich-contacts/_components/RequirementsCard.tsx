"use client";

export default function RequirementsCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--warning-yellow-bg)',
        borderColor: 'var(--warning-yellow-border)',
      }}
      className="rounded-sm border p-4 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: 'var(--warning-yellow-text-accent)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 
            className="text-sm font-semibold mb-1"
            style={{ color: 'var(--warning-yellow-text-primary)' }}
          >
            Requirements
          </h3>
          <p 
            className="text-xs"
            style={{ color: 'var(--warning-yellow-text-secondary)' }}
          >
            For this to work, you need to:
          </p>
          <ul 
            className="text-xs list-disc list-inside mt-2 space-y-1"
            style={{ color: 'var(--warning-yellow-text-secondary)' }}
          >
            <li>Have your Google account linked to the CRM</li>
            <li>Have granted the contacts.readonly scope (may require re-authentication)</li>
            <li>Have contacts in your Google Contacts that match the email addresses in the CRM</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

