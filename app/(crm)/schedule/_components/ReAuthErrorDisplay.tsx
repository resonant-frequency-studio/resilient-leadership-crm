"use client";

interface ReAuthErrorDisplayProps {
  message?: string;
}

export default function ReAuthErrorDisplay({
  message = "Calendar write access is not granted. Please reconnect your Google account with Calendar write permissions.",
}: ReAuthErrorDisplayProps) {
  return (
    <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm">
      <p className="text-sm text-amber-800 mb-3">
        {message}
      </p>
    </div>
  );
}

