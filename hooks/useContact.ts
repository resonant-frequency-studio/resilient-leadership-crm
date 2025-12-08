"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Contact } from "@/types/firestore";

/**
 * Hook to fetch a single contact for a user
 * Automatically checks contacts list cache for initial data to avoid loading skeleton
 */
export function useContact(userId: string, contactId: string, initialData?: Contact) {
  const queryClient = useQueryClient();

  // Check for initial data from server prefetch, cache, or contacts list cache
  const getInitialData = () => {
    if (initialData) return initialData;
    // Check if contact is in cache
    const cachedContact = queryClient.getQueryData<Contact>(["contact", userId, contactId]);
    if (cachedContact) return cachedContact;
    // Check if contact is in contacts list cache
    const contacts = queryClient.getQueryData<Contact[]>(["contacts", userId]);
    if (contacts) {
      return contacts.find((c) => c.contactId === contactId) || undefined;
    }
    return undefined;
  };

  const resolvedInitialData = getInitialData();

  return useQuery({
    queryKey: ["contact", userId, contactId],
    queryFn: async () => {
      const response = await fetch(`/api/contacts/${encodeURIComponent(contactId)}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch contact");
      }
      const data = await response.json();
      return data.contact as Contact;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId && !!contactId,
    initialData: resolvedInitialData,
    // Use contacts list cache as placeholder data to avoid loading state
    placeholderData: () => {
      const contacts = queryClient.getQueryData<Contact[]>(["contacts", userId]);
      if (contacts) {
        return contacts.find((c) => c.contactId === contactId) || undefined;
      }
      return undefined;
    },
    // Don't refetch if we have cached data
    refetchOnMount: !resolvedInitialData,
    refetchOnWindowFocus: false,
  });
}

