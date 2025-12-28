"use client";

import { useState, useMemo } from "react";
import { View } from "react-big-calendar";
import { useAuth } from "@/hooks/useAuth";
import { useCalendarEventsRealtime } from "@/hooks/useCalendarEventsRealtime";
import { useContactsRealtime } from "@/hooks/useContactsRealtime";
import { useCalendarSyncStatusRealtime } from "@/hooks/useCalendarSyncStatusRealtime";
import CalendarView from "./CalendarView";
import CalendarFilterBar, { CalendarFilters } from "./CalendarFilterBar";
import CreateEventModal from "./CreateEventModal";
import EmptyState from "@/components/dashboard/EmptyState";
import CalendarHeader from "./CalendarHeader";
import CalendarSyncStatus from "./CalendarSyncStatus";
import CalendarErrorDisplay from "./CalendarErrorDisplay";
import { useCalendarDateRange } from "./hooks/useCalendarDateRange";
import { CalendarEvent } from "@/types/firestore";

const CALENDAR_VIEW_STORAGE_KEY = "insight-loop-calendar-view";

export default function CalendarPageClientWrapper() {
  const { user, loading: authLoading } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createModalPrefill, setCreateModalPrefill] = useState<{ startTime?: Date; endTime?: Date; contactId?: string } | null>(null);
  
  // Get userId from auth (no longer passed as prop from SSR)
  const effectiveUserId = !authLoading && user?.uid ? user.uid : null;
  
  // Initialize view from localStorage
  const [currentView, setCurrentView] = useState<View>(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem(CALENDAR_VIEW_STORAGE_KEY);
      if (savedView && ["month", "week", "day", "agenda"].includes(savedView)) {
        return savedView as View;
      }
    }
    return "month" as View;
  });

  // Calendar sync status
  const { lastSync, loading: syncStatusLoading } = useCalendarSyncStatusRealtime(effectiveUserId);

  // Calculate date range based on current view
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Calculate date range based on view type
  const { timeMin, timeMax } = useCalendarDateRange({
    currentDate,
    currentView,
  });

  // Use Firebase real-time listeners
  const { events = [], loading: isLoading, error, hasConfirmedNoEvents } = useCalendarEventsRealtime(
    effectiveUserId,
    timeMin,
    timeMax
  );

  // Fetch contacts for event card suggestions
  const { contacts = [] } = useContactsRealtime(effectiveUserId);
  
  // For error handling, check if error exists
  const isError = error !== null;

  // Filter state
  const [filters, setFilters] = useState<CalendarFilters>({
    segment: undefined,
    tags: undefined,
    onlyLinked: false,
    onlyTouchpoints: false,
    search: undefined,
  });

  // Filter events client-side
  const filteredEvents = useMemo(() => {
    return events.filter((event: CalendarEvent) => {
      // Segment filter
      if (filters.segment) {
        if (event.contactSnapshot?.segment !== filters.segment) {
          return false;
        }
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        const eventTags = event.contactSnapshot?.tags || [];
        if (!filters.tags.every((tag) => eventTags.includes(tag))) {
          return false;
        }
      }

      // Only linked events
      if (filters.onlyLinked) {
        if (!event.matchedContactId) {
          return false;
        }
      }

      // Only touchpoints
      if (filters.onlyTouchpoints) {
        if (event.sourceOfTruth !== "crm_touchpoint") {
          return false;
        }
      }

      // Search filter
      if (filters.search && filters.search.trim().length > 0) {
        const searchLower = filters.search.toLowerCase().trim();
        const titleMatch = event.title.toLowerCase().includes(searchLower);
        const contactNameMatch = event.contactSnapshot?.name
          ?.toLowerCase()
          .includes(searchLower);
        if (!titleMatch && !contactNameMatch) {
          return false;
        }
      }

      return true;
    });
  }, [events, filters]);

  // Prepare error message and helpers if there is an error (but still render static content below)
  const errorMessage = isError && error instanceof Error ? error.message : (isError ? "Failed to load calendar events" : null);
  const needsReconnect = errorMessage ? (
    errorMessage.includes("Calendar access not granted") || 
    errorMessage.includes("reconnect your Google account with Calendar") ||
    errorMessage.includes("Calendar scope")
  ) : false;
  
  const needsApiEnabled = errorMessage ? (
    errorMessage.includes("Google Calendar API has not been used") ||
    errorMessage.includes("calendar-json.googleapis.com") ||
    errorMessage.includes("Enable it by visiting")
  ) : false;

  // Show empty state only after loading completes AND there's no data
  // Don't show empty state while loading - let the calendar view handle loading state

  return (
    <div id="schedule-root" className="space-y-6 crm-calendar">
      <CalendarHeader
        onAddTimeBlock={() => {
          setCreateModalPrefill(null);
          setShowCreateModal(true);
        }}
      />

      <CalendarSyncStatus
        lastSync={lastSync}
        loading={syncStatusLoading}
      />

      {isError && errorMessage && (
        <CalendarErrorDisplay
          errorMessage={errorMessage}
          needsApiEnabled={needsApiEnabled}
          needsReconnect={needsReconnect}
        />
      )}

      {/* Calendar Filter Bar - ALWAYS render - enable as soon as cached data is available */}
      <div data-tour="schedule-filters">
        <CalendarFilterBar
          events={events}
          filters={filters}
          onFiltersChange={setFilters}
          disabled={!effectiveUserId || events.length === 0}
        />
      </div>

      {/* Empty State - only show when both cache and server confirm no events */}
      {hasConfirmedNoEvents && (
        <EmptyState
          message="No calendar events"
          description={`No events found for ${currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}. Try navigating to a different month or sync your calendar.`}
          showActions={false}
          wrapInCard={true}
          size="lg"
        />
      )}

      {/* Calendar View - ALWAYS render */}
      <div data-tour="schedule-calendar-grid">
        <CalendarView
          events={filteredEvents}
          currentDate={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          contacts={contacts}
          onSlotSelect={(start, end) => {
            setCreateModalPrefill({ startTime: start, endTime: end });
            setShowCreateModal(true);
          }}
          onViewChange={(view) => {
            setCurrentView(view);
            // Also save to localStorage (CalendarView does this too, but we want to keep state in sync)
            if (typeof window !== "undefined") {
              localStorage.setItem(CALENDAR_VIEW_STORAGE_KEY, view);
            }
          }}
          initialView={currentView}
        />
      </div>

      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setCreateModalPrefill(null);
        }}
        prefillStartTime={createModalPrefill?.startTime}
        prefillEndTime={createModalPrefill?.endTime}
        prefillContactId={createModalPrefill?.contactId}
        contacts={contacts}
      />
    </div>
  );
}

