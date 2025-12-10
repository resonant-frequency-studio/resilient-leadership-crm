import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth-utils";
import { isPlaywrightTest } from "@/util/test-utils";
import TouchpointsUpcomingPageClient from "./_components/TouchpointsUpcomingPageClient";

export const metadata: Metadata = {
  title: "Upcoming Touchpoints | Insight Loop CRM",
  description: "View and manage all upcoming touchpoints",
};

export default async function TouchpointsUpcomingPage() {
  // Bypass SSR auth redirect for E2E tests - let client-side auth handle it
  if (!isPlaywrightTest()) {
    try {
      await getUserId();
    } catch {
      redirect("/login");
    }
  }

  return <TouchpointsUpcomingPageClient />;
}

