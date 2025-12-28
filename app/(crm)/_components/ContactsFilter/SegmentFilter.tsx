"use client";

import Select from "@/components/Select";

interface SegmentFilterProps {
  selectedSegment: string;
  uniqueSegments: string[];
  disabled: boolean;
  onSegmentChange: (value: string) => void;
}

export default function SegmentFilter({
  selectedSegment,
  uniqueSegments,
  disabled,
  onSegmentChange,
}: SegmentFilterProps) {
  return (
    <div>
      <label htmlFor="segment-filter" className="block text-sm font-medium text-theme-darker mb-2">
        Filter by Segment
      </label>
      <Select
        id="segment-filter"
        value={selectedSegment}
        onChange={(e) => onSegmentChange(e.target.value)}
        disabled={disabled}
      >
        <option value="">All Segments</option>
        <option value="__NO_SEGMENT__">No Segment (Unassigned)</option>
        {uniqueSegments.map(segment => (
          <option key={segment} value={segment}>{segment}</option>
        ))}
      </Select>
    </div>
  );
}

