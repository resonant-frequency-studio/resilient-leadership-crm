"use client";

import { CalendarEvent, Contact } from "@/types/firestore";
import { useMemo, useState } from "react";
import { 
  useLinkEventToContact,
  useUnlinkEventFromContact, 
  useGenerateEventContext,
  useUpdateCalendarEvent,
  useDeleteCalendarEvent,
  UpdateEventInput
} from "@/hooks/useCalendarEvents";
import { useContactsRealtime } from "@/hooks/useContactsRealtime";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import ConflictResolutionModal, { ConflictData } from "./ConflictResolutionModal";
import EventModalHeader from "./EventModalHeader";
import EventNextActions from "./EventNextActions";
import LinkedContactCard from "./LinkedContactCard";
import EventMeetingInsights from "./EventMeetingInsights";
import EventDetailsSection from "./EventDetailsSection";
import EventAttendeesSection from "./EventAttendeesSection";
import EventJoinInfoSection from "./EventJoinInfoSection";
import CollapsibleSection from "./CollapsibleSection";
import EventEditForm from "./CalendarEventCard/EventEditForm";
import DeleteEventModal from "./CalendarEventCard/DeleteEventModal";
import UnlinkContactModal from "./CalendarEventCard/UnlinkContactModal";
import { getDate, isAllDayEvent } from "./utils/eventDateUtils";
import { parseDescription } from "./utils/descriptionParser";
import { extractJoinLinks } from "./utils/joinLinksExtractor";
import { useEventContactMatching } from "./hooks/useEventContactMatching";
import { reportException } from "@/lib/error-reporting";

interface CalendarEventCardProps {
  event: CalendarEvent;
  onClose: () => void;
  contacts?: Contact[]; // Optional - will fetch if not provided
}

export default function CalendarEventCard({ event: eventProp, onClose, contacts: providedContacts }: CalendarEventCardProps) {
  const { user } = useAuth();
  const router = useRouter();
  const linkMutation = useLinkEventToContact();
  const unlinkMutation = useUnlinkEventFromContact();
  const generateContextMutation = useGenerateEventContext();
  const updateMutation = useUpdateCalendarEvent();
  const deleteMutation = useDeleteCalendarEvent();

  // Use event prop directly - Firebase listeners will update it automatically
  const event = eventProp;
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false);
  const [showContactSearch, setShowContactSearch] = useState(false);
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [conflictData, setConflictData] = useState<ConflictData | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  
  // Fetch contacts if not provided
  const { contacts: fetchedContacts = [] } = useContactsRealtime(user?.uid || null);
  const contacts = providedContacts || fetchedContacts;
  
  // Date calculations
  const startTime = getDate(event.startTime);
  const endTime = getDate(event.endTime);
  const isAllDay = isAllDayEvent(startTime, endTime);

  // Edit form state - initialized after date calculations
  const [editForm, setEditForm] = useState<UpdateEventInput>({
    title: event.title,
    description: event.description || undefined,
    location: event.location || undefined,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    attendees: event.attendees?.map(a => a.email) || [],
    isAllDay: isAllDay,
  });
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Check if description is long (needs accordion) - removed duplicate, using one below

  // Parse description and extract join links
  const parsedDescription = useMemo(() => parseDescription(event.description), [event.description]);
  const joinLinks = useMemo(() => extractJoinLinks(event.description), [event.description]);

  // Contact matching
  const { contactSuggestions, linkedContact } = useEventContactMatching({
    event,
    contacts,
    userEmail: user?.email,
  });

  // Check if event is linked to a touchpoint
  const isLinkedToTouchpoint = useMemo(() => {
    if (!linkedContact) return false;
    return linkedContact.linkedGoogleEventId === event.eventId && 
           linkedContact.linkStatus === "linked";
  }, [linkedContact, event.eventId]);


  // Handlers for edit/delete
  const handleEdit = () => {
    setIsEditMode(true);
    setFormErrors({});
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setFormErrors({});
    // Reset form to original values
    setEditForm({
      title: event.title,
      description: event.description || undefined,
      location: event.location || undefined,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      attendees: event.attendees?.map(a => a.email) || [],
      isAllDay: isAllDay,
    });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!editForm.title || editForm.title.trim() === "") {
      errors.title = "Title is required";
    }
    
    if (!editForm.startTime) {
      errors.startTime = "Start time is required";
    }
    
    if (!editForm.endTime) {
      errors.endTime = "End time is required";
    }
    
    if (editForm.startTime && editForm.endTime) {
      const start = new Date(editForm.startTime);
      const end = new Date(editForm.endTime);
      if (start >= end) {
        errors.endTime = "End time must be after start time";
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await updateMutation.mutateAsync({
        eventId: event.eventId,
        updates: editForm,
      });
      setIsEditMode(false);
      setFormErrors({});
      setConflictData(null);
    } catch (error) {
      // Check if it's a conflict error
      const conflictError = error as Error & { conflict?: boolean; conflictData?: unknown };
      if (conflictError.conflict && conflictError.conflictData) {
        setConflictData(conflictError.conflictData as ConflictData);
        setShowConflictModal(true);
      }
    }
  };

  const handleResolveConflict = async (
    resolution: "keep-google" | "overwrite-google" | "merge",
    mergedData?: Partial<{
      title?: string;
      description?: string;
      location?: string;
      startTime?: string;
      endTime?: string;
      attendees?: string[];
    }>
  ) => {
    try {
      const response = await fetch(`/api/calendar/events/${event.eventId}/resolve-conflict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ resolution, mergedData }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to resolve conflict");
      }

      const data = await response.json();
      
      // Event will update automatically via Firebase listener

      // Close conflict modal and edit mode
      setShowConflictModal(false);
      setConflictData(null);
      setIsEditMode(false);
      setFormErrors({});

      // If overwrite-google, show message that user needs to edit again
      if (resolution === "overwrite-google" && data.message) {
        // Could show a toast notification here
      }
    } catch (error) {
      reportException(error, {
        context: "Resolving calendar event conflict",
        tags: { component: "CalendarEventCard", eventId: event.eventId },
      });
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(event.eventId);
      onClose(); // Close modal after successful delete
    } catch {
      // Error handling is done by the mutation hook
    }
  };


  // Handlers for next actions
  const handleCreateFollowUp = () => {
    if (linkedContact) {
      const eventDate = new Date(startTime);
      const dateStr = eventDate.toISOString().split('T')[0];
      router.push(`/contacts/${linkedContact.contactId}?touchpointDate=${dateStr}`);
      onClose();
    }
  };

  const handleDraftEmail = () => {
    if (linkedContact?.primaryEmail) {
      const subject = encodeURIComponent(`Follow-up: ${event.title}`);
      window.open(
        `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(linkedContact.primaryEmail)}&su=${subject}`,
        "_blank"
      );
    }
  };

  const handleViewContact = () => {
    if (linkedContact) {
      router.push(`/contacts/${linkedContact.contactId}`);
      onClose();
    }
  };

  // Check if description is long (needs collapsible)
  const isDescriptionLong = useMemo(() => {
    if (!event.description) return false;
    const textLength = event.description.replace(/<[^>]*>/g, "").length;
    return textLength > 240;
  }, [event.description]);

  return (
    <div className="w-full max-w-full overflow-hidden calendar-event-card flex flex-col">
      {/* 1. Header */}
      <EventModalHeader
        event={event}
        linkedContact={linkedContact}
        onClose={onClose}
        onEdit={handleEdit}
        onDelete={() => setShowDeleteConfirm(true)}
        conflictData={conflictData}
      />

      <div className="space-y-6 min-w-0 flex-1 overflow-y-auto">

        {/* Delete Confirmation */}
        {showDeleteConfirm ? (
          <DeleteEventModal
            eventTitle={event.title}
            onCancel={() => setShowDeleteConfirm(false)}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
          />
        ) : showUnlinkConfirm && linkedContact ? (
          <UnlinkContactModal
            linkedContact={linkedContact}
            onCancel={() => setShowUnlinkConfirm(false)}
            onUnlink={async () => {
              try {
                await unlinkMutation.mutateAsync(event.eventId);
                setShowUnlinkConfirm(false);
                // Firebase listener will update the event prop, which will trigger
                // contactSuggestions memo to recalculate and show suggestions
              } catch {
                // Error handling is done by the mutation hook
              }
            }}
            isUnlinking={unlinkMutation.isPending}
          />
        ) : isEditMode ? (
          <EventEditForm
            editForm={editForm}
            onFormChange={setEditForm}
            formErrors={formErrors}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            isSaving={updateMutation.isPending}
          />
        ) : (
          <>
            {/* 2. Next Actions Row */}
            <EventNextActions
              event={event}
              linkedContact={linkedContact}
              onCreateFollowUp={handleCreateFollowUp}
              onDraftEmail={handleDraftEmail}
              onAddActionItem={() => {
                if (linkedContact) {
                  router.push(`/contacts/${linkedContact.contactId}?actionItem=true`);
                }
              }}
              onViewContact={handleViewContact}
              followUpEmailDraft={generateContextMutation.data?.followUpEmailDraft || null}
            />

            {/* 3. Linked Contact Card */}
            <LinkedContactCard
              event={event}
              linkedContact={linkedContact}
              contactSuggestions={contactSuggestions}
              onLink={(contactId) => linkMutation.mutate({ eventId: event.eventId, contactId })}
              onUnlink={() => setShowUnlinkConfirm(true)}
              onViewContact={handleViewContact}
              contacts={contacts}
              showContactSearch={showContactSearch}
              contactSearchQuery={contactSearchQuery}
              onToggleSearch={() => setShowContactSearch(!showContactSearch)}
              onSearchQueryChange={setContactSearchQuery}
              isLinking={linkMutation.isPending}
              isLinkedToTouchpoint={isLinkedToTouchpoint}
            />

            {/* 4. Meeting Insights (renamed from AI Context) */}
            <EventMeetingInsights
              event={event}
              linkedContact={linkedContact}
              storedInsights={event.meetingInsights || null}
              aiContext={generateContextMutation.data || null}
              isGenerating={generateContextMutation.isPending}
              error={generateContextMutation.error as Error | null}
              onGenerate={(regenerate) => generateContextMutation.mutate({ eventId: event.eventId, regenerate })}
              onClose={onClose}
            />

            {/* 5. Meeting Details */}
            <EventDetailsSection
              event={event}
              startTime={startTime}
              endTime={endTime}
            />

            {/* 6. Description (collapsible if >240 chars) */}
          {event.description && (
              <CollapsibleSection
                title="Description"
                defaultExpanded={!isDescriptionLong}
                icon={
                  <svg
                    className="w-5 h-5 text-theme-medium"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
                }
              >
                <div>
                {parsedDescription && typeof parsedDescription === 'object' && '__html' in parsedDescription ? (
                  <div
                    className="text-theme-darkest whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere word-break-break-word prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={parsedDescription}
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'anywhere',
                    }}
                  />
                ) : parsedDescription ? (
                  <p className="text-theme-darkest whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere word-break-break-word">
                    {Array.isArray(parsedDescription) ? (
                      parsedDescription.map((part, index) => (
                        <span key={index}>{part}</span>
                      ))
                    ) : (
                      parsedDescription
                    )}
                  </p>
                ) : null}
              </div>
              </CollapsibleSection>
          )}

            {/* 7. Attendees (collapsible if >2) */}
          {event.attendees && event.attendees.length > 0 && (
              <EventAttendeesSection
                attendees={event.attendees}
                defaultExpanded={event.attendees.length <= 2}
              />
            )}

            {/* 8. Join Info (always collapsed, last) */}
          {joinLinks.length > 0 && (
              <EventJoinInfoSection
                joinLinks={joinLinks}
                defaultExpanded={false}
              />
            )}
          </>
        )}

          </div>

      {/* Conflict Resolution Modal */}
      {conflictData && (
        <ConflictResolutionModal
          isOpen={showConflictModal}
          onClose={() => {
            setShowConflictModal(false);
            setConflictData(null);
          }}
          conflictData={conflictData}
          onResolve={handleResolveConflict}
        />
      )}
    </div>
  );
}

