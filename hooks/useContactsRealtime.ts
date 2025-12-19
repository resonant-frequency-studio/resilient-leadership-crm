"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase-client";
import { Contact } from "@/types/firestore";
import { reportException } from "@/lib/error-reporting";

interface UseContactsRealtimeReturn {
  contacts: Contact[];
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch all contacts for a user using Firebase real-time listener
 * Updates automatically when contacts change in Firestore
 */
export function useContactsRealtime(userId: string | null): UseContactsRealtimeReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      // Defer setState to avoid cascading renders
      queueMicrotask(() => {
        setLoading(false);
        setContacts([]);
      });
      return;
    }

    let isMounted = true;

    try {
      const contactsRef = collection(db, `users/${userId}/contacts`);

      const unsubscribe = onSnapshot(
        contactsRef,
        (snapshot) => {
          if (!isMounted) return;

          const contactsData = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              ...data,
              contactId: doc.id,
            } as Contact;
          });

          setContacts(contactsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          if (!isMounted) return;

          reportException(err, {
            context: "Fetching contacts (real-time)",
            tags: { component: "useContactsRealtime", userId },
          });

          setError(err);
          setLoading(false);
        }
      );

      return () => {
        isMounted = false;
        unsubscribe();
      };
    } catch (err) {
      if (!isMounted) return;

      const error = err instanceof Error ? err : new Error(String(err));
      reportException(error, {
        context: "Setting up contacts listener",
        tags: { component: "useContactsRealtime", userId },
      });

      // Defer setState to avoid cascading renders
      queueMicrotask(() => {
        if (isMounted) {
          setError(error);
          setLoading(false);
        }
      });
    }
  }, [userId]);

  return { contacts, loading, error };
}

