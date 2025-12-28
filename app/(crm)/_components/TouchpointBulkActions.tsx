"use client";

import BulkActionsBar from "@/components/BulkActionsBar";

interface TouchpointBulkActionsProps {
  selectedCount: number;
  onMarkAsContacted: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export default function TouchpointBulkActions({
  selectedCount,
  onMarkAsContacted,
  onSkip,
  isLoading = false,
}: TouchpointBulkActionsProps) {
  return (
    <BulkActionsBar
      selectedCount={selectedCount}
      itemLabel="touchpoint"
      actions={[
        {
          label: "Mark as Contacted",
          labelMobile: "Mark Contacted",
          onClick: onMarkAsContacted,
          variant: "primary",
          disabled: isLoading,
          loading: isLoading,
          showCount: true,
          icon: (
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
        },
        {
          label: "Not needed right now",
          labelMobile: "Not needed",
          onClick: onSkip,
          variant: "link",
          disabled: isLoading,
          loading: isLoading,
          showCount: false,
        },
      ]}
    />
  );
}

