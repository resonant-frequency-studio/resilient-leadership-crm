"use client";

import { Contact } from "@/types/firestore";
import { Button } from "@/components/Button";
import { ErrorMessage } from "@/components/ErrorMessage";
import CompleteTouchpointModal from "./CompleteTouchpointModal";
import CancelTouchpointModal from "./CancelTouchpointModal";

interface FullViewProps {
  currentStatus: Contact["touchpointStatus"];
  contactName: string;
  reason: string;
  error: string | null;
  isPending: boolean;
  showCompleteModal: boolean;
  showCancelModal: boolean;
  showRestoreButton: boolean;
  onShowCompleteModal: (show: boolean) => void;
  onShowCancelModal: (show: boolean) => void;
  onReasonChange: (reason: string) => void;
  onUpdateStatus: (status: "completed" | "cancelled" | null, reason?: string) => Promise<void>;
  onDismissError: () => void;
}

export default function FullView({
  currentStatus,
  contactName,
  reason,
  error,
  isPending,
  showCompleteModal,
  showCancelModal,
  showRestoreButton,
  onShowCompleteModal,
  onShowCancelModal,
  onReasonChange,
  onUpdateStatus,
  onDismissError,
}: FullViewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        {currentStatus === "completed" && (
          <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-full">
            ✓ Contacted
          </span>
        )}
        {currentStatus === "cancelled" && (
          <span className="px-3 py-1 text-sm font-medium text-[#eeeeec] bg-theme-medium rounded-full">
            ✕ Skipped
          </span>
        )}
        {(!currentStatus || currentStatus === "pending") && (
          <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
            Pending
          </span>
        )}
      </div>

      {(!currentStatus || currentStatus === "pending") && (
        <div className="flex gap-2">
          <Button
            onClick={() => onShowCompleteModal(true)}
            disabled={isPending}
            variant="primary"
            size="sm"
          >
            Mark as Contacted
          </Button>
          <button
            onClick={() => onShowCancelModal(true)}
            disabled={isPending}
            className="text-sm text-theme-dark hover:text-theme-darker underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            Not needed right now
          </button>
        </div>
      )}

      {(currentStatus === "completed" || currentStatus === "cancelled") && showRestoreButton && (
        <Button
          onClick={() => onUpdateStatus(null)}
          disabled={isPending}
          loading={isPending}
          variant="outline"
          size="sm"
          className="text-blue-700 bg-blue-50 hover:bg-blue-100"
        >
          Restore to Pending
        </Button>
      )}

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
        compact={false}
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
        compact={false}
      />
    </div>
  );
}

