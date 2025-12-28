"use client";

export default function HowItWorksCard() {
  return (
    <div
      style={{
        backgroundColor: 'var(--chip-blue-bg)',
        borderColor: 'var(--chip-blue-text)',
      }}
      className="rounded-sm border p-4 sm:p-6"
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-6 h-6 shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ color: 'var(--chip-blue-text)' }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: 'var(--chip-blue-text)' }}
          >
            How it works
          </h3>
          <ul
            className="text-sm space-y-1 list-disc list-inside"
            style={{ color: 'var(--chip-blue-text)' }}
          >
            <li>Enter one or more email addresses (one per line or comma-separated)</li>
            <li>Uses Google People API to search for matching contacts</li>
            <li>Extracts first name, last name, company, and profile photo from Google Contacts</li>
            <li>Prioritizes People API data over existing Firestore data</li>
            <li>Falls back to existing Firestore data or email extraction if People API doesn&apos;t have the contact</li>
            <li>Processes sequentially with rate limiting to respect API quotas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

