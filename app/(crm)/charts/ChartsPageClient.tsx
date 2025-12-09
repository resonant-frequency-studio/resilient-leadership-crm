"use client";

import { useAuth } from "@/hooks/useAuth";
import DashboardCharts from "../_components/DashboardCharts";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function ChartsPageClient({ userId }: { userId: string }) {
  const { loading } = useAuth();
  const { data: initialStats } = useDashboardStats(userId);

  if (loading && !userId) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Charts & Analytics</h1>
        <p className="text-gray-600 text-lg">
          Visual insights into your contact data and engagement metrics
        </p>
      </div>

      {/* Charts Section */}
      <DashboardCharts userId={userId} initialStats={initialStats} />
    </div>
  );
}

