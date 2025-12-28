"use client";

import { Contact } from "@/types/firestore";
import { Button } from "@/components/Button";
import { ErrorMessage } from "@/components/ErrorMessage";
import CompleteTouchpointModal from "./CompleteTouchpointModal";
import CancelTouchpointModal from "./CancelTouchpointModal";

interface CompactViewProps {
  currentStatus: Contact["touchpointStatus"];
  contactName: string;
  reason: string;
  error: string | null;
  isPending: boolean;
  showCompleteModal: boolean;
  showCancelModal: boolean;
  onShowCompleteModal: (show: boolean) => void;
  onShowCancelModal: (show: boolean) => void;
  onReasonChange: (reason: string) => void;
  onUpdateStatus: (status: "completed" | "cancelled" | null, reason?: string) => Promise<void>;
  onDismissError: () => void;
}

export default function CompactView({
  currentStatus,
  contactName,
  reason,
  error,
  isPending,
  showCompleteModal,
  showCancelModal,
  onShowCompleteModal,
  onShowCancelModal,
  onReasonChange,
  onUpdateStatus,
  onDismissError,
}: CompactViewProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {currentStatus !== "completed" && (
          <Button
            variant="primary"
            onClick={() => onShowCompleteModal(true)}
            disabled={isPending}
            size="sm"
            className="flex-1 !px-1 !py-0.5 sm:!px-4 sm:!py-2.5 text-[11px] sm:text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="I've contacted this person"
          >
            <svg
              className="w-3.5 h-3.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="whitespace-nowrap">Mark as Contacted</span>
          </Button>
        )}
        {currentStatus !== "cancelled" && (
          <button
            onClick={() => onShowCancelModal(true)}
            disabled={isPending}
            className="text-sm text-theme-dark hover:text-theme-darker underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
            title="Skip this touchpoint - no action needed"
          >
            Not needed right now
          </button>
        )}
      </div>
      {error && <ErrorMessage message={error} dismissible onDismiss={onDismissError} />}
      <CompleteTouchpointModal
        isOpen={showCompleteModal}
        contactName={contactName}
        reason={reason}
        error={error}
        isPending={isPending}
        onClose={() => {
          if (!isPending) {
            onShowCompleteModal(false);
            onReasonChange("");
            onDismissError();
          }
        }}
        onReasonChange={onReasonChange}
        onConfirm={() => onUpdateStatus("completed", reason)}
        onDismissError={onDismissError}
        compact={true}
      />
      <CancelTouchpointModal
        isOpen={showCancelModal}
        contactName={contactName}
        reason={reason}
        error={error}
        isPending={isPending}
        onClose={() => {
          if (!isPending) {
            onShowCancelModal(false);
            onReasonChange("");
            onDismissError();
          }
        }}
        onReasonChange={onReasonChange}
        onConfirm={() => onUpdateStatus("cancelled", reason)}
        onDismissError={onDismissError}
        compact={true}
      />
    </div>
  );
}

