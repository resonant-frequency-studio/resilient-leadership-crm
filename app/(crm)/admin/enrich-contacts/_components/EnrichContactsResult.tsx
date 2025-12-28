"use client";

import Card from "@/components/Card";
import EnrichContactsResultStats from "./EnrichContactsResultStats";
import EnrichContactsResultDetails from "./EnrichContactsResultDetails";

interface EnrichContactDetail {
  contactId: string;
  email: string;
  action: "updated" | "skipped" | "error";
  enriched?: { firstName: string | null; lastName: string | null; company: string | null; photoUrl: string | null; source?: string };
  current?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null };
  new?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null };
  error?: string;
}

interface EnrichContactsResultData {
  message: string;
  dryRun: boolean;
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
  details?: EnrichContactDetail[];
}

interface EnrichContactsResultProps {
  result: EnrichContactsResultData;
}

export default function EnrichContactsResult({ result }: EnrichContactsResultProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--chip-green-bg)',
        borderColor: 'var(--chip-green-text)',
      }}
      className="rounded-sm border"
    >
      <Card padding="md" className="bg-transparent border-0 shadow-none">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              style={{ color: 'var(--chip-green-text)' }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-theme-darkest">
              {result.message}
            </h3>
          </div>

          <Card padding="md" className="bg-card-highlight-light border border-theme-light">
            <div className="space-y-2">
              <EnrichContactsResultStats
                processed={result.processed}
                updated={result.updated}
                skipped={result.skipped}
                errors={result.errors}
              />
              {result.details && result.details.length > 0 && (
                <EnrichContactsResultDetails details={result.details} />
              )}
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}

