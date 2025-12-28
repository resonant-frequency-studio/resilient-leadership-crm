"use client";

import { ChangeEvent } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/Button";
import Textarea from "@/components/Textarea";
import { ErrorMessage } from "@/components/ErrorMessage";

interface CancelTouchpointModalProps {
  isOpen: boolean;
  contactName: string;
  reason: string;
  error: string | null;
  isPending: boolean;
  onClose: () => void;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onDismissError: () => void;
  compact?: boolean;
}

export default function CancelTouchpointModal({
  isOpen,
  contactName,
  reason,
  error,
  isPending,
  onClose,
  onReasonChange,
  onConfirm,
  onDismissError,
  compact = false,
}: CancelTouchpointModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Not needed right now"
      closeOnBackdropClick={!isPending}
    >
      <p className="text-sm text-theme-dark mb-4">
        {compact ? (
          <>
            Skip the touchpoint for <strong>{contactName}</strong>? This indicates no action is needed at this time.
          </>
        ) : (
          <>
            Mark this touchpoint for <strong>{contactName}</strong> as not needed right now? This indicates no action is needed at this time.
          </>
        )}
      </p>
      <div className="mb-4">
        <label
          htmlFor={compact ? "touchpoint-skip-reason-compact" : "touchpoint-skip-reason"}
          className="block text-sm font-medium text-theme-darker mb-2"
        >
          Reason (optional)
          <span className="text-xs text-gray-500 font-normal ml-1">
            — This will be saved and displayed on the contact page
          </span>
        </label>
        <Textarea
          id={compact ? "touchpoint-skip-reason-compact" : "touchpoint-skip-reason"}
          name={compact ? "touchpoint-skip-reason-compact" : "touchpoint-skip-reason"}
          value={reason}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onReasonChange(e.target.value)}
          placeholder="e.g., Not relevant, contact inactive, wrong contact..."
          className="px-3 py-2 text-theme-darkest disabled:text-theme-dark"
          rows={3}
          disabled={isPending}
          autoComplete="off"
          data-form-type="other"
          data-lpignore="true"
          data-1p-ignore="true"
        />
      </div>
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} dismissible onDismiss={onDismissError} />
        </div>
      )}
      <div className="flex gap-3 justify-end">
        <Button onClick={onClose} disabled={isPending} size="sm">
          Keep Touchpoint
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}
          loading={isPending}
          variant="outline"
          size="sm"
        >
          Not needed right now
        </Button>
      </div>
    </Modal>
  );
}

