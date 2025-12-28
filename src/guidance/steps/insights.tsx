"use client";

import type { StepType } from "@reactour/tour";

export const insightsSteps: StepType[] = [
  {
    selector: "#insights-root",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          A snapshot of your relationships
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed">
          This page highlights patterns across your relationships — where connection is strong, where it&apos;s quiet, and where a conversation may need care.
          There&apos;s nothing here you have to do. It&apos;s meant to support reflection and intention.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"insights-suggested-focus\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Where attention may matter most
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed mb-2">
          These suggestions are based on recent activity — things like quiet stretches or conversations with unresolved tone.
          Think of this as a gentle nudge, not a priority list.
        </p>
        <p className="text-theme-darker text-xs italic opacity-75">
          Generated from recent communication patterns.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"insights-sentiment-alerts\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Moments worth revisiting
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed mb-2">
          These conversations include signals like negative sentiment or abrupt endings.
          You may choose to follow up — or simply acknowledge and move on.
        </p>
        <p className="text-theme-darker text-xs italic opacity-75">
          Context matters more than scores.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"insights-engagement\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Patterns over time
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed mb-2">
          • Quiet relationships show where connection has slowed
        </p>
        <p className="text-theme-darker text-sm leading-relaxed mb-2">
          • Positive momentum highlights where engagement is naturally growing
        </p>
        <p className="text-theme-darker text-sm leading-relaxed">
          Neither is good or bad — they help you notice balance.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"insights-background-awareness\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Optional context, always yours to use
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed">
          Some insights are shared simply for awareness. They don&apos;t require action and won&apos;t surface elsewhere unless you choose.
          You&apos;re in control of what matters.
        </p>
      </div>
    ),
    position: "top",
  },
];

