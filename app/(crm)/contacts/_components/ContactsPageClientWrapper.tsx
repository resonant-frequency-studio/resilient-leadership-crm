"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import ContactsPageClient from "../ContactsPageClient";

export default function ContactsPageClientWrapper({ userId }: { userId: string }) {
  const { user, loading: authLoading } = useAuth();
  // Determine effective userId with stable cache key:
  // 1. If userId prop is provided and non-empty (from SSR), use it immediately
  // 2. If userId is empty/missing, wait for auth to finish loading, then use user?.uid
  //    (Don't use empty string as cache key - it will change when auth loads)
  // This ensures cache keys don't change mid-render
  const effectiveUserId = useMemo(() => {
    // If SSR provided a userId, use it (even if empty string - that's intentional)
    if (userId && userId.trim() !== "") {
      return userId;
    }
    // If no userId from SSR, wait for auth to load, then use user?.uid
    // Don't use empty string as intermediate value - it causes cache key changes
    if (authLoading) {
      // Still loading - return empty string temporarily (query will be disabled)
      return "";
    }
    // Auth loaded - use user?.uid or empty string if no user
    return user?.uid || "";
  }, [userId, authLoading, user?.uid]);

  // Pass userId directly - child component handles all data fetching
  // This ensures consistent cache keys and avoids stale initialContacts
  // useContacts hook will be disabled if userId is empty (enabled: !!userId)
  return <ContactsPageClient userId={effectiveUserId} />;
}

