"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardCharts from "../_components/DashboardCharts";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import EmptyState from "@/components/dashboard/EmptyState";

export default function ChartsPageClient({ userId }: { userId: string }) {
  const { loading } = useAuth();
  const { data: initialStats } = useDashboardStats(userId);

  if (loading && !userId) {
    return null;
  }
  
  // Show empty state if no contacts
  if (initialStats?.totalContacts === 0) {
    return <EmptyState wrapInCard={true} size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-theme-darkest mb-2">Charts & Analytics</h1>
        <p className="text-theme-dark text-lg">
          Visual insights into your contact data and engagement metrics
        </p>
      </div>

      {/* Charts Section */}
      <DashboardCharts userId={userId} initialStats={initialStats} />
    </div>
  );
}

