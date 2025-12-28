"use client";

import Card from "@/components/Card";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";

import { NewContactForm } from "@/hooks/useNewContactPage";

interface NextTouchpointSectionProps {
  form: {
    nextTouchpointDate?: string | null;
    nextTouchpointMessage?: string | null;
  };
  updateField: (field: keyof NewContactForm, value: string | string[] | number | null) => void;
}

export default function NextTouchpointSection({
  form,
  updateField,
}: NextTouchpointSectionProps) {
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Next Touchpoint
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="new-contact-next-touchpoint-date" className="block text-sm font-medium text-theme-darker mb-2">
            Date
          </label>
          <Input
            id="new-contact-next-touchpoint-date"
            type="date"
            value={
              form.nextTouchpointDate && typeof form.nextTouchpointDate === "string"
                ? form.nextTouchpointDate
                : ""
            }
            onChange={(e) => updateField("nextTouchpointDate", e.target.value || null)}
          />
        </div>
        <div>
          <label htmlFor="new-contact-next-touchpoint-message" className="block text-sm font-medium text-theme-darker mb-2">
            Message
          </label>
          <Textarea
            id="new-contact-next-touchpoint-message"
            name="new-contact-next-touchpoint-message"
            rows={4}
            value={form.nextTouchpointMessage || ""}
            onChange={(e) => updateField("nextTouchpointMessage", e.target.value)}
            placeholder="What should you discuss in the next touchpoint?"
          />
        </div>
      </div>
    </Card>
  );
}

