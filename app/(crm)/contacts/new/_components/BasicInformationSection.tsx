"use client";

import Card from "@/components/Card";
import Input from "@/components/Input";

import { NewContactForm } from "@/hooks/useNewContactPage";

interface BasicInformationSectionProps {
  form: {
    primaryEmail?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    company?: string | null;
  };
  updateField: (field: keyof NewContactForm, value: string | string[] | number | null) => void;
}

export default function BasicInformationSection({
  form,
  updateField,
}: BasicInformationSectionProps) {
  return (
    <Card padding="md">
      <h2 className="text-lg font-semibold text-theme-darkest mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Basic Information
      </h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="new-contact-email" className="block text-sm font-medium text-theme-darker mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            id="new-contact-email"
            name="new-contact-email"
            type="email"
            value={form.primaryEmail || ""}
            onChange={(e) => updateField("primaryEmail", e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="new-contact-first-name" className="block text-sm font-medium text-theme-darker mb-2">
              First Name
            </label>
            <Input
              id="new-contact-first-name"
              name="new-contact-first-name"
              value={form.firstName || ""}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="First Name"
            />
          </div>
          <div>
            <label htmlFor="new-contact-last-name" className="block text-sm font-medium text-theme-darker mb-2">
              Last Name
            </label>
            <Input
              id="new-contact-last-name"
              name="new-contact-last-name"
              value={form.lastName || ""}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="new-contact-company" className="block text-sm font-medium text-theme-darker mb-2">
            Company
          </label>
          <Input
            id="new-contact-company"
            name="new-contact-company"
            value={form.company || ""}
            onChange={(e) => updateField("company", e.target.value)}
            placeholder="Company"
          />
        </div>
      </div>
    </Card>
  );
}

