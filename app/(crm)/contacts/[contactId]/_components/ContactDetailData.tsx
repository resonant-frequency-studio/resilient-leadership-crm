import { notFound } from "next/navigation";
import { getUserId } from "@/lib/auth-utils";
import { getContactForUser, getUniqueSegmentsForUser, getAllContactsForUser } from "@/lib/contacts-server";
import { getActionItemsForContact } from "@/lib/action-items";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ContactDetailPageClientWrapper from "./ContactDetailPageClientWrapper";

interface ContactDetailDataProps {
  contactId: string;
}

export default async function ContactDetailData({ contactId }: ContactDetailDataProps) {
  const userId = await getUserId();
  const decodedContactId = decodeURIComponent(contactId);
  const queryClient = getQueryClient();

  // Prefetch all required data in parallel
  await Promise.all([
    // Prefetch contact
    queryClient.prefetchQuery({
      queryKey: ["contact", userId, decodedContactId],
      queryFn: () => getContactForUser(userId, decodedContactId),
    }),
    // Prefetch action items
    queryClient.prefetchQuery({
      queryKey: ["action-items", userId, decodedContactId],
      queryFn: () => getActionItemsForContact(userId, decodedContactId).catch(() => []),
    }),
    // Prefetch contacts list (in case user navigated from contacts page, it's already cached)
    queryClient.prefetchQuery({
      queryKey: ["contacts", userId],
      queryFn: () => getAllContactsForUser(userId),
    }),
    // Prefetch unique segments
    queryClient.prefetchQuery({
      queryKey: ["unique-segments", userId],
      queryFn: () => getUniqueSegmentsForUser(userId).catch(() => []),
    }),
  ]);

  // Check if contact exists (for notFound)
  const contact = await getContactForUser(userId, decodedContactId);
  if (!contact) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContactDetailPageClientWrapper
        contactId={decodedContactId}
        userId={userId}
      />
    </HydrationBoundary>
  );
}

