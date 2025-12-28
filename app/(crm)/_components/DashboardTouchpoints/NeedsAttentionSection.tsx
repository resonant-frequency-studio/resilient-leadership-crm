"use client";

import Card from "@/components/Card";
import TouchpointCard from "../TouchpointCard";
import TouchpointBulkActions from "../TouchpointBulkActions";
import Checkbox from "@/components/Checkbox";
import ViewAllLink from "@/components/ViewAllLink";
import Accordion from "@/components/Accordion";
import { ContactWithTouchpoint } from "./utils/touchpointFilters";

interface NeedsAttentionSectionProps {
  overdueContacts: ContactWithTouchpoint[];
  upcomingContacts: ContactWithTouchpoint[];
  selectedTouchpointIds: Set<string>;
  onToggleSelection: (contactId: string) => void;
  onBulkStatusUpdate: (status: "completed" | "cancelled") => Promise<void>;
  bulkUpdating: boolean;
  userId: string;
}

export default function NeedsAttentionSection({
  overdueContacts,
  upcomingContacts,
  selectedTouchpointIds,
  onToggleSelection,
  onBulkStatusUpdate,
  bulkUpdating,
  userId,
}: NeedsAttentionSectionProps) {
  if (overdueContacts.length === 0 && upcomingContacts.length === 0) {
    return null;
  }

  const selectedOverdue = overdueContacts.filter((c) => selectedTouchpointIds.has(c.id));
  const selectedUpcoming = upcomingContacts.filter((c) => selectedTouchpointIds.has(c.id));

  return (
    <Card padding="sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-theme-darkest break-words">
          Needs Attention
        </h2>
      </div>

      <div className="space-y-4">
        {/* Follow-ups to close (formerly Past Due) */}
        {overdueContacts.length > 0 && (
          <Accordion title="⚠️ Follow-ups to close" defaultOpen={true}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs text-theme-dark">
                  Ready for follow-up after last session
                </p>
                <ViewAllLink href="/touchpoints/overdue" />
              </div>

              <div className="flex items-start gap-2 sm:gap-3 pb-3 mb-3 border-b border-gray-200">
                <Checkbox
                  checked={overdueContacts.every((c) => selectedTouchpointIds.has(c.id))}
                  onChange={() => {
                    const allSelected = overdueContacts.every((c) => selectedTouchpointIds.has(c.id));
                    if (allSelected) {
                      overdueContacts.forEach((c) => onToggleSelection(c.id));
                    } else {
                      overdueContacts.forEach((c) => onToggleSelection(c.id));
                    }
                  }}
                  label="Handle these together"
                  labelClassName="text-xs sm:text-sm font-medium text-theme-darker break-words flex-1 min-w-0 leading-tight"
                />
              </div>

              {selectedOverdue.length > 0 && (
                <TouchpointBulkActions
                  selectedCount={selectedOverdue.length}
                  onMarkAsContacted={() => onBulkStatusUpdate("completed")}
                  onSkip={() => onBulkStatusUpdate("cancelled")}
                  isLoading={bulkUpdating}
                />
              )}

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {overdueContacts.map((contact) => {
                  const isSelected = selectedTouchpointIds.has(contact.id);
                  return (
                    <TouchpointCard
                      key={contact.id}
                      contact={contact}
                      showCheckbox={true}
                      isSelected={isSelected}
                      onSelectChange={onToggleSelection}
                      variant="touchpoint-overdue"
                      touchpointDate={contact.touchpointDate}
                      daysUntil={contact.daysUntil}
                      needsReminder={false}
                      showTouchpointActions={true}
                      onTouchpointStatusUpdate={() => {}}
                      userId={userId}
                    />
                  );
                })}
              </div>
            </div>
          </Accordion>
        )}

        {/* Preparing ahead (Upcoming in next 7 days) */}
        {upcomingContacts.length > 0 && (
          <Accordion title="🔜 Preparing ahead" defaultOpen={false}>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 mb-2">
                <p className="text-xs text-theme-dark">
                  Coming into focus in the next 7 days
                </p>
                <ViewAllLink href="/touchpoints/upcoming" />
              </div>

              <div className="flex items-start gap-2 sm:gap-3 pb-3 mb-3 border-b border-gray-200">
                <Checkbox
                  checked={upcomingContacts.every((c) => selectedTouchpointIds.has(c.id))}
                  onChange={() => {
                    const allSelected = upcomingContacts.every((c) => selectedTouchpointIds.has(c.id));
                    if (allSelected) {
                      upcomingContacts.forEach((c) => onToggleSelection(c.id));
                    } else {
                      upcomingContacts.forEach((c) => onToggleSelection(c.id));
                    }
                  }}
                  label="Handle these together"
                  labelClassName="text-xs sm:text-sm font-medium text-theme-darker break-words flex-1 min-w-0 leading-tight"
                />
              </div>

              {selectedUpcoming.length > 0 && (
                <TouchpointBulkActions
                  selectedCount={selectedUpcoming.length}
                  onMarkAsContacted={() => onBulkStatusUpdate("completed")}
                  onSkip={() => onBulkStatusUpdate("cancelled")}
                  isLoading={bulkUpdating}
                />
              )}

              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {upcomingContacts.map((contact) => {
                  const isSelected = selectedTouchpointIds.has(contact.id);
                  return (
                    <TouchpointCard
                      key={contact.id}
                      contact={contact}
                      showCheckbox={true}
                      isSelected={isSelected}
                      onSelectChange={onToggleSelection}
                      variant="touchpoint-upcoming"
                      touchpointDate={contact.touchpointDate}
                      daysUntil={contact.daysUntil}
                      needsReminder={contact.needsReminder}
                      showTouchpointActions={true}
                      userId={userId}
                      onTouchpointStatusUpdate={() => {}}
                    />
                  );
                })}
              </div>
            </div>
          </Accordion>
        )}
      </div>
    </Card>
  );
}

