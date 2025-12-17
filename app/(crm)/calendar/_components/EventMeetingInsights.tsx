"use client";

import { CalendarEvent, Contact } from "@/types/firestore";
import { EventContext } from "@/hooks/useCalendarEvents";
import { useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useCreateActionItem } from "@/hooks/useActionItemMutations";

interface EventMeetingInsightsProps {
  event: CalendarEvent;
  linkedContact: Contact | null;
  aiContext: EventContext | null;
  isGenerating: boolean;
  error: Error | null;
  onGenerate: () => void;
  onClose: () => void;
}

export default function EventMeetingInsights({
  event,
  linkedContact,
  aiContext,
  isGenerating,
  error,
  onGenerate,
  onClose,
}: EventMeetingInsightsProps) {
  const router = useRouter();
  const createActionItemMutation = useCreateActionItem();
  const [hasExpanded, setHasExpanded] = useState(false);

  const handleExpand = () => {
    if (!hasExpanded && !aiContext) {
      onGenerate();
    }
    setHasExpanded(true);
  };

  const handleDraftEmail = () => {
    if (aiContext?.followUpEmailDraft && linkedContact?.primaryEmail) {
      const subject = encodeURIComponent(`Follow-up: ${event.title}`);
      const body = encodeURIComponent(aiContext.followUpEmailDraft);
      window.open(
        `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(linkedContact.primaryEmail)}&su=${subject}&body=${body}`,
        "_blank"
      );
    }
  };

  const handleCreateFollowUp = () => {
    if (aiContext?.suggestedTouchpointDate && event.matchedContactId) {
      router.push(`/contacts/${event.matchedContactId}?touchpointDate=${aiContext.suggestedTouchpointDate}`);
      onClose();
    }
  };

  const handleSaveToNotes = async () => {
    if (!aiContext || !linkedContact) return;
    
    // Save summary to contact notes
    try {
      const response = await fetch(`/api/contacts/${linkedContact.contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          notes: aiContext.summary,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save to notes");
      }

      // Show success feedback (could use toast here)
      alert("Saved to contact notes");
    } catch (error) {
      console.error("Failed to save to notes:", error);
      alert("Failed to save to notes");
    }
  };

  const insightsIcon = (
    <svg
      className="w-5 h-5 text-theme-medium"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );

  return (
    <CollapsibleSection
      title="Meeting Insights"
      defaultExpanded={false}
      icon={insightsIcon}
      preview={aiContext ? "Summary & next steps available" : undefined}
    >
      <div>
        {isGenerating && (
          <div className="flex items-center gap-2 text-theme-dark text-sm py-4">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Generating insights...</span>
          </div>
        )}
        {error && (
          <div className="space-y-2">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error.message || "Failed to generate insights"}
            </p>
            <Button
              onClick={onGenerate}
              variant="outline"
              size="sm"
            >
              Retry
            </Button>
          </div>
        )}
        {aiContext && (
          <div className="space-y-4">
            {/* Summary - restructured as "What we discussed" */}
            <div>
              <h5 className="text-theme-darkest font-medium text-sm mb-1">What we discussed</h5>
              <p className="text-theme-dark text-sm whitespace-pre-line">
                {aiContext.summary}
              </p>
            </div>

            {/* Suggested Next Step */}
            <div>
              <h5 className="text-theme-darkest font-medium text-sm mb-1">Suggested next step</h5>
              <p className="text-theme-dark text-sm">
                {aiContext.suggestedNextStep}
              </p>
            </div>

            {/* Open loops - from suggested action items */}
            {aiContext.suggestedActionItems && aiContext.suggestedActionItems.length > 0 && (
              <div>
                <h5 className="text-theme-darkest font-medium text-sm mb-2">Open loops</h5>
                <ul className="list-disc list-inside space-y-1 mb-3">
                  {aiContext.suggestedActionItems.map((item: string, idx: number) => (
                    <li key={idx} className="text-theme-dark text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
                {event.matchedContactId && (
                  <div className="flex flex-wrap gap-2">
                    {aiContext.suggestedActionItems.map((item: string, idx: number) => (
                      <Button
                        key={idx}
                        onClick={() => {
                          if (event.matchedContactId) {
                            createActionItemMutation.mutate({
                              contactId: event.matchedContactId,
                              text: item,
                            });
                          }
                        }}
                        variant="outline"
                        size="sm"
                        disabled={!event.matchedContactId || createActionItemMutation.isPending}
                      >
                        Add &quot;{item.substring(0, 30)}{item.length > 30 ? "..." : ""}&quot;
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="border-t border-theme-light pt-3 space-y-2">
              {aiContext.followUpEmailDraft && linkedContact?.primaryEmail && (
                <Button
                  onClick={handleDraftEmail}
                  variant="primary"
                  size="sm"
                  fullWidth
                >
                  Use to draft email
                </Button>
              )}
              {aiContext.suggestedTouchpointDate && event.matchedContactId && (
                <Button
                  onClick={handleCreateFollowUp}
                  variant="primary"
                  size="sm"
                  fullWidth
                >
                  Create follow-up
                </Button>
              )}
              {linkedContact && (
                <Button
                  onClick={handleSaveToNotes}
                  variant="outline"
                  size="sm"
                  fullWidth
                >
                  Save to notes
                </Button>
              )}
            </div>

            <div className="border-t border-theme-light pt-3">
              <Button
                onClick={onGenerate}
                variant="outline"
                size="sm"
                disabled={isGenerating}
                fullWidth
              >
                Regenerate
              </Button>
            </div>
          </div>
        )}
        {!aiContext && !isGenerating && !error && (
          <div className="text-center py-4">
            <Button
              onClick={handleExpand}
              variant="outline"
              size="sm"
            >
              Generate Insights
            </Button>
          </div>
        )}
      </div>
    </CollapsibleSection>
  );
}

