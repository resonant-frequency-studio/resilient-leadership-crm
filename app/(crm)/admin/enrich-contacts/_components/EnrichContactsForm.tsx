"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";

interface EnrichContactsFormProps {
  dryRun: boolean;
  onDryRunChange: (value: boolean) => void;
  onSubmit: () => void;
  running: boolean;
}

export default function EnrichContactsForm({
  dryRun,
  onDryRunChange,
  onSubmit,
  running,
}: EnrichContactsFormProps) {
  return (
    <Card padding="md">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-theme-darkest mb-2">What this does:</h2>
          <ul className="list-disc list-inside space-y-1 text-theme-darker">
            <li>Searches Google People API for contact information by email address</li>
            <li>Enriches contacts with first name, last name, company name, and profile photo</li>
            <li>Falls back to email-based extraction if People API doesn&apos;t have the contact</li>
            <li>Only updates missing or non-well-formed fields</li>
            <li>Does not overwrite existing well-formed data</li>
            <li>Requires Google account to be linked with People API scope</li>
          </ul>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-sm border border-theme-light bg-card-highlight-light">
          <input
            type="checkbox"
            id="dryRun"
            checked={dryRun}
            onChange={(e) => onDryRunChange(e.target.checked)}
            disabled={running}
            className="w-4 h-4 rounded border-theme-light focus:ring-btn-primary-focus-ring"
            style={{
              accentColor: 'var(--btn-primary-bg)',
            }}
          />
          <label htmlFor="dryRun" className="text-sm font-medium text-theme-darker cursor-pointer">
            Dry run (preview changes without updating)
          </label>
        </div>

        <Button
          onClick={onSubmit}
          disabled={running}
          loading={running}
          variant={dryRun ? "primary" : "danger"}
          size="lg"
          fullWidth
        >
          {dryRun ? "Preview Changes" : "Enrich Contacts and Update"}
        </Button>
      </div>
    </Card>
  );
}

