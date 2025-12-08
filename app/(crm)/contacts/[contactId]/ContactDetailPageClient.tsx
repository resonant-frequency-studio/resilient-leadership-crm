"use client";

import ContactEditor from "@/components/ContactEditor";
import ContactsLink from "@/components/ContactsLink";
import { getInitials, getDisplayName } from "@/util/contact-utils";
import { Contact, ActionItem } from "@/types/firestore";

interface ContactDetailPageClientProps {
  contact: Contact;
  contactDocumentId: string;
  userId: string;
  initialActionItems?: ActionItem[];
  uniqueSegments?: string[];
}

export default function ContactDetailPageClient({
  contact,
  contactDocumentId,
  userId,
  initialActionItems,
  uniqueSegments,
}: ContactDetailPageClientProps) {
  return (
    <div className="space-y-6">
      {/* Back Button - Mobile: top, Desktop: in header */}
      <div className="lg:hidden">
        <ContactsLink variant="default" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl shadow-lg">
            {getInitials(contact)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {getDisplayName(contact)}
            </h1>
            <p className="text-gray-500 flex items-center gap-2">
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {contact.primaryEmail}
            </p>
          </div>
        </div>
        <div className="hidden lg:block">
          <ContactsLink variant="default" />
        </div>
      </div>

      {/* Contact Editor */}
      <ContactEditor
        contact={contact}
        contactDocumentId={contactDocumentId}
        userId={userId}
        initialActionItems={initialActionItems}
        initialContact={contact}
        uniqueSegments={uniqueSegments}
      />
    </div>
  );
}

