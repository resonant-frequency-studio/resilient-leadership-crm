"use client";

import { Button } from "@/components/Button";
import Link from "next/link";

interface ImportProgressSectionProps {
  isChecking: boolean;
  isImporting: boolean;
  isProcessing: boolean;
  status: string;
  hasError: boolean;
  isSuccess: boolean;
  importState: {
    importCount: number;
    progress?: { total: number; errors?: number };
    errorDetails: string[];
  };
  onCancel?: () => void;
  onImportMore?: () => void;
}

export default function ImportProgressSection({
  isChecking,
  isImporting,
  isProcessing,
  status,
  hasError,
  isSuccess,
  importState,
  onCancel,
  onImportMore,
}: ImportProgressSectionProps) {
  return (
    <>
      {/* Progress Bar - Checking for existing contacts */}
      {isChecking && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-theme-darker">Checking for existing contacts</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div className="bg-blue-600 h-2.5 rounded-full animate-progress-bar relative"></div>
          </div>
        </div>
      )}

      {/* Progress Bar - Import Progress */}
      {isImporting && importState.progress && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-theme-darker">Import Progress</span>
            <span className="text-sm text-gray-500">
              {importState.importCount} / {importState.progress.total}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${((importState.importCount + (importState.progress.errors || 0)) / importState.progress.total) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Warning Message - Don't refresh or navigate away */}
      {isProcessing && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-sm">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-amber-600 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-medium text-amber-800 mb-1">Please do not refresh or navigate away</p>
              <p className="text-sm text-amber-700">
                {isChecking
                  ? "We're checking your existing contacts. This process will be interrupted if you leave this page."
                  : "The import is in progress. Refreshing or navigating away will cancel the import and you'll need to start over."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {status && (
        <div
          className={`mt-6 p-4 rounded-sm ${
            hasError
              ? "bg-red-50 border border-red-200"
              : isSuccess
              ? "bg-green-50 border border-green-200"
              : "bg-blue-50 border border-blue-200"
          }`}
        >
          <div className="flex items-start gap-3">
            {isImporting ? (
              <svg
                className="animate-spin h-5 w-5 text-blue-600 mt-0.5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : hasError ? (
              <svg
                className="w-5 h-5 text-red-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-green-600 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <div className="flex-1">
              <p
                className={`font-medium ${
                  hasError
                    ? "text-red-800"
                    : isSuccess
                    ? "text-green-800"
                    : "text-blue-800"
                }`}
              >
                {status}
              </p>
              {isImporting && importState.importCount > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  Processed {importState.importCount} of {importState.progress?.total || "?"} contacts...
                </p>
              )}
              {importState.errorDetails.length > 0 && (
                <details className="mt-2 text-sm">
                  <summary className="cursor-pointer text-red-600 hover:text-red-800 font-medium">
                    View {importState.errorDetails.length} error
                    {importState.errorDetails.length > 1 ? "s" : ""}
                  </summary>
                  <ul className="mt-2 space-y-1 text-red-700 max-h-40 overflow-y-auto pl-4">
                    {importState.errorDetails.map((err, idx) => (
                      <li key={idx} className="text-xs list-disc">
                        {err}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
              {isSuccess && importState.progress && (
                <div className="mt-3 flex gap-3">
                  <Link href="/contacts">
                    <Button variant="primary" size="sm">
                      View Contacts
                    </Button>
                  </Link>
                  {onImportMore && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={onImportMore}
                    >
                      Import More
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel button if importing */}
      {isImporting && onCancel && (
        <div className="mt-4 text-center">
          <Button
            onClick={onCancel}
            variant="link"
            size="sm"
          >
            Cancel Import
          </Button>
        </div>
      )}
    </>
  );
}

