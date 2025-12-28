"use client";

import Card from "@/components/Card";
import Input from "@/components/Input";

import { NewContactForm } from "@/hooks/useNewContactPage";

interface CrmInformationSectionProps {
  form: {
    segment?: string | null;
    leadSource?: string | null;
    engagementScore?: number | null;
    tags?: string[] | null;
  };
  updateField: (field: keyof NewContactForm, value: string | string[] | number | null) => void;
}

export default function CrmInformationSection({
  form,
  updateField,
}: CrmInformationSectionProps) {
  return (
    <Card padding="md">
      <h2 className="text-lg font-semibold text-theme-darkest mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        CRM Information
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="new-contact-segment" className="block text-sm font-medium text-theme-darker mb-2">
            Segment
          </label>
          <Input
            id="new-contact-segment"
            value={form.segment || ""}
            onChange={(e) => updateField("segment", e.target.value)}
            placeholder="e.g., Enterprise, SMB, Individual"
          />
        </div>
        <div>
          <label htmlFor="new-contact-lead-source" className="block text-sm font-medium text-theme-darker mb-2">
            Lead Source
          </label>
          <Input
            id="new-contact-lead-source"
            value={form.leadSource || ""}
            onChange={(e) => updateField("leadSource", e.target.value)}
            placeholder="e.g., Website, Referral, Event"
          />
        </div>
        <div>
          <label htmlFor="new-contact-engagement-score" className="block text-sm font-medium text-theme-darker mb-2">
            Engagement Score
          </label>
          <Input
            id="new-contact-engagement-score"
            type="number"
            min="0"
            max="100"
            value={form.engagementScore || ""}
            onChange={(e) =>
              updateField("engagementScore", e.target.value ? Number(e.target.value) : null)
            }
            placeholder="0-100"
          />
        </div>
        <div>
          <label htmlFor="new-contact-tags" className="block text-sm font-medium text-theme-darker mb-2">
            Tags
          </label>
          <Input
            id="new-contact-tags"
            name="new-contact-tags"
            value={Array.isArray(form.tags) ? form.tags.join(", ") : ""}
            onChange={(e) =>
              updateField(
                "tags",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            placeholder="tag1, tag2, tag3"
          />
          <p className="mt-2 text-xs text-theme-dark">
            Enter tags separated by commas. Spaces within tags are allowed (e.g., &quot;Project Manager, Marketing Lead,Referral, VIP&quot;).
          </p>
        </div>
      </div>
    </Card>
  );
}

