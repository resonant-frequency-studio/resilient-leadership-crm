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
  followUpEmailDraft?: string | null;
}

export default function EventNextActions({
  event,
  linkedContact,
  onCreateFollowUp,
  onDraftEmail,
  onAddActionItem,
  onViewContact,
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

  // Only show actions if there's a linked contact
  if (!linkedContact) {
    return null;
  }

  return (
    <div 
      className="sticky top-0 z-10 py-4 mb-4"
      style={{
        backgroundColor: 'var(--surface-bar)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          onClick={onCreateFollowUp}
          variant="primary"
          size="md"
        >
          Create Follow-up
        </Button>
        <Button
          onClick={handleDraftEmail}
          variant="secondary"
          size="md"
        >
          Draft Follow-up Email
        </Button>
        <Button
          onClick={handleAddActionItem}
          variant="secondary"
          size="md"
        >
          Add Action Item
        </Button>
        <Button
          onClick={onViewContact}
          variant="outline"
          size="md"
        >
          View Contact
        </Button>
      </div>
    </div>
  );
}

