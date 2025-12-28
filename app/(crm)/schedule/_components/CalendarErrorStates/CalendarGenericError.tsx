"use client";

import { Button } from "@/components/Button";

export default function CalendarGenericError() {
  return (
    <Button onClick={() => window.location.reload()}>Retry</Button>
  );
}

