import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUserId } from "@/lib/auth-utils";
import { isPlaywrightTest } from "@/util/test-utils";
import TouchpointsOverduePageClient from "./_components/TouchpointsOverduePageClient";

export const metadata: Metadata = {
  title: "Overdue Touchpoints | Insight Loop CRM",
  description: "View and manage all overdue touchpoints",
};

export default async function TouchpointsOverduePage() {
  // Bypass SSR auth redirect for E2E tests - let client-side auth handle it
  if (!isPlaywrightTest()) {
    try {
      await getUserId();
    } catch {
      redirect("/login");
    }
  }

  return <TouchpointsOverduePageClient />;
}

