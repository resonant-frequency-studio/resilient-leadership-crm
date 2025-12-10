import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth-utils";
import { isPlaywrightTest } from "@/util/test-utils";
import TouchpointsTodayPageClient from "./_components/TouchpointsTodayPageClient";

export const metadata: Metadata = {
  title: "Today's Touchpoints | Insight Loop CRM",
  description: "View and manage all touchpoints due today",
};

export default async function TouchpointsTodayPage() {
  // Bypass SSR auth redirect for E2E tests - let client-side auth handle it
  if (!isPlaywrightTest()) {
    try {
      await getUserId();
    } catch {
      redirect("/login");
    }
  }

  return <TouchpointsTodayPageClient />;
}

