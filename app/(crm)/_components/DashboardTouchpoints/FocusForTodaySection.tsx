"use client";

import Card from "@/components/Card";
import TouchpointCard from "../TouchpointCard";
import TouchpointBulkActions from "../TouchpointBulkActions";
import Checkbox from "@/components/Checkbox";
import ViewAllLink from "@/components/ViewAllLink";
import { ContactWithTouchpoint } from "./utils/touchpointFilters";

interface FocusForTodaySectionProps {
  contacts: ContactWithTouchpoint[];
  totalCount: number;
  selectedTouchpointIds: Set<string>;
  onToggleSelection: (contactId: string) => void;
  onBulkStatusUpdate: (status: "completed" | "cancelled") => Promise<void>;
  bulkUpdating: boolean;
  userId: string;
}

export default function FocusForTodaySection({
  contacts,
  totalCount,
  selectedTouchpointIds,
  onToggleSelection,
  onBulkStatusUpdate,
  bulkUpdating,
  userId,
}: FocusForTodaySectionProps) {
  const selectedInSection = contacts.filter((c) => selectedTouchpointIds.has(c.id));

  return (
    <Card padding="sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-theme-darkest break-words">
            Focus for Today {totalCount > 0 && `(${totalCount})`}
          </h2>
          <p className="text-sm text-theme-dark mt-2 italic">
            Today is open and flexible.
          </p>
        </div>
        {totalCount > 0 && (
          <div className="shrink-0">
            <ViewAllLink href="/touchpoints/today" />
          </div>
        )}
      </div>

      {/* Select All Checkbox for Today */}
      {contacts.length > 0 && (
        <div className="flex items-start gap-2 sm:gap-3 pb-3 mb-3 border-b border-gray-200">
          <Checkbox
            checked={contacts.every((c) => selectedTouchpointIds.has(c.id)) && contacts.length > 0}
            onChange={() => {
              const allSelected = contacts.every((c) => selectedTouchpointIds.has(c.id));
              if (allSelected) {
                contacts.forEach((c) => onToggleSelection(c.id));
              } else {
                contacts.forEach((c) => onToggleSelection(c.id));
              }
            }}
            label="Handle these together"
            labelClassName="text-xs sm:text-sm font-medium text-theme-darker break-words flex-1 min-w-0 leading-tight"
          />
        </div>
      )}

      {/* Bulk Actions for Today */}
      {selectedInSection.length > 0 && (
        <TouchpointBulkActions
          selectedCount={selectedInSection.length}
          onMarkAsContacted={() => onBulkStatusUpdate("completed")}
          onSkip={() => onBulkStatusUpdate("cancelled")}
          isLoading={bulkUpdating}
        />
      )}

      {/* Today's Touchpoints */}
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {contacts.map((contact) => {
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
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-theme-dark">
            You&apos;re clear for today.
          </p>
          <p className="text-sm text-theme-dark mt-1">
            Consider a gentle check-in or prep for an upcoming conversation.
          </p>
        </div>
      )}
    </Card>
  );
}

