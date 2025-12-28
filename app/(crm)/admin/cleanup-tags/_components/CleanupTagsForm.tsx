"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";

interface CleanupTagsFormProps {
  dryRun: boolean;
  running: boolean;
  selectedCount: number;
  onDryRunChange: (dryRun: boolean) => void;
  onCleanup: () => void;
}

export default function CleanupTagsForm({
  dryRun,
  running,
  selectedCount,
  onDryRunChange,
  onCleanup,
}: CleanupTagsFormProps) {
  return (
    <Card padding="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="dryRun"
            checked={dryRun}
            onChange={(e) => onDryRunChange(e.target.checked)}
            className="w-5 h-5 rounded border-theme-light focus:ring-btn-primary-focus-ring"
            style={{
              accentColor: 'var(--btn-primary-bg)',
            }}
          />
          <label htmlFor="dryRun" className="text-sm font-medium text-theme-darkest">
            Dry run mode (preview changes without applying them)
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCleanup}
            disabled={running || selectedCount === 0}
            loading={running}
            size="md"
          >
            {dryRun ? "Preview Changes" : "Remove Selected Tags"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

