"use client";

import { ProcessResult } from "./types";

interface EnrichSingleContactResultCardProps {
  result: ProcessResult;
}

export default function EnrichSingleContactResultCard({
  result,
}: EnrichSingleContactResultCardProps) {
  return (
    <div
      className="p-4 rounded-sm border"
      style={
        result.action === "updated"
          ? {
              backgroundColor: 'var(--chip-green-bg)',
              borderColor: 'var(--chip-green-text)',
            }
          : result.error
          ? {
              backgroundColor: 'var(--chip-red-bg)',
              borderColor: 'var(--chip-red-text)',
            }
          : {
              backgroundColor: 'var(--chip-yellow-bg)',
              borderColor: 'var(--chip-yellow-text)',
            }
      }
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-medium text-theme-darkest mb-1">
            {result.contact.email}
          </div>
          {result.enriched?.source && (
            <span className="text-xs text-theme-dark">
              Source: {result.enriched.source === "people_api" ? "People API" : "Email extraction"}
            </span>
          )}
        </div>
        <span
          className="px-2 py-1 text-xs font-semibold rounded"
          style={
            result.action === "updated"
              ? {
                  backgroundColor: 'var(--chip-green-bg)',
                  color: 'var(--chip-green-text)',
                }
              : result.error
              ? {
                  backgroundColor: 'var(--chip-red-bg)',
                  color: 'var(--chip-red-text)',
                }
              : {
                  backgroundColor: 'var(--chip-yellow-bg)',
                  color: 'var(--chip-yellow-text)',
                }
          }
        >
          {result.action === "updated" ? "Updated" : result.error ? "Error" : "Skipped"}
        </span>
      </div>

      {result.error && (
        <div className="text-sm mb-2" style={{ color: 'var(--chip-red-text)' }}>{result.error}</div>
      )}

      {result.reason && (
        <div className="text-sm text-theme-dark mb-2">{result.reason}</div>
      )}

      {result.action === "updated" && result.current && result.new && (
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-theme-dark mb-1">Current:</p>
              <div className="text-theme-dark">
                <div>
                  {result.current.firstName || "—"} {result.current.lastName || "—"}
                </div>
                {result.current.company && (
                  <div className="text-xs text-theme-dark">{result.current.company}</div>
                )}
                {result.current.photoUrl && (
                  <div className="text-xs text-theme-dark">
                    Photo: {result.current.photoUrl.includes('/cm/') ? "Default avatar" : "Yes"}
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-theme-dark mb-1">New:</p>
              <div className="text-theme-dark">
                <div>
                  {result.new.firstName || "—"} {result.new.lastName || "—"}
                </div>
                {result.new.company && (
                  <div className="text-xs text-theme-dark">{result.new.company}</div>
                )}
                {result.new.photoUrl && (
                  <div className="text-xs text-theme-dark">
                    Photo: {result.new.photoUrl.includes('/cm/') ? "Default avatar" : "Yes"}
                  </div>
                )}
              </div>
            </div>
          </div>
          {result.updates && result.updates.length > 0 && (
            <div className="text-xs text-theme-dark mt-2">
              Updated fields: {result.updates.join(", ")}
            </div>
          )}
        </div>
      )}

      {result.action === "skipped" && result.current && (
        <div className="text-sm text-theme-dark">
          <div>
            {result.current.firstName || "—"} {result.current.lastName || "—"}
          </div>
          {result.current.company && (
            <div className="text-xs text-theme-dark">{result.current.company}</div>
          )}
        </div>
      )}
    </div>
  );
}

