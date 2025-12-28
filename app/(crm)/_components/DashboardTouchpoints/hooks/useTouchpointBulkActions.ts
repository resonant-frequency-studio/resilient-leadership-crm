import { useState, useCallback } from "react";
import { useUpdateTouchpointStatus } from "@/hooks/useContactMutations";
import { reportException } from "@/lib/error-reporting";

interface UseTouchpointBulkActionsParams {
  userId: string | undefined;
}

interface UseTouchpointBulkActionsReturn {
  selectedTouchpointIds: Set<string>;
  toggleTouchpointSelection: (contactId: string) => void;
  handleBulkStatusUpdate: (status: "completed" | "cancelled") => Promise<void>;
  bulkUpdating: boolean;
  clearSelection: () => void;
}

export function useTouchpointBulkActions({
  userId,
}: UseTouchpointBulkActionsParams): UseTouchpointBulkActionsReturn {
  const [selectedTouchpointIds, setSelectedTouchpointIds] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);
  const updateTouchpointStatusMutation = useUpdateTouchpointStatus(userId);

  const toggleTouchpointSelection = useCallback((contactId: string) => {
    setSelectedTouchpointIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  }, []);

  const handleBulkStatusUpdate = useCallback(
    async (status: "completed" | "cancelled") => {
      if (selectedTouchpointIds.size === 0) return;

      const selectedIds = Array.from(selectedTouchpointIds);
      setBulkUpdating(true);

      try {
        const updates = selectedIds.map((contactId) =>
          updateTouchpointStatusMutation.mutateAsync({
            contactId,
            status,
          })
        );

        const results = await Promise.allSettled(updates);
        const failures = results.filter((r) => r.status === "rejected");
        const failureCount = failures.length;
        const successCount = selectedIds.length - failureCount;

        // Report all failures to Sentry
        failures.forEach((result, index) => {
          if (result.status === "rejected") {
            reportException(result.reason, {
              context: "Bulk updating touchpoint status in DashboardTouchpoints",
              tags: {
                component: "DashboardTouchpoints",
                contactId: selectedIds[index],
                status,
              },
            });
          }
        });

        setSelectedTouchpointIds(new Set());

        if (failureCount > 0) {
          alert(
            `Updated ${successCount} of ${selectedIds.length} touchpoints. Some updates failed.`
          );
        }
      } catch (error) {
        reportException(error, {
          context: "Bulk updating touchpoint status in DashboardTouchpoints",
          tags: { component: "DashboardTouchpoints", status },
        });
        alert("Failed to update touchpoints. Please try again.");
      } finally {
        setBulkUpdating(false);
      }
    },
    [selectedTouchpointIds, updateTouchpointStatusMutation]
  );

  const clearSelection = useCallback(() => {
    setSelectedTouchpointIds(new Set());
  }, []);

  return {
    selectedTouchpointIds,
    toggleTouchpointSelection,
    handleBulkStatusUpdate,
    bulkUpdating,
    clearSelection,
  };
}

