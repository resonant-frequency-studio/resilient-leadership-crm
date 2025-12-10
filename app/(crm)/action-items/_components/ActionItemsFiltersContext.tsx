"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type FilterStatus = "all" | "pending" | "completed";
export type FilterDate = "all" | "overdue" | "today" | "thisWeek" | "upcoming";

interface ActionItemsFiltersContextType {
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  filterDate: FilterDate;
  setFilterDate: (date: FilterDate) => void;
  selectedContactId: string | null;
  setSelectedContactId: (contactId: string | null) => void;
}

const ActionItemsFiltersContext = createContext<ActionItemsFiltersContextType | undefined>(
  undefined
);

export function ActionItemsFiltersProvider({ children }: { children: ReactNode }) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterDate, setFilterDate] = useState<FilterDate>("all");
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  return (
    <ActionItemsFiltersContext.Provider
      value={{
        filterStatus,
        setFilterStatus,
        filterDate,
        setFilterDate,
        selectedContactId,
        setSelectedContactId,
      }}
    >
      {children}
    </ActionItemsFiltersContext.Provider>
  );
}

export function useActionItemsFilters() {
  const context = useContext(ActionItemsFiltersContext);
  if (context === undefined) {
    throw new Error("useActionItemsFilters must be used within ActionItemsFiltersProvider");
  }
  return context;
}

