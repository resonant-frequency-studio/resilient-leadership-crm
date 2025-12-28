"use client";

import { useContactAutosave } from "./ContactAutosaveProvider";
import { Button } from "@/components/Button";
import { useState, useEffect } from "react";

export default function ContactSaveBar() {
  const {
    isSaving,
    pendingCount,
    lastSavedAt,
    lastError,
    hasUnsavedChanges,
    flush,
    clearError,
  } = useContactAutosave();
  const [isManuallySaving, setIsManuallySaving] = useState(false);
  const [showSavedBriefly, setShowSavedBriefly] = useState(false);

  // Show "Saved" briefly after manual save
  useEffect(() => {
    if (lastSavedAt && !isSaving && !hasUnsavedChanges && !lastError) {
      setShowSavedBriefly(true);
      const timer = setTimeout(() => setShowSavedBriefly(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowSavedBriefly(false);
    }
  }, [lastSavedAt, isSaving, hasUnsavedChanges, lastError]);

  const handleManualSave = async () => {
    setIsManuallySaving(true);
    clearError();
    try {
      const success = await flush();
      if (!success && lastError) {
        // Error already set by flush
      }
    } catch (error) {
      // Error handled by provider
    } finally {
      setIsManuallySaving(false);
    }
  };

  const getStatusText = () => {
    if (isSaving || isManuallySaving || pendingCount > 0) {
      return "Saving…";
    }
    if (lastError) {
      return "Couldn't save";
    }
    if (showSavedBriefly) {
      return "Saved";
    }
    if (lastSavedAt) {
      // Show "Saved" if saved within last 5 seconds
      const timeSinceSave = Date.now() - lastSavedAt;
      if (timeSinceSave < 5000) {
        return "Saved";
      }
    }
    return null;
  };

  const getButtonLabel = () => {
    if (isSaving || isManuallySaving || pendingCount > 0) {
      return "Saving…";
    }
    if (lastError) {
      return "Retry save";
    }
    if (showSavedBriefly) {
      return "Saved";
    }
    return "Save changes";
  };

  const statusText = getStatusText();
  const buttonLabel = getButtonLabel();
  const isButtonDisabled = !hasUnsavedChanges && pendingCount === 0 && !lastError;

  return (
    <div className="flex items-center gap-3">
      {statusText && (
        <span
          className={`text-sm ${
            lastError
              ? "text-red-600 dark:text-red-400"
              : isSaving || isManuallySaving
              ? "text-blue-600 dark:text-blue-400"
              : "text-green-600 dark:text-green-400"
          }`}
        >
          {statusText}
        </span>
      )}
      <Button
        onClick={handleManualSave}
        disabled={isButtonDisabled}
        variant={hasUnsavedChanges && !lastError ? "primary" : "outline"}
        size="sm"
      >
        {buttonLabel}
      </Button>
    </div>
  );
}

