"use client";

import Input from "@/components/Input";

interface SearchFiltersProps {
  emailSearch: string;
  firstNameSearch: string;
  lastNameSearch: string;
  companySearch: string;
  disabled: boolean;
  onEmailSearchChange: (value: string) => void;
  onFirstNameSearchChange: (value: string) => void;
  onLastNameSearchChange: (value: string) => void;
  onCompanySearchChange: (value: string) => void;
}

export default function SearchFilters({
  emailSearch,
  firstNameSearch,
  lastNameSearch,
  companySearch,
  disabled,
  onEmailSearchChange,
  onFirstNameSearchChange,
  onLastNameSearchChange,
  onCompanySearchChange,
}: SearchFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* Email Search */}
      <div>
        <label htmlFor="email-search" className="block text-sm font-medium text-theme-darker mb-2">
          Search by Email
        </label>
        <Input
          id="email-search"
          type="text"
          value={emailSearch}
          onChange={(e) => onEmailSearchChange(e.target.value)}
          placeholder="Enter email address..."
          disabled={disabled}
        />
      </div>

      {/* Last Name Search */}
      <div>
        <label htmlFor="last-name-search" className="block text-sm font-medium text-theme-darker mb-2">
          Search by Last Name
        </label>
        <Input
          id="last-name-search"
          type="text"
          value={lastNameSearch}
          onChange={(e) => onLastNameSearchChange(e.target.value)}
          placeholder="Enter last name..."
          disabled={disabled}
        />
      </div>

      {/* First Name Search */}
      <div>
        <label htmlFor="first-name-search" className="block text-sm font-medium text-theme-darker mb-2">
          Search by First Name
        </label>
        <Input
          id="first-name-search"
          type="text"
          value={firstNameSearch}
          onChange={(e) => onFirstNameSearchChange(e.target.value)}
          placeholder="Enter first name..."
          disabled={disabled}
        />
      </div>

      {/* Company Search */}
      <div>
        <label htmlFor="company-search" className="block text-sm font-medium text-theme-darker mb-2">
          Search by Company
        </label>
        <Input
          id="company-search"
          type="text"
          value={companySearch}
          onChange={(e) => onCompanySearchChange(e.target.value)}
          placeholder="Enter company name..."
          disabled={disabled}
        />
      </div>
    </div>
  );
}

