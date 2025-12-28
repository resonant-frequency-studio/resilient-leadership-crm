"use client";

import Textarea from "@/components/Textarea";

interface EventAttendeesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EventAttendeesField({ value, onChange }: EventAttendeesFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-theme-darkest mb-1">
        Attendees (one email per line)
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="email@example.com"
        rows={3}
      />
    </div>
  );
}

