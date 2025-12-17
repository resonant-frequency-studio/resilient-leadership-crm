"use client";

import { CalendarEvent, Contact } from "@/types/firestore";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";

interface EventNextActionsProps {
  event: CalendarEvent;
  linkedContact: Contact | null;
  onCreateFollowUp: () => void;
  onDraftEmail: () => void;
  onAddActionItem: () => void;
  onViewContact: () => void;
  onLinkContact: () => void;
  followUpEmailDraft?: string | null;
}

export default function EventNextActions({
  event,
  linkedContact,
  onCreateFollowUp,
  onDraftEmail,
  onAddActionItem,
  onViewContact,
  onLinkContact,
  followUpEmailDraft,
}: EventNextActionsProps) {
  const router = useRouter();

  const handleDraftEmail = () => {
    if (followUpEmailDraft && linkedContact?.primaryEmail) {
      const subject = encodeURIComponent(`Follow-up: ${event.title}`);
      const body = encodeURIComponent(followUpEmailDraft);
      window.open(
        `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(linkedContact.primaryEmail)}&su=${subject}&body=${body}`,
        "_blank"
      );
    } else {
      onDraftEmail();
    }
  };

  const handleAddActionItem = () => {
    if (linkedContact) {
      router.push(`/contacts/${linkedContact.contactId}?actionItem=true`);
    } else {
      onAddActionItem();
    }
  };

  if (!linkedContact) {
    return (
      <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 py-4 border-b border-theme-light mb-4">
        <Button
          onClick={onLinkContact}
          variant="primary"
          size="lg"
          fullWidth
        >
          Link a Contact
        </Button>
      </div>
    );
  }

  return (
    <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 py-4 border-b border-theme-light mb-4">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onCreateFollowUp}
          variant="primary"
          size="lg"
        >
          Create Follow-up
        </Button>
        <Button
          onClick={handleDraftEmail}
          variant="secondary"
          size="lg"
        >
          Draft Follow-up Email
        </Button>
        <Button
          onClick={handleAddActionItem}
          variant="secondary"
          size="lg"
        >
          Add Action Item
        </Button>
        <Button
          onClick={onViewContact}
          variant="outline"
          size="lg"
        >
          View Contact
        </Button>
      </div>
    </div>
  );
}

