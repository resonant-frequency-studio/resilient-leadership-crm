"use client";

import { ChangeEvent } from "react";
import Modal from "@/components/Modal";
import { Button } from "@/components/Button";
import Textarea from "@/components/Textarea";
import { ErrorMessage } from "@/components/ErrorMessage";

interface CompleteTouchpointModalProps {
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

export default function CompleteTouchpointModal({
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
}: CompleteTouchpointModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark as Contacted"
      closeOnBackdropClick={!isPending}
    >
      <p className="text-sm text-theme-dark mb-4">
        Mark the touchpoint for <strong>{contactName}</strong> as contacted? This indicates you&apos;ve reached out to them.
      </p>
      <div className="mb-4">
        <label
          htmlFor={compact ? "touchpoint-complete-note-compact" : "touchpoint-complete-note"}
          className="block text-sm font-medium text-theme-darker mb-2"
        >
          Note (optional)
          <span className="text-xs text-gray-500 font-normal ml-1">
            — This will be saved and displayed on the contact page
          </span>
        </label>
        <Textarea
          id={compact ? "touchpoint-complete-note-compact" : "touchpoint-complete-note"}
          name={compact ? "touchpoint-complete-note-compact" : "touchpoint-complete-note"}
          value={reason}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onReasonChange(e.target.value)}
          placeholder="e.g., Discussed proposal, scheduled follow-up, sent quote..."
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
        <Button onClick={onClose} disabled={isPending} variant="outline" size="sm">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={isPending}
          loading={isPending}
          variant={compact ? "primary" : "secondary"}
          size="sm"
        >
          {compact ? "Mark as Contacted" : "Mark Completed"}
        </Button>
      </div>
    </Modal>
  );
}

