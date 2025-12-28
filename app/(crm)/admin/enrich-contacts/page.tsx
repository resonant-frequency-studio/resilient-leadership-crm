"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { reportException } from "@/lib/error-reporting";
import EnrichContactsHeader from "./_components/EnrichContactsHeader";
import HowItWorksCard from "./_components/HowItWorksCard";
import RequirementsCard from "./_components/RequirementsCard";
import EnrichContactsForm from "./_components/EnrichContactsForm";
import EnrichContactsError from "./_components/EnrichContactsError";
import EnrichContactsResult from "./_components/EnrichContactsResult";

export default function EnrichContactsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [result, setResult] = useState<{
    message: string;
    dryRun: boolean;
    processed: number;
    updated: number;
    skipped: number;
    errors: number;
    details?: Array<{
      contactId: string;
      email: string;
      action: "updated" | "skipped" | "error";
      enriched?: { firstName: string | null; lastName: string | null; company: string | null; photoUrl: string | null; source?: string };
      current?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null };
      new?: { firstName?: string | null; lastName?: string | null; company?: string | null; photoUrl?: string | null };
      error?: string;
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleEnrich = async () => {
    if (!dryRun && !confirm(
      "This will enrich contacts with first name, last name, company, and profile photo from Google People API. " +
      "This action will modify your data. Continue?"
    )) {
      return;
    }

    if (!user?.uid) {
      setError("User not authenticated");
      return;
    }

    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/enrich-contacts-with-people-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: user.uid,
          dryRun,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Enrichment failed");
      }

      setResult(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      reportException(err, {
        context: "Enriching contacts with People API",
        tags: { component: "EnrichContactsPage" },
      });
    } finally {
      setRunning(false);
    }
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <EnrichContactsHeader />

      <HowItWorksCard />

      <EnrichContactsForm
        dryRun={dryRun}
        onDryRunChange={setDryRun}
        onSubmit={handleEnrich}
        running={running}
      />

      {error && <EnrichContactsError error={error} />}

      {result && <EnrichContactsResult result={result} />}

      <RequirementsCard />
    </div>
  );
}

