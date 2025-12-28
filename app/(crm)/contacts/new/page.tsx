"use client";

import { useNewContactPage } from "@/hooks/useNewContactPage";
import Loading from "@/components/Loading";
import { Button } from "@/components/Button";
import NewContactHeader from "./_components/NewContactHeader";
import ContactDetailsInfoCard from "./_components/ContactDetailsInfoCard";
import BasicInformationSection from "./_components/BasicInformationSection";
import CrmInformationSection from "./_components/CrmInformationSection";
import NotesSection from "./_components/NotesSection";
import NextTouchpointSection from "./_components/NextTouchpointSection";
import ContactFormError from "./_components/ContactFormError";

export default function NewContactPage() {
  const { user, loading, form, updateField, saving, error, handleSave, hasValidSession } = useNewContactPage();

  if (loading) {
    return <Loading />;
  }

  // In production, require Firebase user (normal flow)
  // In test mode, allow rendering if session cookie check succeeded (hasValidSession === true)
  // Otherwise, don't render the form (prevents showing form to unauthenticated users)
  if (!user && hasValidSession !== true) {
    return null;
  }

  return (
    <div className="space-y-6">
      <NewContactHeader />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sidebar - Right Column (1/3) - Top on mobile, Right on desktop */}
        <div className="xl:col-span-1 space-y-6 order-1 xl:order-2">
          <ContactDetailsInfoCard />
        </div>

        {/* Main Content - Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-6 order-2 xl:order-1">
          <BasicInformationSection form={form} updateField={updateField} />
          <CrmInformationSection form={form} updateField={updateField} />
          <NotesSection notes={form.notes} updateField={updateField} />
          <NextTouchpointSection form={form} updateField={updateField} />

          {/* Save Button - Below editable fields */}
          <div className="space-y-3">
            <div className="flex justify-start">
              <Button
                onClick={handleSave}
                disabled={saving}
                loading={saving}
                variant="secondary"
                size="md"
                className="shadow-sm"
                icon={
                  <svg
                    className="w-4 h-4"
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
                }
              >
                Save Contact
              </Button>
            </div>
            
            {/* Error Message - Display below save button */}
            {error && <ContactFormError error={error} />}
          </div>
        </div>
      </div>
    </div>
  );
}
