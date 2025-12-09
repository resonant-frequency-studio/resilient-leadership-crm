"use client";

import { useState } from "react";
import { useContact } from "@/hooks/useContact";
import { useArchiveContact } from "@/hooks/useContactMutations";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { ErrorMessage, extractErrorMessage } from "@/components/ErrorMessage";
import { reportException } from "@/lib/error-reporting";

interface ArchiveContactCardProps {
  contactId: string;
  userId: string;
}

export default function ArchiveContactCard({
  contactId,
  userId,
}: ArchiveContactCardProps) {
  const { data: contact } = useContact(userId, contactId);
  const archiveContactMutation = useArchiveContact(userId);
  const [archiveError, setArchiveError] = useState<string | null>(null);

  const archiveContact = (archived: boolean) => {
    setArchiveError(null);
    archiveContactMutation.mutate(
      {
        contactId,
        archived,
      },
      {
        onSuccess: () => {},
        onError: (error) => {
          reportException(error, {
            context: "Archiving contact in ArchiveContactCard",
            tags: { component: "ArchiveContactCard", contactId },
          });
          setArchiveError(extractErrorMessage(error));
        },
      }
    );
  };

  if (!contact) {
    return (
      <Card padding="md">
        <div className="h-16 bg-gray-200 rounded animate-pulse" />
      </Card>
    );
  }

  return (
    <Card padding="md">
      <Button
        onClick={() => {
          // Explicitly handle undefined as false (not archived)
          const currentlyArchived = contact.archived === true;
          archiveContact(!currentlyArchived);
        }}
        disabled={archiveContactMutation.isPending}
        loading={archiveContactMutation.isPending}
        variant="outline"
        fullWidth
        error={archiveError}
        icon={
          contact.archived === true ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
          )
        }
        className="mb-3"
      >
        {contact.archived === true ? "Unarchive Contact" : "Archive Contact"}
      </Button>
      {archiveError && (
        <ErrorMessage
          message={archiveError}
          dismissible
          onDismiss={() => setArchiveError(null)}
        />
      )}
    </Card>
  );
}

