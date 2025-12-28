import { useState, useEffect, useRef } from "react";
import { Contact } from "@/types/firestore";
import { useUpdateTouchpointStatus } from "@/hooks/useContactMutations";
import { useContact } from "@/hooks/useContact";
import { extractErrorMessage } from "@/components/ErrorMessage";
import { reportException } from "@/lib/error-reporting";

interface UseTouchpointStatusUpdateParams {
  contactId: string;
  userId: string;
  fallbackStatus?: Contact["touchpointStatus"];
  onStatusUpdate?: () => void;
}

interface UseTouchpointStatusUpdateReturn {
  currentStatus: Contact["touchpointStatus"];
  mutation: ReturnType<typeof useUpdateTouchpointStatus>;
  error: string | null;
  setError: (error: string | null) => void;
  handleUpdateStatus: (status: "completed" | "cancelled" | null, reason?: string) => Promise<void>;
}

export function useTouchpointStatusUpdate({
  contactId,
  userId,
  fallbackStatus,
  onStatusUpdate,
}: UseTouchpointStatusUpdateParams): UseTouchpointStatusUpdateReturn {
  const { data: contact } = useContact(userId, contactId);
  const prevContactIdRef = useRef<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<Contact["touchpointStatus"]>(
    contact?.touchpointStatus ?? fallbackStatus ?? null
  );
  const [error, setError] = useState<string | null>(null);
  const mutation = useUpdateTouchpointStatus(userId);

  // Reset state ONLY when contactId changes (switching to a different contact)
  useEffect(() => {
    if (!contact && !fallbackStatus) return;

    // Only update if we're switching to a different contact
    if (prevContactIdRef.current !== contactId) {
      prevContactIdRef.current = contactId;
      const statusToUse = contact?.touchpointStatus ?? fallbackStatus ?? null;
      setCurrentStatus(statusToUse);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactId, fallbackStatus]);

  const handleUpdateStatus = async (status: "completed" | "cancelled" | null, reason?: string) => {
    setError(null);
    setCurrentStatus(status);
    
    return new Promise<void>((resolve, reject) => {
      mutation.mutate(
        {
          contactId,
          status,
          reason: reason || null,
        },
        {
          onSuccess: () => {
            onStatusUpdate?.();
            resolve();
          },
          onError: (error) => {
            reportException(error, {
              context: "Updating touchpoint status in TouchpointStatusActions",
              tags: { component: "TouchpointStatusActions", contactId },
            });
            setError(extractErrorMessage(error));
            reject(error);
          },
        }
      );
    });
  };

  return {
    currentStatus,
    mutation,
    error,
    setError,
    handleUpdateStatus,
  };
}

