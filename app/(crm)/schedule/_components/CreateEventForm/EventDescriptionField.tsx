"use client";

import Textarea from "@/components/Textarea";

interface EventDescriptionFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EventDescriptionField({ value, onChange }: EventDescriptionFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-theme-darkest mb-1">
        Description
      </label>
      <Textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Event description"
        rows={4}
      />
    </div>
  );
}

