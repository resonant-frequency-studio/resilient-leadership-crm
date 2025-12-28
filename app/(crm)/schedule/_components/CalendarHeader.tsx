"use client";

import { Button } from "@/components/Button";

interface CalendarHeaderProps {
  onAddTimeBlock: () => void;
}

export default function CalendarHeader({ onAddTimeBlock }: CalendarHeaderProps) {
  return (
    <div data-tour="schedule-header" className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
      <div>
        <h1 className="text-4xl font-bold text-theme-darkest mb-2">Schedule</h1>
        <p className="text-theme-dark text-lg">Plan your week with clarity—sessions, follow-ups, and focus time in one place</p>
      </div>
      {/* Buttons - Mobile: below header, Desktop: right side */}
      <div className="flex flex-col items-stretch sm:items-end gap-3 xl:shrink-0 w-full sm:w-auto">
        <Button
          data-tour="schedule-add-time-block"
          onClick={onAddTimeBlock}
          size="sm"
          fullWidth
          className="whitespace-nowrap shadow-sm"
        >
          Add time block
        </Button>
      </div>
    </div>
  );
}

