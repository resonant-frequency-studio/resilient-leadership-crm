"use client";

import { useState, useRef, useEffect } from "react";
import { Contact } from "@/types/firestore";
import Papa from "papaparse";
import { Button } from "@/components/Button";
import ExportToGoogleModal from "./ExportToGoogleModal";

interface ContactWithId extends Contact {
  id: string;
}

interface ExportContactsButtonProps {
  contacts: ContactWithId[];
  disabled?: boolean;
}

export default function ExportContactsButton({ contacts, disabled = false }: ExportContactsButtonProps) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const exportToCSV = () => {
    setIsDropdownOpen(false);
    if (contacts.length === 0) {
      alert("No contacts to export");
      return;
    }

    // Map contacts to CSV format matching the import format
    const csvData = contacts.map((contact) => {
      // Format tags array as comma-separated string
      const tagsString = contact.tags && contact.tags.length > 0 
        ? contact.tags.join(", ") 
        : "";

      // Format dates if they exist
      const formatDate = (date: unknown): string => {
        if (!date) return "";
        if (date instanceof Date) {
          return date.toISOString().split("T")[0];
        }
        if (typeof date === "object" && "toDate" in date) {
          // Firestore Timestamp
          return (date as { toDate: () => Date }).toDate().toISOString().split("T")[0];
        }
        if (typeof date === "string") {
          return date.split("T")[0];
        }
        return "";
      };

      return {
        Email: contact.primaryEmail || "",
        FirstName: contact.firstName || "",
        LastName: contact.lastName || "",
        Summary: contact.summary || "",
        Notes: contact.notes || "",
        Tags: tagsString,
        Segment: contact.segment || "",
        LeadSource: contact.leadSource || "",
        EngagementScore: contact.engagementScore?.toString() || "",
        NextTouchpointDate: formatDate(contact.nextTouchpointDate),
        NextTouchpointMessage: contact.nextTouchpointMessage || "",
      };
    });

    // Convert to CSV
    const csv = Papa.unparse(csvData, {
      header: true,
      skipEmptyLines: false,
    });

    // Create blob and download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `contacts_export_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handleExportToGoogle = () => {
    setIsDropdownOpen(false);
    setShowExportModal(true);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <Button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={disabled || contacts.length === 0}
          variant="secondary"
          size="sm"
          className="whitespace-nowrap shadow-sm"
          icon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          }
          iconPosition="right"
        >
          Export
        </Button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <>
            {/* Backdrop to close menu */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
              aria-hidden="true"
            />
            <div
              className="absolute left-0 top-full mt-1 z-20 w-56 bg-card-highlight-light border border-theme-lighter rounded-sm shadow-lg py-1"
              role="menu"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleExportToGoogle();
                }}
                disabled={disabled || contacts.length === 0}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-selected-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                role="menuitem"
              >
                Export to Google Contacts
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  exportToCSV();
                }}
                disabled={disabled || contacts.length === 0}
                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-selected-active transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                role="menuitem"
              >
                Download CSV
              </button>
              {/* Helper text inside dropdown */}
              {contacts.length > 0 && (
                <div className="px-4 py-2 border-t border-theme-light mt-1">
                  <p className="text-xs text-theme-dark">
                    Applies to {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ExportToGoogleModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        contacts={contacts}
      />
    </>
  );
}

