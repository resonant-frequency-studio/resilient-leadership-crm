"use client";

import Card from "@/components/Card";
import { useActionItemsFilters, FilterStatus, FilterDate } from "./ActionItemsFiltersContext";
import { Contact } from "@/types/firestore";

interface ActionItemsFiltersProps {
  contacts: Array<[string, Contact]>;
  uniqueContactIds: string[];
}

export default function ActionItemsFilters({
  contacts,
  uniqueContactIds,
}: ActionItemsFiltersProps) {
  const {
    filterStatus,
    setFilterStatus,
    filterDate,
    setFilterDate,
    selectedContactId,
    setSelectedContactId,
  } = useActionItemsFilters();

  const contactsMap = new Map(contacts);

  return (
    <Card padding="md">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filter-status" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            id="filter-status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Date
          </label>
          <select
            id="filter-date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value as FilterDate)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Dates</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due Today</option>
            <option value="thisWeek">Due This Week</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filter-contact" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Contact
          </label>
          <select
            id="filter-contact"
            value={selectedContactId ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedContactId(value === "" ? null : value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Contacts</option>
            {uniqueContactIds.map((contactId) => {
              const contact = contactsMap.get(contactId);
              const name = contact
                ? [contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
                  contact.primaryEmail
                : "";
              if (!name) return null; // Don't show empty option
              return (
                <option key={contactId} value={contactId}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </Card>
  );
}

