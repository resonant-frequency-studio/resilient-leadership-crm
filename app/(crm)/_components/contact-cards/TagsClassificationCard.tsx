"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useContact } from "@/hooks/useContact";
import { useUpdateContact } from "@/hooks/useContactMutations";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import Card from "@/components/Card";
import SavingIndicator from "./SavingIndicator";
import SegmentSelect from "../SegmentSelect";
import { reportException } from "@/lib/error-reporting";
import { Button } from "@/components/Button";
import { Contact } from "@/types/firestore";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface TagsClassificationCardProps {
  contactId: string;
  userId: string;
  uniqueSegments?: string[];
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

export default function TagsClassificationCard({
  contactId,
  userId,
  uniqueSegments = [],
}: TagsClassificationCardProps) {
  const { data: contact } = useContact(userId, contactId);
  const updateMutation = useUpdateContact(userId);
  
  const prevContactIdRef = useRef<Contact | null>(null);
  
  // Initialize form state from contact using lazy initialization
  const [tags, setTags] = useState<string[]>([]);
  const [segment, setSegment] = useState<string | null>(null);
  const [leadSource, setLeadSource] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  
  // Reset form state when contactId changes (different contact loaded)
  // Using contactId prop as dependency ensures we only update when switching contacts
  useEffect(() => {
    if (!contact) return;
    if (prevContactIdRef.current !== contact) {
      prevContactIdRef.current = contact;
      // Batch state updates to avoid cascading renders
      setTags(contact.tags ?? []);
      setSegment(contact.segment ?? null);
      setLeadSource(contact.leadSource ?? "");
      setSaveStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact?.contactId, contact?.updatedAt]);

  // Track changes using useMemo instead of useEffect
  const hasUnsavedChanges = useMemo(() => {
    if (!contact) return false;
    const tagsChanged =
      JSON.stringify([...tags].sort()) !== JSON.stringify([...(contact.tags ?? [])].sort());
    const segmentChanged = segment !== (contact.segment ?? null);
    const leadSourceChanged = leadSource !== (contact.leadSource ?? "");
    return tagsChanged || segmentChanged || leadSourceChanged;
  }, [tags, segment, leadSource, contact]);

  const saveChanges = () => {
    if (!hasUnsavedChanges || !contact) return;

    setSaveStatus("saving");
    updateMutation.mutate(
      {
        contactId,
        updates: {
          tags: tags.length > 0 ? tags : [],
          segment: segment || null,
          leadSource: leadSource || null,
        },
      },
      {
        onSuccess: () => {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        },
        onError: (error) => {
          setSaveStatus("error");
          reportException(error, {
            context: "Saving tags & classification in TagsClassificationCard",
            tags: { component: "TagsClassificationCard", contactId },
          });
          setTimeout(() => setSaveStatus("idle"), 3000);
        },
      }
    );
  };

  const debouncedSave = useDebouncedSave(saveChanges, 500);

  const handleBlur = () => {
    if (hasUnsavedChanges) {
      debouncedSave();
    }
  };

  if (!contact) {
    return (
      <Card padding="md">
        <div className="h-48 bg-gray-200 rounded animate-pulse" />
      </Card>
    );
  }

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
          Tags & Classification
        </h2>
        <SavingIndicator status={saveStatus} />
      </div>
      <div className="space-y-4">
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
            Tags
            <InfoPopover content="Tags are labels you can assign to contacts to organize and categorize them. Use tags to group contacts by characteristics like industry, role, project, or any custom classification that helps you manage your relationships.">
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
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
              )
            }
            onBlur={handleBlur}
            placeholder="tag1, tag2, tag3"
          />
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              Segment
              <InfoPopover content="A segment categorizes contacts into distinct groups based on shared characteristics such as company size, industry, customer type, or market segment. This helps you tailor your communication and sales strategies to different groups.">
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
            <div onBlur={handleBlur}>
              <SegmentSelect
                value={segment}
                onChange={(value) => setSegment(value)}
                existingSegments={uniqueSegments}
                placeholder="Enter or select segment..."
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-2">
              Lead Source
              <InfoPopover content="The original source or channel where this contact was first acquired. This helps track which marketing channels or referral sources are most effective for your business.">
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
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value)}
              onBlur={handleBlur}
              placeholder="Enter lead source..."
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

