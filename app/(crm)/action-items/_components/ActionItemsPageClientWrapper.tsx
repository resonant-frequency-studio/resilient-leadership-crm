"use client";

import { useActionItems } from "@/hooks/useActionItems";
import { useContacts } from "@/hooks/useContacts";
import { useAuth } from "@/hooks/useAuth";
import { getInitials, getDisplayName } from "@/util/contact-utils";
import { computeIsOverdue, getDateCategory } from "@/util/date-utils-server";
import { ActionItem, Contact } from "@/types/firestore";
import ActionItemsPageClient from "../ActionItemsPageClient";

interface EnrichedActionItem extends ActionItem {
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactFirstName?: string;
  contactLastName?: string;
  displayName: string | null; // null when contact not found (show skeleton)
  initials: string;
  isOverdue: boolean;
  dateCategory: "overdue" | "today" | "thisWeek" | "upcoming";
  contactLoading?: boolean; // true when contacts are still loading
}

export default function ActionItemsPageClientWrapper({ userId }: { userId: string }) {
  const { user, loading: authLoading } = useAuth();
  // Use userId prop if provided (from SSR), otherwise get from client auth (for E2E mode or if SSR didn't have it)
  // In production, userId prop should always be provided from SSR
  // In E2E mode, it might be empty, so we wait for auth to load and use user?.uid
  const effectiveUserId = userId || (authLoading ? "" : user?.uid || "");
  // React Query automatically uses prefetched data from HydrationBoundary
  const { data: actionItems = [] } = useActionItems(effectiveUserId);
  const { data: contacts = [], isLoading: contactsLoading } = useContacts(effectiveUserId);

  // Convert contacts array to Map for efficient lookup
  const contactsMap = new Map<string, Contact>();
  contacts.forEach((contact) => {
    contactsMap.set(contact.contactId, contact);
  });

  // Use consistent server time for all calculations
  const serverTime = new Date();

  // Pre-compute all derived values
  const enrichedItems: EnrichedActionItem[] = actionItems.map((item) => {
    const contact = contactsMap.get(item.contactId);
    
    // Create contact object for utility functions
    const contactForUtils: Contact = {
      contactId: item.contactId,
      firstName: contact?.firstName,
      lastName: contact?.lastName,
      company: contact?.company,
      primaryEmail: contact?.primaryEmail || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // If contact not found, set displayName to null (will show skeleton)
    // Only show skeleton if contacts are still loading
    const displayName = contact ? getDisplayName(contactForUtils) : null;
    const contactName = displayName || "";
    const initials = contact ? getInitials(contactForUtils) : "";
    const isOverdue = computeIsOverdue(item, serverTime);
    const dateCategory = getDateCategory(item.dueDate, serverTime);

    return {
      ...item,
      contactName,
      contactEmail: contact?.primaryEmail,
      contactFirstName: contact?.firstName || undefined,
      contactLastName: contact?.lastName || undefined,
      displayName,
      initials,
      isOverdue,
      dateCategory,
      contactLoading: contactsLoading && !contact, // Show skeleton if loading and contact not found
    };
  });

  // Convert contacts Map to array for serialization
  const contactsArray: Array<[string, Contact]> = Array.from(contactsMap.entries());

  return (
    <ActionItemsPageClient
      initialActionItems={enrichedItems}
      contacts={contactsArray}
    />
  );
}

