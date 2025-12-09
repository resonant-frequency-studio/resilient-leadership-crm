import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth-utils";
import { getDashboardStats } from "@/lib/dashboard-stats-server";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { isPlaywrightTest } from "@/util/test-utils";
import ChartsPageClient from "./ChartsPageClient";

export const metadata: Metadata = {
  title: "Charts | Insight Loop CRM",
  description: "Visual analytics and insights for your contacts",
};

export default async function ChartsPage() {
  // Bypass SSR auth redirect for E2E tests - let client-side auth handle it
  if (!isPlaywrightTest()) {
    try {
      await getUserId();
    } catch {
      redirect("/login");
    }
  }

  const userId = await getUserId();
  const queryClient = getQueryClient();

  // Prefetch dashboard stats for charts
  await queryClient.prefetchQuery({
    queryKey: ["dashboard-stats", userId],
    queryFn: () => getDashboardStats(userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChartsPageClient userId={userId} />
    </HydrationBoundary>
  );
}

