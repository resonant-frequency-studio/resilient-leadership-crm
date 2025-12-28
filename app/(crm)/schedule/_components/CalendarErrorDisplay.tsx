"use client";

import { ErrorMessage } from "@/components/ErrorMessage";
import CalendarApiEnabledError from "./CalendarErrorStates/CalendarApiEnabledError";
import CalendarReconnectError from "./CalendarErrorStates/CalendarReconnectError";
import CalendarGenericError from "./CalendarErrorStates/CalendarGenericError";

interface CalendarErrorDisplayProps {
  errorMessage: string;
  needsApiEnabled: boolean;
  needsReconnect: boolean;
}

export default function CalendarErrorDisplay({
  errorMessage,
  needsApiEnabled,
  needsReconnect,
}: CalendarErrorDisplayProps) {
  return (
    <>
      <ErrorMessage 
        message={errorMessage}
        dismissible={false}
      />
      {needsApiEnabled && (
        <CalendarApiEnabledError errorMessage={errorMessage} />
      )}
      {needsReconnect && !needsApiEnabled && (
        <CalendarReconnectError />
      )}
      {!needsReconnect && !needsApiEnabled && (
        <CalendarGenericError />
      )}
    </>
  );
}

