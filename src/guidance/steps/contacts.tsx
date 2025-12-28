"use client";

import type { StepType } from "@reactour/tour";

export const contactsSteps: StepType[] = [
  {
    selector: "#contacts-root",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Your relationship landscape
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed">
          This is a living view of the people you&apos;re connected to — across work and personal life.
          It&apos;s designed to help you stay oriented, not overwhelmed.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"contacts-focus-switcher\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Shift your lens
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed mb-2">
          Use Focus to quickly narrow your view — work, personal, or everything together.
          This changes what you&apos;re seeing, not the people themselves.
        </p>
        <p className="text-theme-darker text-xs italic opacity-75">
          Focus helps reduce noise without losing context.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"contacts-row-example\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          How relationships are organized
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed mb-2">
          Each contact has one primary relationship type — like Client, Colleague, or Personal.
          Tags add flexible context: topics, projects, history, or shared interests.
        </p>
        <p className="text-theme-darker text-xs italic opacity-75">
          One relationship. Many dimensions.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"contacts-filters\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Find people by timing, not memory
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed">
          Filters let you surface relationships by recency — including people you haven&apos;t emailed yet.
          You don&apos;t have to remember who&apos;s gone quiet. The system keeps track.
        </p>
      </div>
    ),
    position: "bottom",
  },
  {
    selector: "[data-tour=\"contacts-row-example\"]",
    content: (
      <div>
        <h3 className="text-lg font-semibold text-theme-darkest mb-2">
          Each row tells a story
        </h3>
        <p className="text-theme-darker text-sm leading-relaxed">
          At a glance, you can see relationship type, recent activity, and context.
          Click into any contact to see conversations, insights, and what might come next.
        </p>
      </div>
    ),
    position: "bottom",
  },
];

