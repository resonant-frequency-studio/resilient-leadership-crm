"use client";

import Input from "@/components/Input";

interface EventTitleFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function EventTitleField({ value, onChange, error }: EventTitleFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-theme-darkest mb-1">
        Title <span className="text-red-500">*</span>
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Event title"
        required
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
}

