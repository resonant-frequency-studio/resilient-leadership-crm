"use client";

import { notFound } from "next/navigation";
import { useContact } from "@/hooks/useContact";
import { useActionItems } from "@/hooks/useActionItems";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { convertTimestampToISO } from "@/util/timestamp-utils-server";
import ContactDetailPageClient from "../ContactDetailPageClient";
import { ActionItem, Contact } from "@/types/firestore";

interface ContactDetailPageClientWrapperProps {
  contactId: string;
  userId: string;
}

export default function ContactDetailPageClientWrapper({
  contactId,
  userId,
}: ContactDetailPageClientWrapperProps) {
  const queryClient = useQueryClient();
  
  // Get prefetched data from React Query cache (from server prefetch)
  const prefetchedContact = queryClient.getQueryData<Contact>(["contact", userId, contactId]);
  const prefetchedActionItems = queryClient.getQueryData<ActionItem[]>(["action-items", userId, contactId]);
  
  const { data: contact } = useContact(userId, contactId, prefetchedContact);
  const { data: actionItems = prefetchedActionItems || [] } = useActionItems(
    userId,
    contactId,
    prefetchedActionItems
  );
  const { data: uniqueSegments = [] } = useQuery({
    queryKey: ["unique-segments", userId],
    queryFn: async () => {
      // For now, we'll fetch all contacts and extract unique segments
      // TODO: Create an API route for this if needed
      const response = await fetch("/api/contacts");
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      const contacts = data.contacts || [];
      const segments = new Set<string>();
      contacts.forEach((contact: { segment?: string | null }) => {
        if (contact.segment?.trim()) {
          segments.add(contact.segment.trim());
        }
      });
      return Array.from(segments).sort();
    },
    staleTime: 5 * 60 * 1000,
  });

  if (!contact) {
    notFound();
  }

  // Convert Firestore Timestamps to ISO strings for serialization
  const serializedActionItems: ActionItem[] = actionItems.map((item) => ({
    ...item,
    dueDate: convertTimestampToISO(item.dueDate),
    completedAt: convertTimestampToISO(item.completedAt),
    createdAt: convertTimestampToISO(item.createdAt) || new Date().toISOString(),
    updatedAt: convertTimestampToISO(item.updatedAt) || new Date().toISOString(),
  }));

  return (
    <ContactDetailPageClient
      contact={contact}
      contactDocumentId={contactId}
      userId={userId}
      initialActionItems={serializedActionItems}
      uniqueSegments={uniqueSegments}
    />
  );
}

