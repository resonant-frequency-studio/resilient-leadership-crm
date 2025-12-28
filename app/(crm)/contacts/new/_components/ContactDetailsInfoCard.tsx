"use client";

import Card from "@/components/Card";

export default function ContactDetailsInfoCard() {
  return (
    <Card padding="md">
      <h2 className="text-lg font-semibold text-theme-darkest mb-4">Contact Details</h2>
      <div className="space-y-4 text-sm text-theme-dark">
        <p>Fill in the form fields to create a new contact. Email is required.</p>
        <p>
          Once saved, the contact will be added to your CRM and you can view and edit it
          from the contacts list.
        </p>
      </div>
    </Card>
  );
}

