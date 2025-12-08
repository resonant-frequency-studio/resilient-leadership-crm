import { getUserId } from "@/lib/auth-utils";
import { getAllContactsForUser } from "@/lib/contacts-server";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ContactsPageClientWrapper from "./ContactsPageClientWrapper";

export default async function ContactsList() {
  const userId = await getUserId();
  const queryClient = getQueryClient();

  // Prefetch contacts on server
  await queryClient.prefetchQuery({
    queryKey: ["contacts", userId],
    queryFn: () => getAllContactsForUser(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ContactsPageClientWrapper userId={userId} />
    </HydrationBoundary>
  );
}

