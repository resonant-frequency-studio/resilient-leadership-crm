"use client";

import { useState, ReactNode } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: ReactNode;
  defaultExpanded?: boolean;
  preview?: string;
  icon?: ReactNode;
}

export default function CollapsibleSection({
  title,
  children,
  defaultExpanded = false,
  preview,
  icon,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-theme-light rounded-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-theme-light transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <div className="w-5 h-5 text-theme-medium">{icon}</div>}
          <span className="text-theme-darkest font-medium">{title}</span>
          {!isExpanded && preview && (
            <span className="text-theme-dark text-sm font-normal ml-2">
              {preview}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-theme-medium transition-transform shrink-0 ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isExpanded && (
        <div className="p-3 pt-0 border-t border-theme-light">{children}</div>
      )}
    </div>
  );
}

