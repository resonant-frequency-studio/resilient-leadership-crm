"use client";

import { notFound } from "next/navigation";
import { useContact } from "@/hooks/useContact";
import { useActionItems } from "@/hooks/useActionItems";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect, useRef } from "react";
import { convertTimestampToISO } from "@/util/timestamp-utils-server";
import ContactDetailPageClient from "../ContactDetailPageClient";
import { ActionItem } from "@/types/firestore";

interface ContactDetailPageClientWrapperProps {
  contactId: string;
  userId: string;
}

export default function ContactDetailPageClientWrapper({
  contactId,
  userId,
}: ContactDetailPageClientWrapperProps) {
  const { user, loading: authLoading } = useAuth();
  // Use userId prop if provided (from SSR), otherwise get from client auth (for E2E mode or if SSR didn't have it)
  // In production, userId prop should always be provided from SSR
  // In E2E mode, it might be empty, so we wait for auth to load and use user?.uid
  // Memoize to prevent infinite loops from changing query keys
  const effectiveUserId = useMemo(() => {
    return userId || (authLoading ? "" : user?.uid || "");
  }, [userId, authLoading, user?.uid]);
  // React Query automatically uses prefetched data from HydrationBoundary
  const { data: contact, isLoading: contactLoading, isFetching: contactFetching, isFetched: contactFetched } = useContact(effectiveUserId, contactId);
  const { data: actionItems = [] } = useActionItems(effectiveUserId, contactId);
  const { data: uniqueSegments = [] } = useQuery({
    queryKey: ["unique-segments", effectiveUserId],
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
    enabled: !!effectiveUserId, // Only run when we have a userId
    staleTime: 5 * 60 * 1000,
  });

  // Wait for auth to load and query to complete before calling notFound
  // In Playwright mode, auth might still be loading, so we should wait for it
  // Also, if the query is still loading/fetching, we shouldn't call notFound yet
  // This prevents calling notFound() before React Query hydration completes
  // CRITICAL: Only call notFound if the query has been fetched at least once
  // If contactFetched is false, the query hasn't run yet and placeholderData might not be available
  // Also wait if we don't have a userId yet (query will be disabled until we have one)
  // Memoize these calculations to prevent infinite loops
  const queryEnabled = useMemo(() => !!effectiveUserId && !!contactId, [effectiveUserId, contactId]);
  
  // Determine if we should wait for data to load
  // Once we have fetched data at least once (contactFetched), we can proceed even if refetching
  // This prevents infinite loops from refetching queries
  const shouldWait = useMemo(() => {
    // Wait if auth is still loading
    if (authLoading) return true;
    // Wait if we don't have a userId yet
    if (!effectiveUserId) return true;
    // Wait if query is not enabled
    if (!queryEnabled) return true;
    // Wait if query hasn't been fetched at least once
    if (!contactFetched) return true;
    // Wait if query is loading (initial load)
    if (contactLoading) return true;
    // Don't wait if we're just refetching (contactFetching but contactFetched is true)
    // This prevents loops from background refetches
    return false;
  }, [authLoading, effectiveUserId, queryEnabled, contactLoading, contactFetched]);
  
  // Only call notFound if ALL of these are true:
  // 1. Auth has loaded (!authLoading)
  // 2. We have a userId (effectiveUserId is truthy)
  // 3. Query is enabled (has userId and contactId)
  // 4. Query has been fetched at least once (contactFetched === true)
  // 5. Query is not loading/fetching (query has completed)
  // 6. Contact is explicitly null (not undefined - null means 404, undefined means not fetched yet)
  // Note: We check contact === null (not !contact) because undefined means query hasn't run yet
  // but null means query ran and returned 404
  // Use useEffect with a ref to ensure notFound() is only called once
  const notFoundCalledRef = useRef(false);
  useEffect(() => {
    if (
      !notFoundCalledRef.current &&
      contact === null &&
      !authLoading &&
      effectiveUserId &&
      queryEnabled &&
      contactFetched &&
      !contactLoading &&
      !contactFetching
    ) {
      notFoundCalledRef.current = true;
      notFound();
    }
  }, [contact, authLoading, effectiveUserId, queryEnabled, contactFetched, contactLoading, contactFetching]);
  
  // Action items are already converted to ISO strings on the server
  // This is just a safety check in case any timestamps slipped through
  // Memoize to prevent infinite loops from changing object references
  // CRITICAL: This hook must be called BEFORE any conditional returns to follow Rules of Hooks
  const serializedActionItems: ActionItem[] = useMemo(() => {
    return actionItems.map((item) => ({
      ...item,
      dueDate: convertTimestampToISO(item.dueDate),
      completedAt: convertTimestampToISO(item.completedAt),
      createdAt: convertTimestampToISO(item.createdAt) || new Date().toISOString(),
      updatedAt: convertTimestampToISO(item.updatedAt) || new Date().toISOString(),
    }));
  }, [actionItems]);

  // If auth is still loading or query is still fetching, show loading state
  // Don't return null - return a loading placeholder to prevent unmounting
  // IMPORTANT: All hooks must be called before this conditional return
  if (shouldWait) {
    // Return a minimal loading state instead of null to prevent unmounting
    return <div style={{ display: 'none' }} />;
  }

  return (
    <ContactDetailPageClient
      contactDocumentId={contactId}
      userId={userId}
      initialActionItems={serializedActionItems}
      uniqueSegments={uniqueSegments}
    />
  );
}

