"use client";

import Input from "@/components/Input";
import Checkbox from "@/components/Checkbox";
import { formatDateForInput, parseDateFromInput } from "./utils/dateFormatters";

interface DateRangeFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  includeNewContacts: boolean;
  disabled: boolean;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onIncludeNewContactsChange: (include: boolean) => void;
  onReset: () => void;
  isDefault: boolean;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  includeNewContacts,
  disabled,
  onStartDateChange,
  onEndDateChange,
  onIncludeNewContactsChange,
  onReset,
  isDefault,
}: DateRangeFilterProps) {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseDateFromInput(e.target.value);
    onStartDateChange(date);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = parseDateFromInput(e.target.value);
    onEndDateChange(date);
  };

  return (
    <div className="mb-4 pb-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-theme-darker">
          Filter by Last Email Date
        </label>
        {!disabled && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700 underline cursor-pointer"
          >
            Reset date filter
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-xs font-medium text-theme-darker mb-1">
            From Date
          </label>
          <Input
            id="start-date"
            type="date"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-xs font-medium text-theme-darker mb-1">
            To Date
          </label>
          <Input
            id="end-date"
            type="date"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            disabled={disabled}
          />
        </div>
      </div>
      {!isDefault && (
        <p className="mt-2 text-xs text-gray-500">
          Showing contacts with last email date between {formatDateForInput(startDate)} and {formatDateForInput(endDate)}
        </p>
      )}
      <div className="mt-3" style={{ pointerEvents: 'none' }}>
        <div style={{ pointerEvents: 'auto', display: 'inline-block' }}>
          <Checkbox
            checked={includeNewContacts}
            onChange={(e) => {
              e.stopPropagation();
              onIncludeNewContactsChange(e.target.checked);
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            label="Include contacts with no email history"
            disabled={disabled}
            labelClassName="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

