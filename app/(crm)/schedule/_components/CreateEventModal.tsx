"use client";

import { useState } from "react";
import { useCreateCalendarEvent, CreateEventInput } from "@/hooks/useCalendarEvents";
import { useContacts } from "@/hooks/useContacts";
import { useAuth } from "@/hooks/useAuth";
import { Contact } from "@/types/firestore";
import { Button } from "@/components/Button";
import Modal from "@/components/Modal";
import { useEventFormValidation } from "./CreateEventForm/useEventFormValidation";
import EventTitleField from "./CreateEventForm/EventTitleField";
import EventDateTimeFields from "./CreateEventForm/EventDateTimeFields";
import EventLocationField from "./CreateEventForm/EventLocationField";
import EventDescriptionField from "./CreateEventForm/EventDescriptionField";
import EventAttendeesField from "./CreateEventForm/EventAttendeesField";
import EventContactLinkField from "./CreateEventForm/EventContactLinkField";
import ReAuthErrorDisplay from "./ReAuthErrorDisplay";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillStartTime?: Date;
  prefillEndTime?: Date;
  prefillContactId?: string;
  contacts?: Contact[];
}

export default function CreateEventModal({
  isOpen,
  onClose,
  prefillStartTime,
  prefillEndTime,
  prefillContactId,
  contacts: providedContacts,
}: CreateEventModalProps) {
  const { user } = useAuth();
  const createMutation = useCreateCalendarEvent();
  
  // Fetch contacts if not provided
  const { data: fetchedContacts = [] } = useContacts(user?.uid || "", undefined);
  const contacts = providedContacts || fetchedContacts;

  // Default to 1 hour from now if no prefill
  const defaultStartTime = prefillStartTime || new Date();
  const defaultEndTime = prefillEndTime || new Date(defaultStartTime.getTime() + 60 * 60 * 1000);

  const [formData, setFormData] = useState<CreateEventInput>({
    title: "",
    description: "",
    location: "",
    startTime: defaultStartTime.toISOString(),
    endTime: defaultEndTime.toISOString(),
    attendees: [],
    contactId: prefillContactId,
    isAllDay: false,
  });

  const [attendeesText, setAttendeesText] = useState("");
  const [requiresReauth, setRequiresReauth] = useState(false);
  const { formErrors, validateForm, clearErrors } = useEventFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      return;
    }

    // Parse attendees from text
    const attendees = attendeesText
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email !== "" && email.includes("@"));

    try {
      setRequiresReauth(false);
      await createMutation.mutateAsync({
        ...formData,
        attendees: attendees.length > 0 ? attendees : undefined,
      });
      handleClose();
    } catch (error) {
      // Check if error requires re-authentication
      const errorMessage = error instanceof Error ? error.message : String(error);
      const needsReauth = 
        (error instanceof Error && (error as Error & { requiresReauth?: boolean }).requiresReauth) ||
        errorMessage.includes("No Google account linked") ||
        errorMessage.includes("connect your Gmail account") ||
        errorMessage.includes("Calendar access") ||
        errorMessage.includes("permission");
      
      if (needsReauth) {
        setRequiresReauth(true);
      }
    }
  };

  const handleClose = () => {
    // Reset form
    setFormData({
      title: "",
      description: "",
      location: "",
      startTime: defaultStartTime.toISOString(),
      endTime: defaultEndTime.toISOString(),
      attendees: [],
      contactId: undefined,
      isAllDay: false,
    });
    setAttendeesText("");
    clearErrors();
    setRequiresReauth(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Event"
      maxWidth="2xl"
      closeOnBackdropClick={true}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <EventTitleField
          value={formData.title}
          onChange={(value) => setFormData({ ...formData, title: value })}
          error={formErrors.title}
        />

        <EventDateTimeFields
          startTime={formData.startTime}
          endTime={formData.endTime}
          isAllDay={formData.isAllDay || false}
          onStartTimeChange={(value) => setFormData({ ...formData, startTime: value })}
          onEndTimeChange={(value) => setFormData({ ...formData, endTime: value })}
          onAllDayChange={(checked) => setFormData({ ...formData, isAllDay: checked })}
          startTimeError={formErrors.startTime}
          endTimeError={formErrors.endTime}
        />

        <EventLocationField
          value={formData.location || ""}
          onChange={(value) => setFormData({ ...formData, location: value })}
        />

        <EventDescriptionField
          value={formData.description || ""}
          onChange={(value) => setFormData({ ...formData, description: value })}
        />

        <EventAttendeesField
          value={attendeesText}
          onChange={setAttendeesText}
        />

        <EventContactLinkField
          value={formData.contactId}
          onChange={(value) => setFormData({ ...formData, contactId: value })}
          contacts={contacts}
        />

        {requiresReauth && <ReAuthErrorDisplay />}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={createMutation.isPending || requiresReauth}
          >
            {createMutation.isPending ? "Creating..." : "Create Event"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}

