"use client";

import EnrichSingleContactResultCard from "./EnrichSingleContactResultCard";
import { ProcessResult } from "./types";

interface EnrichSingleContactResultsProps {
  results: ProcessResult[];
}

export default function EnrichSingleContactResults({
  results,
}: EnrichSingleContactResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div
      className="rounded-sm border p-4 sm:p-6"
      style={{
        backgroundColor: 'var(--chip-green-bg)',
        borderColor: 'var(--chip-green-text)',
      }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-theme-darkest">
            Results ({results.length} processed)
          </h3>
          <div className="text-sm" style={{ color: 'var(--chip-green-text)' }}>
            {results.filter((r) => r.action === "updated").length} updated,{" "}
            {results.filter((r) => r.action === "skipped").length} skipped
          </div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {results.map((result, idx) => (
            <EnrichSingleContactResultCard key={idx} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
}

