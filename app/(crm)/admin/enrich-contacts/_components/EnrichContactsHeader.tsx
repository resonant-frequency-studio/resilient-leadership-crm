"use client";

export default function EnrichContactsHeader() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-theme-darkest mb-2">Enrich Contacts with People API</h1>
      <p className="text-theme-dark text-lg">
        Batch process all contacts to enrich them with first name, last name, company, and profile photo from Google People API
      </p>
    </div>
  );
}

