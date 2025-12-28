"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { reportException } from "@/lib/error-reporting";
import EnrichSingleContactHeader from "./_components/EnrichSingleContactHeader";
import HowItWorksCard from "./_components/HowItWorksCard";
import RequirementsCard from "./_components/RequirementsCard";
import EnrichSingleContactForm from "./_components/EnrichSingleContactForm";
import EnrichSingleContactResults from "./_components/EnrichSingleContactResults";
import EnrichSingleContactError from "./_components/EnrichSingleContactError";
import { ProcessResult } from "./_components/types";

export default function EnrichSingleContactPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [emailInput, setEmailInput] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ProcessResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleProcess = async () => {
    if (!emailInput.trim()) {
      setError("Please enter at least one email address");
      return;
    }

    if (!user?.uid) {
      setError("User not authenticated");
      return;
    }

    // Parse email addresses (one per line or comma-separated)
    const emailLines = emailInput
      .split(/[,\n]/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.includes("@"));

    if (emailLines.length === 0) {
      setError("No valid email addresses found");
      return;
    }

    if (!dryRun && !confirm(
      `This will enrich ${emailLines.length} contact(s) with first name, last name, company, and profile photo from Google People API. ` +
      "This action will modify your data. Continue?"
    )) {
      return;
    }

    setProcessing(true);
    setError(null);
    const newResults: ProcessResult[] = [];

    // Process emails sequentially to respect rate limits
    for (let i = 0; i < emailLines.length; i++) {
      const email = emailLines[i];

      try {
        const response = await fetch("/api/admin/enrich-single-contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            email,
            dryRun,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          newResults.push({
            success: false,
            message: data.error || "Processing failed",
            dryRun,
            contact: {
              email,
              contactId: "",
            },
            action: "skipped",
            error: data.message || data.error || "Unknown error",
          });
        } else {
          newResults.push(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        newResults.push({
          success: false,
          message: "Processing failed",
          dryRun,
          contact: {
            email,
            contactId: "",
          },
          action: "skipped",
          error: errorMessage,
        });
        reportException(err, {
          context: "Enriching single contact with People API",
          tags: { component: "EnrichSingleContactPage", email },
        });
      }

      // Add delay between requests to respect rate limits (200ms)
      if (i < emailLines.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    setResults(newResults);
    setProcessing(false);
  };

  const handleClear = () => {
    setEmailInput("");
    setResults([]);
    setError(null);
  };

  if (authLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <EnrichSingleContactHeader />
      <HowItWorksCard />

      <EnrichSingleContactForm
        emailInput={emailInput}
        dryRun={dryRun}
        processing={processing}
        results={results}
        onEmailInputChange={setEmailInput}
        onDryRunChange={setDryRun}
        onProcess={handleProcess}
        onClear={handleClear}
      />

      {error && <EnrichSingleContactError error={error} />}
      <EnrichSingleContactResults results={results} />
      <RequirementsCard />
    </div>
  );
}

