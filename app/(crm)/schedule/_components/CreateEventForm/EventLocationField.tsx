"use client";

import Input from "@/components/Input";

interface EventLocationFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EventLocationField({ value, onChange }: EventLocationFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-theme-darkest mb-1">
        Location
      </label>
      <Input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Event location"
      />
    </div>
  );
}

