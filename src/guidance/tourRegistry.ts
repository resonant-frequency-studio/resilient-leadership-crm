import type { RouteKey } from "./routes";
import { dashboardSteps } from "./steps/dashboard";
import { insightsSteps } from "./steps/insights";
import { scheduleSteps } from "./steps/schedule";
import { contactsSteps } from "./steps/contacts";
import type { StepType } from "@reactour/tour";

export type TourStep = StepType;

export const TOUR_STEPS: Record<RouteKey, TourStep[]> = {
  dashboard: dashboardSteps,
  schedule: scheduleSteps,
  contacts: contactsSteps,
  contact_detail: [],
  insights: insightsSteps,
  action_items: [],
  sync: [],
  faq: [],
};

