"use client";

import { useContact } from "@/hooks/useContact";
import BasicInfoCard from "./contact-cards/BasicInfoCard";
import TagsClassificationCard from "./contact-cards/TagsClassificationCard";
import ActionItemsCard from "./contact-cards/ActionItemsCard";
import NotesCard from "./contact-cards/NotesCard";
import NextTouchpointCard from "./contact-cards/NextTouchpointCard";
import OutreachDraftCard from "./contact-cards/OutreachDraftCard";
import ContactInsightsCard from "./contact-cards/ContactInsightsCard";
import ActivityCard from "./contact-cards/ActivityCard";
import ArchiveContactCard from "./contact-cards/ArchiveContactCard";
import DeleteContactCard from "./contact-cards/DeleteContactCard";

interface ContactEditorProps {
  contactDocumentId: string;
  userId: string;
  // Pre-fetched data (for SSR)
  initialActionItems?: import("@/types/firestore").ActionItem[];
  initialContact?: import("@/types/firestore").Contact;
  uniqueSegments?: string[];
}

export default function ContactEditor({
  contactDocumentId,
  userId,
  initialActionItems,
  initialContact,
  uniqueSegments = [],
}: ContactEditorProps) {
  // Read contact directly from React Query cache for optimistic updates
  const { data: contact } = useContact(userId, contactDocumentId);

  // Show loading state if contact is not available
  if (!contact && !initialContact) {
    return (
      <div className="space-y-6">
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <BasicInfoCard contactId={contactDocumentId} userId={userId} />
          <TagsClassificationCard
            contactId={contactDocumentId}
            userId={userId}
            uniqueSegments={uniqueSegments}
          />
          <ActionItemsCard
            contactId={contactDocumentId}
            userId={userId}
            initialActionItems={initialActionItems}
            initialContact={contact || undefined}
          />
          <NextTouchpointCard contactId={contactDocumentId} userId={userId} />
          <OutreachDraftCard contactId={contactDocumentId} userId={userId} />
          <NotesCard contactId={contactDocumentId} userId={userId} />
        </div>

        {/* Sidebar - Right Column (1/3) */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <ContactInsightsCard
            contactId={contactDocumentId}
            userId={userId}
            initialContact={initialContact}
          />
          <ActivityCard contactId={contactDocumentId} userId={userId} />
          <ArchiveContactCard contactId={contactDocumentId} userId={userId} />
          <DeleteContactCard contactId={contactDocumentId} />
        </div>
      </div>
    </div>
  );
}
