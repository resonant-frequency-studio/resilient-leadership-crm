import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { extractErrorMessage } from "@/components/ErrorMessage";
import { reportException } from "@/lib/error-reporting";

interface UseSyncHandlersParams {
  userId: string;
  effectiveUserId: string;
}

interface UseSyncHandlersReturn {
  // Gmail sync
  syncing: boolean;
  syncError: string | null;
  setSyncError: (error: string | null) => void;
  handleManualSync: () => Promise<void>;
  
  // Calendar sync
  syncingCalendar: boolean;
  calendarSyncError: string | null;
  calendarSyncSuccess: string | null;
  setSyncingCalendar: (value: boolean) => void;
  setCalendarSyncError: (error: string | null) => void;
  setCalendarSyncSuccess: (message: string | null) => void;
  handleCalendarSync: () => Promise<void>;
  
  // Contacts sync
  syncingContacts: boolean;
  contactsSyncError: string | null;
  setSyncingContacts: (value: boolean) => void;
  setContactsSyncError: (error: string | null) => void;
  handleContactsSync: () => Promise<string | null>; // Returns syncJobId or null
}

export function useSyncHandlers({
  userId,
  effectiveUserId,
}: UseSyncHandlersParams): UseSyncHandlersReturn {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncingCalendar, setSyncingCalendar] = useState(false);
  const [calendarSyncError, setCalendarSyncError] = useState<string | null>(null);
  const [calendarSyncSuccess, setCalendarSyncSuccess] = useState<string | null>(null);
  const [syncingContacts, setSyncingContacts] = useState(false);
  const [contactsSyncError, setContactsSyncError] = useState<string | null>(null);

  const handleManualSync = async () => {
    setSyncing(true);
    setSyncError(null);

    try {
      const response = await fetch("/api/gmail/sync?type=auto");
      
      if (!response.ok) {
        let errorMessage = `Sync failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        const text = await response.text();
        if (!text || text.trim() === "") {
          throw new Error("Empty response from server");
        }
        data = JSON.parse(text);
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw new Error("Invalid response from server. Please try again.");
        }
        throw parseError;
      }

      if (!data.ok) {
        const errorMessage = data.error || "Sync failed";
        throw new Error(errorMessage);
      }

      setSyncError(null);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setSyncError(errorMessage);
      reportException(error, {
        context: "Manual sync error",
        tags: { component: "SyncPageClient" },
      });
    } finally {
      setSyncing(false);
    }
  };

  const handleCalendarSync = async () => {
    setSyncingCalendar(true);
    setCalendarSyncError(null);
    setCalendarSyncSuccess(null);
    
    try {
      const response = await fetch('/api/calendar/sync', { 
        method: 'POST',
        credentials: 'include',
      });
      const data = await response.json();
      
      if (!data.ok) {
        setCalendarSyncError(data.error || 'Failed to sync calendar');
      } else {
        if (data.webhookSubscribed) {
          setCalendarSyncSuccess('Calendar sync completed and automatic real-time sync has been enabled!');
          queryClient.invalidateQueries({ queryKey: ["calendar-subscription-status", effectiveUserId] });
        } else {
          setCalendarSyncSuccess(`Calendar sync completed successfully. ${data.synced || 0} events synced.`);
        }
        setTimeout(() => setCalendarSyncSuccess(null), 5000);
      }
    } catch (err) {
      setCalendarSyncError(err instanceof Error ? err.message : 'Failed to sync calendar');
    } finally {
      setSyncingCalendar(false);
    }
  };

  const handleContactsSync = async (): Promise<string | null> => {
    setSyncingContacts(true);
    setContactsSyncError(null);

    try {
      const response = await fetch("/api/contacts/sync");

      if (!response.ok) {
        let errorMessage = `Import failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        const text = await response.text();
        if (!text || text.trim() === "") {
          throw new Error("Empty response from server");
        }
        data = JSON.parse(text);
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw new Error("Invalid response from server. Please try again.");
        }
        throw parseError;
      }

      if (!data.ok) {
        const errorMessage = data.error || "Import failed";
        throw new Error(errorMessage);
      }

      setSyncingContacts(false);
      return data.syncJobId || null;
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setContactsSyncError(errorMessage);
      reportException(error, {
        context: "Manual contacts import error",
        tags: { component: "SyncPageClient" },
      });
      setSyncingContacts(false);
      return null;
    }
  };

  return {
    syncing,
    syncError,
    setSyncError,
    handleManualSync,
    syncingCalendar,
    calendarSyncError,
    calendarSyncSuccess,
    setSyncingCalendar,
    setCalendarSyncError,
    setCalendarSyncSuccess,
    handleCalendarSync,
    syncingContacts,
    contactsSyncError,
    setSyncingContacts,
    setContactsSyncError,
    handleContactsSync,
  };
}

