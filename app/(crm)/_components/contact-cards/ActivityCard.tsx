"use client";

import { Timestamp } from "firebase/firestore";
import { useContact } from "@/hooks/useContact";
import Card from "@/components/Card";

interface ActivityCardProps {
  contactId: string;
  userId: string;
}

export default function ActivityCard({ contactId, userId }: ActivityCardProps) {
  const { data: contact } = useContact(userId, contactId);

  if (!contact) {
    return (
      <Card padding="md">
        <div className="h-32 bg-gray-200 rounded animate-pulse" />
      </Card>
    );
  }

  return (
    <Card padding="md">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
          <div>
            <p className="font-medium text-gray-900">Last updated</p>
            <p className="text-gray-500">
              {contact.updatedAt instanceof Timestamp
                ? contact.updatedAt.toDate().toLocaleString()
                : contact.updatedAt
                ? String(contact.updatedAt)
                : "N/A"}
            </p>
          </div>
        </div>
        {contact.createdAt != null && (
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <p className="font-medium text-gray-900">Created</p>
              <p className="text-gray-500">
                {contact.createdAt instanceof Timestamp
                  ? contact.createdAt.toDate().toLocaleString()
                  : typeof contact.createdAt === "string"
                  ? contact.createdAt
                  : "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

