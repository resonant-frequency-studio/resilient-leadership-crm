"use client";

import { useState } from "react";
import { Contact } from "@/types/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useTouchpointStatusUpdate } from "./TouchpointStatusActions/hooks/useTouchpointStatusUpdate";
import CompactView from "./TouchpointStatusActions/CompactView";
import FullView from "./TouchpointStatusActions/FullView";

interface TouchpointStatusActionsProps {
  contactId: string;
  contactName: string;
  userId: string;
  onStatusUpdate?: () => void;
  compact?: boolean; // For dashboard cards
  // Optional: for cases where contact data isn't in React Query (e.g., ContactCard in lists)
  currentStatus?: Contact["touchpointStatus"];
  // Optional: control whether to show Restore button (for 60-second timer logic)
  showRestoreButton?: boolean;
}

export default function TouchpointStatusActions({
  contactId,
  contactName,
  userId,
  onStatusUpdate,
  compact = false,
  currentStatus: fallbackStatus,
  showRestoreButton: showRestoreButtonProp,
}: TouchpointStatusActionsProps) {
  const { user } = useAuth();
  
  // Use userId prop if provided, otherwise fall back to user?.uid
  const effectiveUserId = userId || user?.uid || "";

  const {
    currentStatus,
    mutation,
    error,
    setError,
    handleUpdateStatus,
  } = useTouchpointStatusUpdate({
    contactId,
    userId: effectiveUserId,
    fallbackStatus,
    onStatusUpdate,
  });

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [reason, setReason] = useState("");

  const handleUpdateWithModalClose = async (status: "completed" | "cancelled" | null, reason?: string) => {
    try {
      await handleUpdateStatus(status, reason);
      setShowCancelModal(false);
      setShowCompleteModal(false);
      setReason("");
    } catch {
      // Error is handled by the hook
    }
  };

  if (compact) {
    return (
      <CompactView
        currentStatus={currentStatus}
        contactName={contactName}
        reason={reason}
        error={error}
        isPending={mutation.isPending}
        showCompleteModal={showCompleteModal}
        showCancelModal={showCancelModal}
        onShowCompleteModal={setShowCompleteModal}
        onShowCancelModal={setShowCancelModal}
        onReasonChange={setReason}
        onUpdateStatus={handleUpdateWithModalClose}
        onDismissError={() => setError(null)}
      />
    );
  }

  return (
    <FullView
      currentStatus={currentStatus}
      contactName={contactName}
      reason={reason}
      error={error}
      isPending={mutation.isPending}
      showCompleteModal={showCompleteModal}
      showCancelModal={showCancelModal}
      showRestoreButton={showRestoreButtonProp !== false}
      onShowCompleteModal={setShowCompleteModal}
      onShowCancelModal={setShowCancelModal}
      onReasonChange={setReason}
      onUpdateStatus={handleUpdateWithModalClose}
      onDismissError={() => setError(null)}
    />
  );
}

