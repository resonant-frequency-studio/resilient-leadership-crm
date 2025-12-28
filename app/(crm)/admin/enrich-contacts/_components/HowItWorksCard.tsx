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
            <li>Uses Google People API to search your contacts for matching email addresses</li>
            <li>Extracts first name, last name, company, and profile photo from Google Contacts</li>
            <li>Falls back to email-based name extraction if People API doesn&apos;t find the contact</li>
            <li>Only updates contacts that are missing firstName, lastName, company, or photoUrl</li>
            <li>Preserves existing well-formed data (doesn&apos;t overwrite)</li>
            <li>Processes in batches with rate limiting to respect API quotas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

