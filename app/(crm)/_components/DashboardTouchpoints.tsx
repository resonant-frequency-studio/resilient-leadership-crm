"use client";

import ThemedSuspense from "@/components/ThemedSuspense";
import Card from "@/components/Card";
import { useContactsRealtime } from "@/hooks/useContactsRealtime";
import { useAuth } from "@/hooks/useAuth";
import FocusForTodaySection from "./DashboardTouchpoints/FocusForTodaySection";
import NeedsAttentionSection from "./DashboardTouchpoints/NeedsAttentionSection";
import RelationshipMomentumSection from "./DashboardTouchpoints/RelationshipMomentumSection";
import { useTouchpointBulkActions } from "./DashboardTouchpoints/hooks/useTouchpointBulkActions";
import {
  filterTodayTouchpoints,
  filterOverdueTouchpoints,
  filterUpcomingTouchpoints,
  filterRecentContacts,
  countTodayTouchpoints,
  countOverdueTouchpoints,
  countUpcomingTouchpoints,
} from "./DashboardTouchpoints/utils/touchpointFilters";

function TouchpointsContent({ userId }: { userId: string }) {
  const { user } = useAuth();
  const { contacts = [], loading: contactsLoading } = useContactsRealtime(userId);
  const serverTime = new Date();

  // Use bulk actions hook
  const {
    selectedTouchpointIds,
    toggleTouchpointSelection,
    handleBulkStatusUpdate,
    bulkUpdating,
  } = useTouchpointBulkActions({ userId: user?.uid });

  // Filter touchpoints using utility functions
  const contactsWithTodayTouchpoints = filterTodayTouchpoints(contacts, serverTime, 3);
  const contactsWithOverdueTouchpoints = filterOverdueTouchpoints(contacts, serverTime, 3);
  const contactsWithUpcomingTouchpoints = filterUpcomingTouchpoints(contacts, serverTime, 3);
  const recentContacts = filterRecentContacts(contacts, serverTime, 3);

  // Calculate total counts
  const totalTodayCount = countTodayTouchpoints(contacts, serverTime);
  const totalOverdueCount = countOverdueTouchpoints(contacts, serverTime);
  const totalUpcomingCount = countUpcomingTouchpoints(contacts, serverTime);

  // Always render - no early returns
  return (
    <div className="space-y-6">
      <FocusForTodaySection
        contacts={contactsWithTodayTouchpoints}
        totalCount={totalTodayCount}
        selectedTouchpointIds={selectedTouchpointIds}
        onToggleSelection={toggleTouchpointSelection}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        bulkUpdating={bulkUpdating}
        userId={userId}
      />

      <NeedsAttentionSection
        overdueContacts={contactsWithOverdueTouchpoints}
        upcomingContacts={contactsWithUpcomingTouchpoints}
        selectedTouchpointIds={selectedTouchpointIds}
        onToggleSelection={toggleTouchpointSelection}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        bulkUpdating={bulkUpdating}
        userId={userId}
      />

      <RelationshipMomentumSection
        contacts={recentContacts}
        isLoading={contactsLoading}
        userId={userId}
      />
    </div>
  );
}

export default function DashboardTouchpoints({ userId }: { userId: string }) {
  return (
    <ThemedSuspense
      fallback={
        <Card padding="sm" className="animate-pulse">
          <div className="h-6 bg-card-highlight-light rounded w-48 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-card-highlight-light rounded-sm">
                <div className="w-12 h-12 bg-theme-light rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-theme-light rounded w-2/3" />
                  <div className="h-4 bg-theme-light rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      }
    >
      <TouchpointsContent userId={userId} />
    </ThemedSuspense>
  );
}

