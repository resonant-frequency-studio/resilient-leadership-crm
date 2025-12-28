"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";

interface CalendarApiEnabledErrorProps {
  errorMessage: string;
}

export default function CalendarApiEnabledError({ errorMessage }: CalendarApiEnabledErrorProps) {
  return (
    <Card padding="md" className="bg-yellow-50 border-yellow-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-theme-darkest mb-2">
            Google Calendar API Not Enabled
          </h3>
          <p className="text-theme-dark mb-4">
            The Google Calendar API needs to be enabled in your Google Cloud Console before you can sync calendar events.
          </p>
          <div className="bg-white p-3 rounded border border-yellow-300 mb-4">
            <p className="text-sm text-theme-darkest font-mono break-all">
              {errorMessage}
            </p>
          </div>
          <p className="text-sm text-theme-dark mb-4">
            <strong>To fix this:</strong>
          </p>
          <ol className="text-sm text-theme-dark list-decimal list-inside space-y-2 mb-4">
            <li>Open the Google Cloud Console</li>
            <li>Navigate to APIs & Services → Library</li>
            <li>Search for &quot;Google Calendar API&quot;</li>
            <li>Click &quot;Enable&quot;</li>
            <li>Wait a few minutes for the API to be fully enabled</li>
            <li>Refresh this page</li>
          </ol>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              // Extract the URL from the error message if present
              const urlMatch = errorMessage.match(/https:\/\/[^\s]+/);
              if (urlMatch) {
                window.open(urlMatch[0], '_blank');
              } else {
                window.open('https://console.cloud.google.com/apis/library/calendar-json.googleapis.com', '_blank');
              }
            }}
          >
            Open Google Cloud Console
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    </Card>
  );
}

