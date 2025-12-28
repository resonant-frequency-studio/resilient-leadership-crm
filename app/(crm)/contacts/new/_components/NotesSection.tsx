"use client";

import Card from "@/components/Card";
import Textarea from "@/components/Textarea";

import { NewContactForm } from "@/hooks/useNewContactPage";

interface NotesSectionProps {
  notes?: string | null;
  updateField: (field: keyof NewContactForm, value: string | string[] | number | null) => void;
}

export default function NotesSection({ notes, updateField }: NotesSectionProps) {
  return (
    <Card padding="md">
      <h2 className="text-lg font-semibold text-theme-darkest mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Notes
      </h2>
      <label htmlFor="new-contact-notes" className="sr-only">Notes</label>
      <Textarea
        id="new-contact-notes"
        name="new-contact-notes"
        rows={6}
        value={notes || ""}
        onChange={(e) => updateField("notes", e.target.value)}
        placeholder="Add notes about this contact..."
      />
    </Card>
  );
}

