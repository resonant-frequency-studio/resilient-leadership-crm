"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";
import Textarea from "@/components/Textarea";
import { ProcessResult } from "./types";

interface EnrichSingleContactFormProps {
  emailInput: string;
  dryRun: boolean;
  processing: boolean;
  results: ProcessResult[];
  onEmailInputChange: (value: string) => void;
  onDryRunChange: (value: boolean) => void;
  onProcess: () => void;
  onClear: () => void;
}

export default function EnrichSingleContactForm({
  emailInput,
  dryRun,
  processing,
  results,
  onEmailInputChange,
  onDryRunChange,
  onProcess,
  onClear,
}: EnrichSingleContactFormProps) {
  return (
    <Card padding="md">
      <div className="space-y-4">
        <div>
          <label htmlFor="emailInput" className="block text-sm font-medium text-theme-darker mb-2">
            Email Address(es)
          </label>
          <Textarea
            id="emailInput"
            value={emailInput}
            onChange={(e) => onEmailInputChange(e.target.value)}
            placeholder="Enter email addresses, one per line or comma-separated&#10;Example:&#10;john.doe@example.com&#10;jane.smith@company.com"
            rows={6}
            disabled={processing}
            className="font-mono text-sm"
          />
          <p className="text-xs text-theme-dark mt-2">
            You can enter multiple email addresses separated by commas or new lines
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-sm border border-theme-light bg-card-highlight-light">
          <input
            type="checkbox"
            id="dryRun"
            checked={dryRun}
            onChange={(e) => onDryRunChange(e.target.checked)}
            disabled={processing}
            className="w-4 h-4 rounded border-theme-light focus:ring-btn-primary-focus-ring"
            style={{
              accentColor: 'var(--btn-primary-bg)',
            }}
          />
          <label htmlFor="dryRun" className="text-sm font-medium text-theme-darker cursor-pointer">
            Dry run (preview changes without updating)
          </label>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onProcess}
            disabled={processing || !emailInput.trim()}
            loading={processing}
            variant={dryRun ? "primary" : "danger"}
            size="lg"
            className="flex-1"
          >
            {processing ? "Processing..." : dryRun ? "Preview Changes" : "Enrich and Update"}
          </Button>
          {results.length > 0 && (
            <Button
              onClick={onClear}
              disabled={processing}
              variant="outline"
              size="lg"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

