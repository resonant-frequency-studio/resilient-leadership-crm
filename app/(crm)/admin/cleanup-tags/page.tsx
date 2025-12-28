"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import Card from "@/components/Card";
import { reportException } from "@/lib/error-reporting";
import CleanupTagsHeader from "./_components/CleanupTagsHeader";
import CleanupTagsWarning from "./_components/CleanupTagsWarning";
import TagStatisticsCard from "./_components/TagStatisticsCard";
import TagSelectionGrid from "./_components/TagSelectionGrid";
import CleanupTagsForm from "./_components/CleanupTagsForm";
import CleanupTagsError from "./_components/CleanupTagsError";
import CleanupTagsResults from "./_components/CleanupTagsResults";

interface TagUsage {
  tag: string;
  count: number;
}

export default function CleanupTagsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [dryRun, setDryRun] = useState(true);
  const [tags, setTags] = useState<TagUsage[]>([]);
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    dryRun: boolean;
    processed: number;
    updated: number;
    skipped: number;
    errors: number;
    errorDetails?: string[];
    details?: Array<{
      contactId: string;
      email: string;
      action: "updated" | "skipped" | "error";
      tagsRemoved?: string[];
      error?: string;
    }>;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Load tags on mount
  useEffect(() => {
    if (user) {
      loadTags();
    }
  }, [user]);

  const loadTags = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/cleanup-tags");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load tags");
      }

      setTags(data.tags || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      reportException(err, {
        context: "Loading tag usage",
        tags: { component: "CleanupTagsPage" },
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const selectUnusedTags = () => {
    const unusedTags = tags.filter((t) => t.count === 0).map((t) => t.tag);
    setSelectedTags(new Set(unusedTags));
  };

  const handleCleanup = async () => {
    if (selectedTags.size === 0) {
      alert("Please select at least one tag to remove");
      return;
    }

    if (!dryRun && !confirm(
      `This will remove ${selectedTags.size} tag(s) from all contacts. ` +
      "This action cannot be undone. Continue?"
    )) {
      return;
    }

    setRunning(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/cleanup-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tagsToRemove: Array.from(selectedTags),
          dryRun,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Cleanup failed");
      }

      setResult(data);
      
      // Reload tags after cleanup (if not dry run)
      if (!dryRun) {
        setTimeout(() => {
          loadTags();
          setSelectedTags(new Set());
        }, 1000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      reportException(err, {
        context: "Cleaning up tags",
        tags: { component: "CleanupTagsPage" },
      });
    } finally {
      setRunning(false);
    }
  };

  if (authLoading || loading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  const unusedTags = tags.filter((t) => t.count === 0);
  const usedTags = tags.filter((t) => t.count > 0);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <CleanupTagsHeader />
      <CleanupTagsWarning />

      <Card padding="md">
        <TagStatisticsCard
          tags={tags}
          loading={loading}
          onRefresh={loadTags}
        />
        <TagSelectionGrid
          tags={tags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onSelectUnused={selectUnusedTags}
          onClearSelection={() => setSelectedTags(new Set())}
        />
      </Card>

      <CleanupTagsForm
        dryRun={dryRun}
        running={running}
        selectedCount={selectedTags.size}
        onDryRunChange={setDryRun}
        onCleanup={handleCleanup}
      />

      <CleanupTagsError error={error} />
      <CleanupTagsResults result={result} />
    </div>
  );
}

