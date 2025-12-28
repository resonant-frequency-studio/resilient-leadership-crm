"use client";

import { Button } from "@/components/Button";

interface DeleteEventModalProps {
  eventTitle: string;
  onCancel: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function DeleteEventModal({
  eventTitle,
  onCancel,
  onDelete,
  isDeleting,
}: DeleteEventModalProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-theme-darkest">Delete Event</h3>
      <p className="text-theme-dark">
        Are you sure you want to delete &quot;{eventTitle}&quot;? This action cannot be undone.
      </p>
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

