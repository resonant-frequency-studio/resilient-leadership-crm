import { notFound } from "next/navigation";
import { getUserId } from "@/lib/auth-utils";
import { getContactForUser, getUniqueSegmentsForUser } from "@/lib/contacts-server";
import { getActionItemsForContact } from "@/lib/action-items";
import { convertTimestampToISO } from "@/util/timestamp-utils-server";
import ContactDetailPageClient from "../ContactDetailPageClient";
import { ActionItem } from "@/types/firestore";

interface ContactDetailDataProps {
  contactId: string;
}

export default async function ContactDetailData({ contactId }: ContactDetailDataProps) {
  const userId = await getUserId();
  const decodedContactId = decodeURIComponent(contactId);

  // Fetch contact, action items, and unique segments in parallel
  const [contact, actionItems, uniqueSegments] = await Promise.all([
    getContactForUser(userId, decodedContactId),
    getActionItemsForContact(userId, decodedContactId).catch(() => []), // Return empty array on error
    getUniqueSegmentsForUser(userId).catch(() => []), // Return empty array on error
  ]);

  if (!contact) {
    notFound();
  }

  // Convert Firestore Timestamps to ISO strings for serialization to client component
  const serializedActionItems: ActionItem[] = actionItems.map((item) => ({
    ...item,
    dueDate: convertTimestampToISO(item.dueDate),
    completedAt: convertTimestampToISO(item.completedAt),
    createdAt: convertTimestampToISO(item.createdAt) || new Date().toISOString(),
    updatedAt: convertTimestampToISO(item.updatedAt) || new Date().toISOString(),
  }));

  return (
    <ContactDetailPageClient
      contact={contact}
      contactDocumentId={decodedContactId}
      userId={userId}
      initialActionItems={serializedActionItems}
      uniqueSegments={uniqueSegments}
    />
  );
}

