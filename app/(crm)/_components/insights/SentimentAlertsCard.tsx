"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Contact } from "@/types/firestore";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import { getNegativeSentimentContacts } from "@/lib/insights/insight-utils";
import { getDisplayName } from "@/util/contact-utils";

interface SentimentAlertsCardProps {
  contacts: Contact[];
}

export default function SentimentAlertsCard({
  contacts,
}: SentimentAlertsCardProps) {
  const router = useRouter();
  const negativeContacts = getNegativeSentimentContacts(contacts);
  const topThree = negativeContacts.slice(0, 3);

  const handleReviewAll = () => {
    router.push("/contacts?sentiment=negative");
  };

  if (negativeContacts.length === 0) {
    return (
      <Card padding="md">
      <h3 className="text-lg font-semibold text-theme-darkest mb-2">
        Conversations That May Need Care
      </h3>
      <p className="text-sm text-theme-dark">
        No conversations with concerning sentiment in recent activity.
      </p>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-theme-darkest">
          Conversations That May Need Care
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-theme-dark">
            {negativeContacts.length}{" "}
            {negativeContacts.length === 1 ? "conversation" : "conversations"}
          </span>
          <Button onClick={handleReviewAll} variant="secondary" size="sm">
            Review relationships
          </Button>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        {topThree.map((contact) => {
          const snippet = contact.summary
            ? contact.summary.substring(0, 100) + (contact.summary.length > 100 ? "..." : "")
            : "No summary available";
          return (
            <div
              key={contact.contactId}
              className="p-3 bg-card-highlight-light rounded-sm border-l-4 border-red-500"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/contacts/${encodeURIComponent(contact.contactId)}`}
                    className="text-sm font-medium text-theme-darkest hover:underline block mb-1"
                  >
                    {getDisplayName(contact)}
                  </Link>
                  <p className="text-xs text-theme-dark line-clamp-2">
                    {snippet}
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-sm shrink-0">
                  {contact.sentiment}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {negativeContacts.length > 3 && (
        <p className="text-xs text-theme-dark text-center">
          +{negativeContacts.length - 3} more contacts with negative sentiment
        </p>
      )}
    </Card>
  );
}

