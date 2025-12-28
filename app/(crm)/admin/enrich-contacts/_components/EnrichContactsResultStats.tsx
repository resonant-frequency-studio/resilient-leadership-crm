"use client";

interface EnrichContactsResultStatsProps {
  processed: number;
  updated: number;
  skipped: number;
  errors: number;
}

export default function EnrichContactsResultStats({
  processed,
  updated,
  skipped,
  errors,
}: EnrichContactsResultStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-xs text-theme-dark">Processed</p>
        <p className="text-lg font-bold text-theme-darkest">{processed}</p>
      </div>
      <div>
        <p className="text-xs text-theme-dark">Updated</p>
        <p className="text-lg font-bold" style={{ color: 'var(--chip-green-text)' }}>{updated}</p>
      </div>
      <div>
        <p className="text-xs text-theme-dark">Skipped</p>
        <p className="text-lg font-bold" style={{ color: 'var(--chip-yellow-text)' }}>{skipped}</p>
      </div>
      <div>
        <p className="text-xs text-theme-dark">Errors</p>
        <p className="text-lg font-bold" style={{ color: 'var(--chip-red-text)' }}>{errors}</p>
      </div>
    </div>
  );
}

