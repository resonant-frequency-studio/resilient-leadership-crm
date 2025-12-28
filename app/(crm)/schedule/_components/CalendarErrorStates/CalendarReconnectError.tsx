"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";

export default function CalendarReconnectError() {
  return (
    <Card padding="md" className="bg-blue-50 border-blue-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-theme-darkest mb-2">
            Calendar Access Required
          </h3>
          <p className="text-theme-dark mb-4">
            Your Google account needs to be reconnected with Calendar permissions to view your events.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    </Card>
  );
}

