"use client";

import { useState } from "react";
import { useContact } from "@/hooks/useContact";
import Card from "@/components/Card";
import ActionItemsList from "../ActionItemsList";
import { formatContactDate } from "@/util/contact-utils";
import { Button } from "@/components/Button";
import type { ActionItem, Contact } from "@/types/firestore";

interface ContactInsightsCardProps {
  contactId: string;
  userId: string;
  initialActionItems?: ActionItem[];
  initialContact?: Contact;
}

function InfoPopover({ content, children }: { content: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <Button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="sm"
        className="inline-flex items-center justify-center w-4 h-4 p-0 text-gray-400 hover:text-gray-600"
      >
        {children}
      </Button>
      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-white border border-gray-200 text-gray-900 text-[14px] rounded-lg shadow-xl z-50">
          <p className="leading-relaxed lowercase">{content}</p>
          <div className="absolute left-4 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
          <div className="absolute left-4 top-full -mt-px w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
        </div>
      )}
    </div>
  );
}

export default function ContactInsightsCard({
  contactId,
  userId,
  initialActionItems,
  initialContact,
}: ContactInsightsCardProps) {
  const { data: contact } = useContact(userId, contactId);
  const displayContact = contact || initialContact;

  if (!displayContact) {
    return (
      <Card padding="md">
        <div className="h-96 bg-gray-200 rounded animate-pulse" />
      </Card>
    );
  }

  return (
    <Card padding="md">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Insights</h2>
      <div className="space-y-6">
        {/* Quick Info Section */}
        {displayContact.summary && (
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              AI Summary
            </label>
            <div className="px-3 py-2 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              {displayContact.summary}
            </div>
          </div>
        )}
        {(() => {
          const engagementScore = Number(displayContact.engagementScore);
          const isValidScore =
            !isNaN(engagementScore) &&
            engagementScore !== null &&
            engagementScore !== undefined;
          return isValidScore ? (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Engagement Score
                <InfoPopover content="A numerical score (0-100) that measures how actively engaged this contact is with your communications. Higher scores indicate more frequent interactions, email opens, responses, and overall engagement with your content.">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </InfoPopover>
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(engagementScore, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(engagementScore)}
                </span>
              </div>
            </div>
          ) : null;
        })()}
        {displayContact.threadCount && displayContact.threadCount > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Email Threads
            </label>
            <p className="text-sm font-medium text-gray-900">
              {displayContact.threadCount}
            </p>
          </div>
        )}

        {/* Insights Section */}
        {displayContact.lastEmailDate != null && (
          <div className="border-t border-gray-200 pt-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex items-center gap-2 mb-1">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Last Email Date
                </h3>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {formatContactDate(displayContact.lastEmailDate, { relative: true })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatContactDate(displayContact.lastEmailDate, { includeTime: true })}
              </p>
            </div>
          </div>
        )}

        {displayContact.sentiment && (
          <div className="border-l-4 border-purple-500 pl-4">
            <div className="flex items-center gap-2 mb-1">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Sentiment
              </h3>
            </div>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                displayContact.sentiment.toLowerCase().includes("positive")
                  ? "bg-green-100 text-green-800"
                  : displayContact.sentiment.toLowerCase().includes("negative")
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {displayContact.sentiment}
            </span>
          </div>
        )}

        {/* Action Items Section */}
        <div className="border-l-4 border-amber-500 pl-4">
          <div className="flex items-center gap-2 mb-3">
            <svg
              className="w-4 h-4 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Action Items
            </h3>
          </div>
          <ActionItemsList
            userId={userId}
            contactId={contactId}
            contactName={
              displayContact.firstName || displayContact.lastName
                ? `${displayContact.firstName || ""} ${displayContact.lastName || ""}`.trim()
                : displayContact.primaryEmail.split("@")[0]
            }
            contactEmail={displayContact.primaryEmail}
            contactFirstName={displayContact.firstName || undefined}
            contactLastName={displayContact.lastName || undefined}
            onActionItemUpdate={() => {
              // Trigger a refresh if needed
            }}
            initialActionItems={initialActionItems}
            initialContact={displayContact}
          />
        </div>

        {displayContact.painPoints && (
          <div className="border-l-4 border-red-500 pl-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Pain Points
              </h3>
            </div>
            <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
              {displayContact.painPoints}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

