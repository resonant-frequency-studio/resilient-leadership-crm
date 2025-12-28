"use client";

import { useState, useCallback } from "react";
import { CreateEventInput } from "@/hooks/useCalendarEvents";

export function useEventFormValidation() {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback((formData: CreateEventInput): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title || formData.title.trim() === "") {
      errors.title = "Title is required";
    }

    if (!formData.startTime) {
      errors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      errors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (start >= end) {
        errors.endTime = "End time must be after start time";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setFormErrors({});
  }, []);

  return {
    formErrors,
    validateForm,
    clearErrors,
  };
}

