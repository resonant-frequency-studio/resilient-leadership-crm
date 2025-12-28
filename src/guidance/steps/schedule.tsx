"use client";

import type { StepType } from "@reactour/tour";

export const scheduleSteps: StepType[] = [
  {
    selector: "#schedule-root",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Plan with clarity, not clutter
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed">
          This is your relationship-aware schedule — sessions, follow-ups, and focus time in one place.
          It&apos;s designed to help you see why something is on your calendar, not just when.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"schedule-calendar-grid\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Time with context
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed mb-2">
          Events connected to people carry their relationship context with them — so follow-ups and preparation stay connected to the right conversations.
          You don&apos;t have to remember everything. The system helps.
        </p>
        <p className="text-theme-darker text-xs italic opacity-75">
          Client-linked events include notes, history, and next steps.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"schedule-filters\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Find what matters right now
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed">
          Use groups, tags, and filters to narrow your view — whether you&apos;re focusing on clients, follow-ups, or a specific relationship context.
          The schedule adapts to your attention, not the other way around.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"schedule-add-time-block\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Make space on purpose
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed">
          Time blocks let you protect focus, preparation, or recovery — even when nothing is scheduled yet.
          Not every important moment starts with a meeting.
        </p>
      </div>
    ),
    position: "right",
  },
];

