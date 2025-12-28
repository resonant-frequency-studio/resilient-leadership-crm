"use client";

import { useState, useMemo } from "react";
import { useContactImportPage } from "@/hooks/useContactImportPage";
import { useContactsSyncJob } from "@/hooks/useContactsSyncJob";
import { useAuth } from "@/hooks/useAuth";
import { useSyncStatus } from "@/hooks/useSyncStatus";
import Card from "@/components/Card";
import Loading from "@/components/Loading";
import { Button } from "@/components/Button";
import { extractErrorMessage } from "@/components/ErrorMessage";
import { reportException } from "@/lib/error-reporting";
import FileUploadSection from "./_components/FileUploadSection";
import ImportProgressSection from "./_components/ImportProgressSection";
import GoogleContactsSyncSection from "./_components/GoogleContactsSyncSection";
import OverwriteModeModal from "./_components/OverwriteModeModal";

export default function ImportContactsPage() {
  const {
    user,
    loading,
    fileInputRef,
    showOverwriteModal,
    handleCancelModal,
    existingContactsCount,
    overwriteMode,
    setOverwriteMode,
    isParsing,
    csvStatus,
    parseError,
    importState,
    handleUpload,
    handleStartImport,
    cancel,
  } = useContactImportPage();

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [syncingGoogleContacts, setSyncingGoogleContacts] = useState(false);
  const [googleContactsError, setGoogleContactsError] = useState<string | null>(null);
  const [currentGoogleContactsSyncJobId, setCurrentGoogleContactsSyncJobId] = useState<string | null>(null);
  const { user: authUser } = useAuth();

  // Track the current Google Contacts sync job if one is running
  const { syncJob: googleContactsSyncJob } = useContactsSyncJob(
    authUser?.uid || null,
    currentGoogleContactsSyncJobId
  );

  // Get sync status to check for recent automatic syncs
  const { syncHistory } = useSyncStatus(authUser?.uid || null);
  
  // Find the most recent contacts sync job
  const lastContactsSync = useMemo(() => {
    return syncHistory.find(job => job.service === "contacts") || null;
  }, [syncHistory]);

  // Format last sync time
  const formatLastSyncTime = (syncJob: typeof lastContactsSync) => {
    if (!syncJob?.startedAt) return null;
    
    let syncDate: Date;
    if (typeof syncJob.startedAt === 'string') {
      syncDate = new Date(syncJob.startedAt);
    } else if (syncJob.startedAt && typeof syncJob.startedAt === 'object' && 'toDate' in syncJob.startedAt) {
      // Firestore Timestamp
      syncDate = (syncJob.startedAt as { toDate: () => Date }).toDate();
    } else if (syncJob.startedAt instanceof Date) {
      syncDate = syncJob.startedAt;
    } else {
      return null;
    }
    
    if (isNaN(syncDate.getTime())) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - syncDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "less than an hour ago";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return "yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return syncDate.toLocaleDateString();
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) return null;

  // Determine the status message to display
  const status = csvStatus || importState.status;
  const isImporting = importState.isImporting || isParsing;
  const hasError = Boolean(parseError || importState.status.includes("Error"));
  const isSuccess = status.includes("complete") || status.includes("Successfully");
  const isChecking = status.includes("Checking for existing contacts");
  const isProcessing = isImporting || isChecking || isParsing;

  // Enhanced upload handler to capture file info
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const handleUploadWithInfo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setFileSize(formatFileSize(file.size));
    } else {
      setSelectedFileName(null);
      setFileSize(null);
    }
    handleUpload(e);
  };

  // Reset file info when modal is cancelled
  const handleCancelModalWithReset = () => {
    setSelectedFileName(null);
    setFileSize(null);
    handleCancelModal();
  };

  // Handle Google Contacts sync
  const handleGoogleContactsSync = async () => {
    setSyncingGoogleContacts(true);
    setGoogleContactsError(null);
    setCurrentGoogleContactsSyncJobId(null);

    try {
      const response = await fetch("/api/contacts/sync");

      if (!response.ok) {
        let errorMessage = `Import failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        const text = await response.text();
        if (!text || text.trim() === "") {
          throw new Error("Empty response from server");
        }
        data = JSON.parse(text);
      } catch (parseError) {
        if (parseError instanceof SyntaxError) {
          throw new Error("Invalid response from server. Please try again.");
        }
        throw parseError;
      }

      if (!data.ok) {
        const errorMessage = data.error || "Import failed";
        throw new Error(errorMessage);
      }

      setCurrentGoogleContactsSyncJobId(data.syncJobId);
      setSyncingGoogleContacts(false);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      setGoogleContactsError(errorMessage);
      reportException(error, {
        context: "Google Contacts import error",
        tags: { component: "ImportContactsPage" },
      });
      setSyncingGoogleContacts(false);
    }
  };

  // Download sample CSV
  const downloadSampleCsv = () => {
    const sampleData = [
      ["Email", "FirstName", "LastName", "Segment", "LeadSource", "Tags", "Notes"],
      ["john.doe@example.com", "John", "Doe", "Active Client", "Website", "VIP, Priority", "Interested in premium services"],
      ["jane.smith@example.com", "Jane", "Smith", "Prospect", "Referral", "Follow-up", "Referred by John Doe"],
    ];
    const csvContent = sampleData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-contacts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-bold text-theme-darkest mb-2">Import Contacts</h1>
        <p className="text-theme-dark text-lg">
          Upload a CSV file or import directly from Google Contacts
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* CSV Format Guide - Top on mobile, Right on desktop */}
        <div className="xl:col-span-1 space-y-6 order-1 xl:order-2">
          <Card padding="md">
            <h3 className="text-lg font-semibold text-theme-darkest mb-2">CSV Format Guide</h3>
            <p className="text-sm text-theme-dark mb-4">
              Download a sample CSV template or review the required format below.
            </p>
            <Button
              onClick={downloadSampleCsv}
              variant="outline"
              size="sm"
              fullWidth
              className="mb-4"
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Download Sample CSV
            </Button>
            <div className="space-y-3 text-sm text-theme-dark">
              <div>
                <p className="font-medium text-theme-darkest mb-2">Required columns:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">Email</code> - Contact email address
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-theme-darkest mt-4 mb-2">Optional columns:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">FirstName</code>,{" "}
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">LastName</code>
                  </li>
                  <li>
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">Summary</code>,{" "}
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">Notes</code>,{" "}
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">Tags</code>
                  </li>
                  <li>
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">Segment</code>,{" "}
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">LeadSource</code>,{" "}
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">EngagementScore</code>
                  </li>
                  <li>
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">NextTouchpointDate</code>,{" "}
                    <code className="bg-theme-light text-foreground px-1.5 py-0.5 rounded text-xs font-mono">NextTouchpointMessage</code>
                  </li>
                  <li className="text-xs text-theme-darker mt-2">And other CRM fields as needed</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Upload Card - Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-6 order-2 xl:order-1">
      <Card padding="lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-theme-darkest mb-2">CSV File Upload</h2>
          <p className="text-sm text-gray-500 mb-4">
                Or upload a CSV file with contact information. The file should include columns like
                Email, FirstName, LastName, and other CRM fields.
          </p>
          
          {/* People API Enrichment Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-sm">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-1">
                  Automatic Enrichment
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Contacts imported without FirstName, LastName, Company, or profile photo will be automatically enriched using Google People API.
                </p>
              </div>
            </div>
          </div>
        </div>

        <FileUploadSection
          fileInputRef={fileInputRef}
          onFileSelect={handleUploadWithInfo}
          isImporting={isImporting}
          selectedFileName={selectedFileName}
          fileSize={fileSize}
        />

        <ImportProgressSection
          isChecking={isChecking}
          isImporting={isImporting}
          isProcessing={isProcessing}
          status={status}
          hasError={hasError}
          isSuccess={isSuccess}
          importState={{
            importCount: importState.importCount,
            progress: importState.progress ? {
              total: importState.progress.total,
              errors: importState.progress.errors,
            } : undefined,
            errorDetails: importState.errorDetails,
          }}
          onCancel={cancel}
          onImportMore={() => {
            setSelectedFileName(null);
            setFileSize(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
            }
          }}
        />
      </Card>
        </div>
      </div>

      {/* Google Contacts Import Option - Moved below CSV, less prominent since automatic sync is active */}
      <GoogleContactsSyncSection
        lastContactsSync={lastContactsSync}
        formatLastSyncTime={formatLastSyncTime}
        onSync={handleGoogleContactsSync}
        syncing={syncingGoogleContacts}
        error={googleContactsError}
        syncJob={googleContactsSyncJob}
        isImporting={isImporting}
        onDismissError={() => setGoogleContactsError(null)}
        onDismissJob={() => setCurrentGoogleContactsSyncJobId(null)}
      />

      {/* Overwrite Modal */}
      <OverwriteModeModal
        isOpen={showOverwriteModal}
        onClose={handleCancelModalWithReset}
        existingContactsCount={existingContactsCount}
        overwriteMode={overwriteMode}
        onOverwriteModeChange={setOverwriteMode}
        onContinue={handleStartImport}
        isImporting={isImporting}
      />
    </div>
  );
}
