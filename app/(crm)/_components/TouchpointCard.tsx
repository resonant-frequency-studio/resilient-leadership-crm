"use client";

import Link from "next/link";
import { Contact } from "@/types/firestore";
import { getDisplayName, formatContactDate } from "@/util/contact-utils";
import TouchpointStatusActions from "./TouchpointStatusActions";
import Avatar from "@/components/Avatar";
import { isOwnerContact } from "@/lib/contacts/owner-utils";
import { useAuth } from "@/hooks/useAuth";

interface ContactWithId extends Contact {
  id: string;
}

interface TouchpointCardProps {
  contact: ContactWithId;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onSelectChange?: (contactId: string) => void;
  variant: "touchpoint-upcoming" | "touchpoint-overdue";
  touchpointDate: Date | null;
  daysUntil: number | null;
  needsReminder?: boolean;
  showTouchpointActions?: boolean;
  onTouchpointStatusUpdate?: () => void;
  userId: string;
}

export default function TouchpointCard({
  contact,
  showCheckbox = false,
  isSelected = false,
  onSelectChange,
  variant,
  touchpointDate,
  daysUntil,
  needsReminder = false,
  showTouchpointActions = false,
  onTouchpointStatusUpdate,
  userId,
}: TouchpointCardProps) {
  const { user } = useAuth();
  const isCurrentUserOwner = isOwnerContact(user?.email || null, contact.primaryEmail);

  const getVariantStyles = () => {
    if (isSelected) return "ring-2 ring-blue-500 bg-card-active";
    
    if (variant === "touchpoint-upcoming") {
      return needsReminder ? "border border-theme-light border-l-4" : "border border-theme-light";
    }
    return "border border-theme-light border-l-4";
  };

  const formatTouchpointDate = () => {
    if (!touchpointDate || daysUntil === null || daysUntil === undefined) return null;
    
    if (variant === "touchpoint-overdue") {
      return "Ready for follow-up";
    }
    
    if (daysUntil === 0) return "Today";
    if (daysUntil === 1) return "Tomorrow";
    return formatContactDate(touchpointDate, { relative: true });
  };

  const getBorderLeftStyle = () => {
    if (variant === "touchpoint-overdue") {
      return { borderLeftColor: "var(--card-overdue-dark)", borderLeftWidth: "4px" };
    }
    if (variant === "touchpoint-upcoming" && needsReminder) {
      return { borderLeftColor: "var(--card-upcoming-dark)", borderLeftWidth: "4px" };
    }
    return {};
  };

  return (
    <div
      className={`rounded-sm p-3 sm:p-4 transition-all duration-200 ${getVariantStyles()} relative`}
      style={getBorderLeftStyle()}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Checkbox */}
        {showCheckbox && (
          <label className="flex items-center pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectChange?.(contact.id)}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </label>
        )}

        {/* Contact Card Content */}
        <div className="flex-1 min-w-0 flex items-start xl:items-stretch gap-2 sm:gap-3">
          {/* Left Column - Clickable Link Area */}
          <Link
            href={`/contacts/${contact.id}`}
            className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0 xl:flex-[1_1_60%] xl:max-w-[60%] group"
          >
            {/* Avatar */}
            <div className="shrink-0">
              <Avatar contact={contact} size="md" />
            </div>

            {/* Contact Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col xxl:flex-row items-start justify-between gap-1.5 sm:gap-2 mb-1">
                <div className="flex-1 min-w-0 flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold group-hover:text-theme-darker transition-colors text-theme-darkest wrap-break-word">
                    {getDisplayName(contact)}
                  </h3>
                  {isCurrentUserOwner && (
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-sm whitespace-nowrap border-2 text-card-tag-text border-card-tag">
                      Owner
                    </span>
                  )}
                  {contact.company && (
                    <p className="text-xs text-theme-dark mt-0.5 wrap-break-word">
                      {contact.company}
                    </p>
                  )}
                </div>
                {/* Touchpoint Date Badges */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 flex-wrap">
                  {variant === "touchpoint-upcoming" && needsReminder && (
                    <span className="px-2 py-1 text-xs font-medium text-theme-darker border border-theme-medium rounded-sm whitespace-nowrap">
                      Due Soon
                    </span>
                  )}
                  {variant === "touchpoint-overdue" && (
                    <span className="px-2 py-1 text-xs font-medium text-theme-darker border border-theme-medium rounded-sm whitespace-nowrap">
                      Worth revisiting
                    </span>
                  )}
                  {formatTouchpointDate() && (
                    <span className="text-xs font-medium px-2 py-1 rounded-sm whitespace-nowrap text-theme-darker border border-theme-medium">
                      {formatTouchpointDate()}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs truncate mb-2 text-theme-dark">
                {contact.primaryEmail}
              </p>
            </div>
          </Link>

          {/* Vertical Divider - Desktop only */}
          <div className="hidden xl:flex items-stretch shrink-0 px-2">
            <div className="w-px bg-theme-light/30 my-2" />
          </div>

          {/* Right Column - Segment only (Desktop) */}
          <div className="hidden xl:flex flex-col items-end gap-2 shrink-0 ml-auto">
            <div className="flex items-center gap-2">
              {contact.segment && (
                <span className="px-2 py-1 text-xs font-medium text-theme-darkest rounded whitespace-nowrap border border-theme-dark">
                  {contact.segment}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Touchpoint Message - Outside Link to span full width */}
      {contact.nextTouchpointMessage && (
        <div className="mt-2 sm:mt-2 mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm rounded px-2 sm:px-2.5 py-1.5 sm:py-2 line-clamp-2 sm:line-clamp-none w-full block wrap-break-word">
            {contact.nextTouchpointMessage}
          </p>
        </div>
      )}

      {/* Touchpoint Status Actions */}
      {showTouchpointActions && (
        <div className={`pt-2 sm:pt-3 border-t ${
          variant === "touchpoint-overdue"
            ? "border-red-200"
            : needsReminder
            ? "border-amber-200"
            : "border-gray-200"
        }`}>
          <TouchpointStatusActions
            contactId={contact.id}
            contactName={getDisplayName(contact)}
            userId={userId}
            currentStatus={contact.touchpointStatus}
            compact={true}
            onStatusUpdate={onTouchpointStatusUpdate}
          />
        </div>
      )}
    </div>
  );
}

