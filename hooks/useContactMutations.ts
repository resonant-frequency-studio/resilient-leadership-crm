"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportException } from "@/lib/error-reporting";

/**
 * Mutation hook to archive/unarchive a contact
 */
export function useArchiveContact(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactId,
      archived,
    }: {
      contactId: string;
      archived: boolean;
    }) => {
      const response = await fetch(`/api/contacts/${encodeURIComponent(contactId)}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ archived }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to archive contact");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate contacts list and specific contact
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["contacts", userId] });
        queryClient.invalidateQueries({ queryKey: ["contact", userId, variables.contactId] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats", userId] });
      } else {
        // Fallback: invalidate all if userId not provided
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        queryClient.invalidateQueries({ queryKey: ["contact"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      }
    },
    onError: (error) => {
      reportException(error, {
        context: "Archiving contact",
        tags: { component: "useArchiveContact" },
      });
    },
  });
}

/**
 * Mutation hook to update touchpoint status
 */
export function useUpdateTouchpointStatus(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactId,
      status,
      reason,
    }: {
      contactId: string;
      status: "pending" | "completed" | "cancelled" | null;
      reason?: string | null;
    }) => {
      const response = await fetch(
        `/api/contacts/${encodeURIComponent(contactId)}/touchpoint-status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status, reason }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to update touchpoint status");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate contacts and dashboard stats (touchpoints affect dashboard)
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["contacts", userId] });
        queryClient.invalidateQueries({ queryKey: ["contact", userId, variables.contactId] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats", userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        queryClient.invalidateQueries({ queryKey: ["contact"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      }
    },
    onError: (error) => {
      reportException(error, {
        context: "Updating touchpoint status",
        tags: { component: "useUpdateTouchpointStatus" },
      });
    },
  });
}

/**
 * Mutation hook for bulk archiving contacts
 */
export function useBulkArchiveContacts(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contactIds,
      archived,
    }: {
      contactIds: string[];
      archived: boolean;
    }) => {
      const response = await fetch("/api/contacts/bulk-archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactIds, archived }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to bulk archive contacts");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate all contacts queries
      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["contacts", userId] });
        // Invalidate individual contact queries
        variables.contactIds.forEach((contactId) => {
          queryClient.invalidateQueries({ queryKey: ["contact", userId, contactId] });
        });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats", userId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["contacts"] });
        queryClient.invalidateQueries({ queryKey: ["contact"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      }
    },
    onError: (error) => {
      reportException(error, {
        context: "Bulk archiving contacts",
        tags: { component: "useBulkArchiveContacts" },
      });
    },
  });
}

