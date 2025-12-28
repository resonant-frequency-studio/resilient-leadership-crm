"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/Button";

interface OverwriteModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingContactsCount: number;
  overwriteMode: "overwrite" | "skip" | null;
  onOverwriteModeChange: (mode: "overwrite" | "skip") => void;
  onContinue: () => void;
  isImporting: boolean;
}

export default function OverwriteModeModal({
  isOpen,
  onClose,
  existingContactsCount,
  overwriteMode,
  onOverwriteModeChange,
  onContinue,
  isImporting,
}: OverwriteModeModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Options">
      <p className="text-theme-dark mb-4">
        Found {existingContactsCount} existing contact
        {existingContactsCount !== 1 ? "s" : ""} in your database that match contacts in the
        CSV file.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        How would you like to handle existing contacts?
      </p>
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="overwriteMode"
            value="overwrite"
            checked={overwriteMode === "overwrite"}
            onChange={() => onOverwriteModeChange("overwrite")}
            className="mt-1"
          />
          <div>
            <div className="font-medium text-theme-darkest">Overwrite existing contacts</div>
            <div className="text-sm text-gray-500">
              Replace all fields in existing contacts with data from the CSV. This will
              overwrite any modifications you&apos;ve made.
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="radio"
            name="overwriteMode"
            value="skip"
            checked={overwriteMode === "skip"}
            onChange={() => onOverwriteModeChange("skip")}
            className="mt-1"
          />
          <div>
            <div className="font-medium text-theme-darkest">Skip existing contacts</div>
            <div className="text-sm text-gray-500">
              Only import new contacts. Existing contacts will be left unchanged, preserving
              your modifications.
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          onClick={onClose}
          disabled={isImporting}
          variant="outline"
          size="md"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={!overwriteMode || isImporting}
          variant="primary"
          size="md"
        >
          Continue Import
        </Button>
      </div>
    </Modal>
  );
}

