"use client";

import { useState, useMemo } from "react";
import Input from "@/components/Input";
import { Button } from "@/components/Button";
import { Contact } from "@/types/firestore";

interface EventContactLinkFieldProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  contacts: Contact[];
}

export default function EventContactLinkField({
  value,
  onChange,
  contacts,
}: EventContactLinkFieldProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Find selected contact
  const selectedContact = useMemo(() => {
    if (!value) return null;
    return contacts.find((c) => c.contactId === value) || null;
  }, [value, contacts]);

  // Get display name for contact
  const getContactDisplayName = (contact: Contact): string => {
    if (contact.firstName || contact.lastName) {
      return `${contact.firstName || ""} ${contact.lastName || ""}`.trim();
    }
    return contact.primaryEmail;
  };

  // Filter contacts based on search
  const filteredContacts = useMemo(() => {
    if (!searchTerm.trim()) {
      return contacts;
    }
    const searchLower = searchTerm.toLowerCase();
    return contacts.filter((contact) => {
      const displayName = getContactDisplayName(contact).toLowerCase();
      const email = contact.primaryEmail.toLowerCase();
      return displayName.includes(searchLower) || email.includes(searchLower);
    });
  }, [contacts, searchTerm]);

  // Handle input change
  const handleInputChange = (inputValue: string) => {
    setSearchTerm(inputValue);
    setShowDropdown(true);
    // Clear selection if user is typing something different
    if (selectedContact && inputValue !== getContactDisplayName(selectedContact)) {
      onChange(undefined);
    }
  };

  // Handle contact selection
  const handleSelect = (contact: Contact) => {
    onChange(contact.contactId);
    setSearchTerm("");
    setShowDropdown(false);
  };

  // Handle clear
  const handleClear = () => {
    onChange(undefined);
    setSearchTerm("");
    setShowDropdown(false);
  };

  // Display value: show selected contact name when selected, otherwise show search term
  const displayValue = selectedContact && !searchTerm 
    ? getContactDisplayName(selectedContact) 
    : searchTerm;

  if (contacts.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="block text-sm font-medium text-theme-darkest mb-1">
        Link to Contact (optional)
      </label>
      <div className="relative">
        <div className="relative">
          <Input
            type="text"
            value={displayValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Search and select a contact..."
            aria-expanded={showDropdown}
            aria-haspopup="listbox"
          />
          {selectedContact && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              aria-label="Clear selection"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
              aria-hidden="true"
            />
            <div
              className="absolute z-20 w-full top-full mt-1 bg-card-highlight-light border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto"
              role="listbox"
            >
              {filteredContacts.length > 0 ? (
                filteredContacts.slice(0, 20).map((contact) => (
                  <Button
                    key={contact.contactId}
                    onClick={() => handleSelect(contact)}
                    variant="link"
                    size="sm"
                    className="w-full text-left px-4 py-2 no-underline! hover:bg-selected-active hover:text-selected-foreground text-sm text-foreground justify-start"
                    role="option"
                    aria-selected={contact.contactId === value}
                  >
                    {getContactDisplayName(contact)}
                    {contact.primaryEmail && contact.primaryEmail !== getContactDisplayName(contact) && (
                      <span className="text-gray-500 ml-2">({contact.primaryEmail})</span>
                    )}
                  </Button>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No contacts found
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

