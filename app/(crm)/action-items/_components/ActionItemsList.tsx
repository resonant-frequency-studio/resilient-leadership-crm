import { getUserId } from "@/lib/auth-utils";
import { getAllActionItemsForUser } from "@/lib/action-items";
import { getAllContactsForUser } from "@/lib/contacts-server";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import ActionItemsPageClientWrapper from "./ActionItemsPageClientWrapper";


export default async function ActionItemsList() {
  const userId = await getUserId();
  const queryClient = getQueryClient();

  // Prefetch data on server
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["action-items", userId],
      queryFn: () => getAllActionItemsForUser(userId),
    }),
    queryClient.prefetchQuery({
      queryKey: ["contacts", userId],
      queryFn: () => getAllContactsForUser(userId),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ActionItemsPageClientWrapper userId={userId} />
    </HydrationBoundary>
  );
}

