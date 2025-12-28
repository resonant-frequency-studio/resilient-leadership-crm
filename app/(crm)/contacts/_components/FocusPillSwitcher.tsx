"use client";

import React from "react";

export type FocusType = "all" | "work" | "personal";

interface FocusPillSwitcherProps {
  value: FocusType;
  onChange: (value: FocusType) => void;
}

const FOCUS_OPTIONS: { value: FocusType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
];

const FOCUS_HELPER_TEXT: Record<FocusType, string> = {
  all: "Showing all relationships across work and personal life",
  work: "Focused on professional relationships and active engagements",
  personal: "Showing personal and non-work relationships",
};

export default function FocusPillSwitcher({ value, onChange }: FocusPillSwitcherProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-theme-darker">Focus:</span>
        <div className="flex items-center gap-1 bg-card-highlight-light rounded-md p-1 border border-theme-light">
          {FOCUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-all duration-200 ${
                value === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-theme-dark hover:text-foreground hover:bg-card-light"
              }`}
              aria-pressed={value === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-theme-dark italic">{FOCUS_HELPER_TEXT[value]}</p>
    </div>
  );
}

