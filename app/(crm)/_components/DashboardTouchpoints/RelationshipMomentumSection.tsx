"use client";

import Card from "@/components/Card";
import ContactCard from "../ContactCard";
import ThemedSuspense from "@/components/ThemedSuspense";
import ViewAllLink from "@/components/ViewAllLink";
import { Contact } from "@/types/firestore";

interface RelationshipMomentumSectionProps {
  contacts: Contact[];
  isLoading: boolean;
  userId: string;
}

export default function RelationshipMomentumSection({
  contacts,
  isLoading,
  userId,
}: RelationshipMomentumSectionProps) {
  const showSkeletons = isLoading && contacts.length === 0;

  return (
    <Card padding="sm" className="bg-card-highlight-light/30">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-theme-darkest opacity-80">
            Relationship Momentum
          </h2>
          <p className="text-xs text-theme-dark mt-1 italic">
            Recent conversations and notes that are still fresh in mind.
          </p>
        </div>
        {!showSkeletons && contacts.length > 0 && (
          <div className="flex-shrink-0">
            <ViewAllLink href="/contacts" />
          </div>
        )}
      </div>
      {showSkeletons ? (
        <ThemedSuspense isLoading={true} variant="list" />
      ) : contacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.contactId}
              contact={{ ...contact, id: contact.contactId }}
              showArrow={true}
              userId={userId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-theme-dark opacity-70">
            No recent activity yet. Your connections will appear here as you engage.
          </p>
        </div>
      )}
    </Card>
  );
}

