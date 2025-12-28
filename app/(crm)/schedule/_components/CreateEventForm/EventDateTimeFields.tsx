"use client";

import Input from "@/components/Input";
import { formatForInput, parseFromInput } from "../utils/dateTimeFormatters";

interface EventDateTimeFieldsProps {
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onAllDayChange: (checked: boolean) => void;
  startTimeError?: string;
  endTimeError?: string;
}

export default function EventDateTimeFields({
  startTime,
  endTime,
  isAllDay,
  onStartTimeChange,
  onEndTimeChange,
  onAllDayChange,
  startTimeError,
  endTimeError,
}: EventDateTimeFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-theme-darkest mb-1">
            Start <span className="text-red-500">*</span>
          </label>
          <Input
            type={isAllDay ? "date" : "datetime-local"}
            value={formatForInput(new Date(startTime), isAllDay)}
            onChange={(e) => {
              const value = e.target.value;
              const newStartTime = parseFromInput(value, isAllDay);
              onStartTimeChange(newStartTime);
            }}
            required
          />
          {startTimeError && (
            <p className="text-red-500 text-sm mt-1">{startTimeError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-theme-darkest mb-1">
            End <span className="text-red-500">*</span>
          </label>
          <Input
            type={isAllDay ? "date" : "datetime-local"}
            value={formatForInput(new Date(endTime), isAllDay)}
            onChange={(e) => {
              const value = e.target.value;
              const newEndTime = parseFromInput(value, isAllDay);
              onEndTimeChange(newEndTime);
            }}
            required
          />
          {endTimeError && (
            <p className="text-red-500 text-sm mt-1">{endTimeError}</p>
          )}
        </div>
      </div>

      {/* All-day toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isAllDay"
          checked={isAllDay}
          onChange={(e) => onAllDayChange(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="isAllDay" className="text-sm font-medium text-theme-darkest">
          All-day event
        </label>
      </div>
    </>
  );
}

