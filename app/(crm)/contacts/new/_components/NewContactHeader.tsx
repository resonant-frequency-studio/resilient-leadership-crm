"use client";

import ContactsLink from "@/app/(crm)/_components/ContactsLink";

export default function NewContactHeader() {
  return (
    <>
      {/* Back Button - Mobile: top, Desktop: in header */}
      <div className="xl:hidden">
        <ContactsLink variant="default" />
      </div>

      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-theme-darkest mb-2">Add New Contact</h1>
          <p className="text-theme-dark text-lg">Create a new contact in your CRM</p>
        </div>
        <div className="hidden xl:block">
          <ContactsLink variant="default" />
        </div>
      </div>
    </>
  );
}

