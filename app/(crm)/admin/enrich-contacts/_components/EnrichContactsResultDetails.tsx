"use client";

interface EnrichContactDetail {
  contactId: string;
  email: string;
  action: "updated" | "skipped" | "error";
  enriched?: { firstName: string | null; lastName: string | null; company: string | null; photoUrl: string | null; source?: string };
  current?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null };
  new?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null };
  error?: string;
}

interface EnrichContactsResultDetailsProps {
  details: EnrichContactDetail[];
}

export default function EnrichContactsResultDetails({ details }: EnrichContactsResultDetailsProps) {
  if (details.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 pt-4 border-t border-theme-light">
      <p className="text-xs font-medium text-theme-darker mb-2">
        Sample Results (showing first 20):
      </p>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {details.slice(0, 20).map((detail, idx) => (
          <div
            key={idx}
            className="text-xs p-2 rounded border"
            style={
              detail.action === "updated"
                ? {
                    backgroundColor: 'var(--chip-green-bg)',
                    borderColor: 'var(--chip-green-text)',
                  }
                : detail.action === "skipped"
                ? {
                    backgroundColor: 'var(--chip-yellow-bg)',
                    borderColor: 'var(--chip-yellow-text)',
                  }
                : {
                    backgroundColor: 'var(--chip-red-bg)',
                    borderColor: 'var(--chip-red-text)',
                  }
            }
          >
            <div className="font-medium text-theme-darkest mb-1">
              {detail.email}
              {detail.enriched?.source && (
                <span className="ml-2 text-xs text-theme-dark">
                  (source: {detail.enriched.source === "people_api" ? "People API" : "Email extraction"})
                </span>
              )}
            </div>
            {detail.action === "updated" && (
              <div className="text-theme-dark space-y-0.5">
                <div>
                  Current: {detail.current?.firstName || "—"} {detail.current?.lastName || "—"} 
                  {detail.current?.company && ` (${detail.current.company})`}
                </div>
                <div>
                  → New: {detail.new?.firstName || "—"} {detail.new?.lastName || "—"}
                  {detail.new?.company && ` (${detail.new.company})`}
                </div>
              </div>
            )}
            {detail.action === "skipped" && (
              <div className="text-theme-dark">
                Already has: {detail.current?.firstName || "—"} {detail.current?.lastName || "—"}
                {detail.current?.company && ` (${detail.current.company})`}
                {detail.error && <span className="text-theme-dark"> - {detail.error}</span>}
              </div>
            )}
            {detail.action === "error" && (
              <div style={{ color: 'var(--chip-red-text)' }}>{detail.error}</div>
            )}
          </div>
        ))}
      </div>
      {details.length > 20 && (
        <p className="text-xs text-theme-dark mt-2">
          ... and {details.length - 20} more results
        </p>
      )}
    </div>
  );
}

