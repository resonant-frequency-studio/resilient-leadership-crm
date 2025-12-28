"use client";

import { useState, useMemo, useEffect } from "react";
import { Contact } from "@/types/firestore";
import Card from "@/components/Card";
import { Button } from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { useContactsFilter } from "../contacts/_components/ContactsFilterContext";
import DateRangeFilter from "./ContactsFilter/DateRangeFilter";
import SearchFilters from "./ContactsFilter/SearchFilters";
import SegmentFilter from "./ContactsFilter/SegmentFilter";
import CustomFilters from "./ContactsFilter/CustomFilters";
import TagsFilter from "./ContactsFilter/TagsFilter";
import { isDefaultDateRange, getDefaultDateRange } from "./ContactsFilter/utils/dateFormatters";

interface ContactWithId extends Contact {
  id: string;
}

interface ContactsFilterProps {
  contacts: ContactWithId[];
  disabled?: boolean; // Disable inputs when loading or no contacts
}

export default function ContactsFilter({ contacts, disabled = false }: ContactsFilterProps) {
  const {
    selectedSegment,
    selectedTags,
    emailSearch,
    firstNameSearch,
    lastNameSearch,
    companySearch,
    showArchived,
    includeNewContacts,
    customFilter,
    lastEmailDateRange,
    onSegmentChange,
    onTagsChange,
    onEmailSearchChange,
    onFirstNameSearchChange,
    onLastNameSearchChange,
    onCompanySearchChange,
    onShowArchivedChange,
    onIncludeNewContactsChange,
    onCustomFilterChange,
    onLastEmailDateRangeChange,
    onClearFilters,
  } = useContactsFilter();
  
  // Auto-expand "More Filters" if any of those filters are active
  // Note: includeNewContacts is in the date filter section, not "More Filters", so it's excluded
  const hasMoreFiltersActive = selectedSegment || selectedTags.length > 0 || emailSearch.trim() || firstNameSearch.trim() || lastNameSearch.trim() || companySearch.trim() || !!customFilter || showArchived;
  const [showMoreFilters, setShowMoreFilters] = useState(hasMoreFiltersActive);

  // Reset date filter to default on mount (page load/refresh)
  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    onLastEmailDateRangeChange(defaultRange);
    onIncludeNewContactsChange(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Update showMoreFilters when filters become active
  useEffect(() => {
    if (hasMoreFiltersActive && !showMoreFilters) {
      setShowMoreFilters(true);
    }
  }, [hasMoreFiltersActive, showMoreFilters]);

  // Get unique segments and tags from contacts
  const uniqueSegments = useMemo(() =>
    Array.from(new Set(contacts.map(c => c.segment).filter(Boolean) as string[])).sort(),
    [contacts]
  );
  const uniqueTags = useMemo(() => {
    const allTags = contacts.flatMap(c => c.tags || []);
    return Array.from(new Set(allTags)).sort();
  }, [contacts]);

  const dateRangeIsDefault = useMemo(() => isDefaultDateRange(lastEmailDateRange), [lastEmailDateRange]);
  const hasActiveFilters = selectedSegment || selectedTags.length > 0 || emailSearch.trim() || firstNameSearch.trim() || lastNameSearch.trim() || companySearch.trim() || !!customFilter || !dateRangeIsDefault;

  const handleClearDateFilter = () => {
    const defaultRange = getDefaultDateRange();
    onLastEmailDateRangeChange(defaultRange);
    onIncludeNewContactsChange(true);
  };

  const handleClearMoreFilters = () => {
    onSegmentChange("");
    onTagsChange([]);
    onEmailSearchChange("");
    onFirstNameSearchChange("");
    onLastNameSearchChange("");
    onCompanySearchChange("");
    onCustomFilterChange(null);
    onShowArchivedChange(false);
    onIncludeNewContactsChange(true);
  };

  // Always render - no early return

  return (
    <Card padding="md">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-theme-darkest">Filters</h2>
      </div>

      {/* Primary Filter: Date Range */}
      <DateRangeFilter
        startDate={lastEmailDateRange.start}
        endDate={lastEmailDateRange.end}
        includeNewContacts={includeNewContacts}
        disabled={disabled || contacts.length === 0}
        onStartDateChange={(date) => onLastEmailDateRangeChange({ ...lastEmailDateRange, start: date })}
        onEndDateChange={(date) => onLastEmailDateRangeChange({ ...lastEmailDateRange, end: date })}
        onIncludeNewContactsChange={onIncludeNewContactsChange}
        onReset={handleClearDateFilter}
        isDefault={dateRangeIsDefault}
      />

      {/* More Filters - Expandable Section */}
      <div>
        <button
          onClick={() => setShowMoreFilters(!showMoreFilters)}
          className="flex items-center justify-between w-full text-left cursor-pointer py-3 px-2 -mx-2"
          disabled={disabled}
        >
          <span className="text-sm font-medium text-theme-darker">
            More Filters
            {hasMoreFiltersActive && (
              <span className="ml-2 text-xs text-blue-600">({[
                selectedSegment && "Segment",
                selectedTags.length > 0 && `${selectedTags.length} tag${selectedTags.length > 1 ? 's' : ''}`,
                emailSearch.trim() && "Email",
                firstNameSearch.trim() && "First Name",
                lastNameSearch.trim() && "Last Name",
                companySearch.trim() && "Company",
                customFilter && "Quick Filter",
                showArchived && "Archived"
              ].filter(Boolean).join(", ")})</span>
            )}
          </span>
          <svg
            className={`w-5 h-5 text-theme-darker transition-transform ${showMoreFilters ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showMoreFilters && (
          <div className="space-y-4">
            {/* Clear More Filters Button */}
            {hasMoreFiltersActive && !disabled && (
              <div className="flex justify-end pb-2 border-b border-gray-200">
                <Button
                  onClick={handleClearMoreFilters}
                  variant="link"
                  size="sm"
                  className="text-sm"
                >
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Search Row */}
            <SearchFilters
              emailSearch={emailSearch}
              firstNameSearch={firstNameSearch}
              lastNameSearch={lastNameSearch}
              companySearch={companySearch}
              disabled={disabled || contacts.length === 0}
              onEmailSearchChange={onEmailSearchChange}
              onFirstNameSearchChange={onFirstNameSearchChange}
              onLastNameSearchChange={onLastNameSearchChange}
              onCompanySearchChange={onCompanySearchChange}
            />

            {/* Filter Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SegmentFilter
                selectedSegment={selectedSegment}
                uniqueSegments={uniqueSegments}
                disabled={disabled || contacts.length === 0}
                onSegmentChange={onSegmentChange}
              />

              {onCustomFilterChange && (
                <CustomFilters
                  customFilter={customFilter}
                  disabled={disabled || contacts.length === 0}
                  onCustomFilterChange={onCustomFilterChange}
                />
              )}

              <div className={customFilter !== undefined ? "md:col-span-1" : "md:col-span-2"}>
                <TagsFilter
                  selectedTags={selectedTags}
                  uniqueTags={uniqueTags}
                  disabled={disabled || contacts.length === 0}
                  onTagsChange={onTagsChange}
                />
              </div>
            </div>

            {/* Show Archived Row */}
            <div style={{ pointerEvents: 'none' }}>
              <div style={{ pointerEvents: 'auto', display: 'inline-block' }}>
                <Checkbox
                  checked={showArchived}
                  onChange={(e) => {
                    e.stopPropagation();
                    onShowArchivedChange(e.target.checked);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  label={showArchived ? "Showing archived contacts" : "Show archived contacts"}
                  disabled={disabled || contacts.length === 0}
                  labelClassName="cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

