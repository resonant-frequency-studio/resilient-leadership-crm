"use client";

import { useActionItems } from "@/hooks/useActionItems";
import { useAuth } from "@/hooks/useAuth";
import { useContacts } from "@/hooks/useContacts";
import { getInitials, getDisplayName } from "@/util/contact-utils";
import { computeIsOverdue, getDateCategory } from "@/util/date-utils-server";
import { ActionItem, Contact } from "@/types/firestore";
import ActionItemsPageClient from "../ActionItemsPageClient";
import EmptyState from "@/components/dashboard/EmptyState";

interface EnrichedActionItem extends ActionItem {
  contactId: string;
  contactName: string;
  contactEmail?: string;
  contactFirstName?: string;
  contactLastName?: string;
  displayName: string | null;
  initials: string;
  isOverdue: boolean;
  dateCategory: "overdue" | "today" | "thisWeek" | "upcoming";
}

type ActionItemWithContactFields = ActionItem & {
  contactId: string;
  contactFirstName?: string | null;
  contactLastName?: string | null;
  contactEmail?: string;
};

export default function ActionItemsPageClientWrapper({ userId }: { userId: string }) {
  const { user, loading: authLoading } = useAuth();
  // Use userId prop if provided (from SSR), otherwise get from client auth (for E2E mode or if SSR didn't have it)
  // In production, userId prop should always be provided from SSR
  // In E2E mode, it might be empty, so we wait for auth to load and use user?.uid
  const effectiveUserId = userId || (authLoading ? "" : user?.uid || "");
  // React Query automatically uses prefetched data from HydrationBoundary
  const { data: actionItems = [] } = useActionItems(effectiveUserId);
  const { data: contacts = [] } = useContacts(effectiveUserId);
  
  // Show empty state if no contacts
  if (contacts.length === 0) {
    return <EmptyState wrapInCard={true} size="lg" />;
  }

  // Use consistent server time for all calculations
  const serverTime = new Date();

  // Pre-compute all derived values using enriched contact data from action items
  const enrichedItems: EnrichedActionItem[] = (actionItems as ActionItemWithContactFields[]).map((item) => {
    // Create contact object for utility functions using enriched data
    const contactForUtils: Contact = {
      contactId: item.contactId,
      firstName: item.contactFirstName || null,
      lastName: item.contactLastName || null,
      company: null,
      primaryEmail: item.contactEmail || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const displayName = getDisplayName(contactForUtils);
    const contactName = displayName || item.contactEmail || "";
    const initials = getInitials(contactForUtils);
    const isOverdue = computeIsOverdue(item, serverTime);
    const dateCategory = getDateCategory(item.dueDate, serverTime);

    return {
      ...item,
      contactName,
      contactEmail: item.contactEmail,
      contactFirstName: item.contactFirstName || undefined,
      contactLastName: item.contactLastName || undefined,
      displayName,
      initials,
      isOverdue,
      dateCategory,
    };
  });

  // Extract unique contact IDs for filters
  const uniqueContactIds = Array.from(
    new Set(enrichedItems.map((i) => i.contactId))
  );

  // Create contacts array for filters (minimal data needed)
  const contactsArray: Array<[string, Contact]> = uniqueContactIds.map((contactId) => {
    const item = enrichedItems.find((i) => i.contactId === contactId);
    return [
      contactId,
      {
        contactId,
        primaryEmail: item?.contactEmail || "",
        firstName: item?.contactFirstName || null,
        lastName: item?.contactLastName || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Contact,
    ];
  });

  return (
    <ActionItemsPageClient
      initialActionItems={enrichedItems}
      contacts={contactsArray}
    />
  );
}

