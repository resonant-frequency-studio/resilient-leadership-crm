"use client";

import { Button } from "@/components/Button";
import { Contact } from "@/types/firestore";

interface UnlinkContactModalProps {
  linkedContact: Contact;
  onCancel: () => void;
  onUnlink: () => void;
  isUnlinking: boolean;
}

export default function UnlinkContactModal({
  linkedContact,
  onCancel,
  onUnlink,
  isUnlinking,
}: UnlinkContactModalProps) {
  const contactName = linkedContact.firstName || linkedContact.lastName
    ? `${linkedContact.firstName || ""} ${linkedContact.lastName || ""}`.trim()
    : linkedContact.primaryEmail;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-theme-darkest">Unlink Contact</h3>
      <p className="text-theme-dark">
        Unlink this event from {contactName}? This will remove follow-up associations.
      </p>
      <div className="flex gap-2 justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isUnlinking}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={onUnlink}
          disabled={isUnlinking}
        >
          {isUnlinking ? "Unlinking..." : "Unlink"}
        </Button>
      </div>
    </div>
  );
}

