"use client";

import Select from "@/components/Select";

interface CustomFiltersProps {
  customFilter: "at-risk" | "warm" | "needs-attention" | null | undefined;
  disabled: boolean;
  onCustomFilterChange: (value: "at-risk" | "warm" | null) => void;
}

export default function CustomFilters({
  customFilter,
  disabled,
  onCustomFilterChange,
}: CustomFiltersProps) {
  return (
    <div>
      <label htmlFor="quick-filters" className="block text-sm font-medium text-theme-darker mb-2">
        Quick Filters
      </label>
      <Select
        id="quick-filters"
        value={customFilter || ""}
        onChange={(e) => {
          const value = e.target.value;
          if (value === "") {
            onCustomFilterChange(null);
          } else if (value === "at-risk" || value === "warm") {
            onCustomFilterChange(value);
          }
          // Note: "needs-attention" is not supported by the handler, so it's ignored
        }}
        disabled={disabled}
      >
        <option value="">None</option>
        <option value="at-risk">At-Risk (14+ days no reply)</option>
        <option value="warm">Warm Leads (50-70 engagement)</option>
      </Select>
    </div>
  );
}

