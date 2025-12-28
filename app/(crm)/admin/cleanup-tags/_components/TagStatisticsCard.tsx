"use client";

import Card from "@/components/Card";
import { Button } from "@/components/Button";

interface TagUsage {
  tag: string;
  count: number;
}

interface TagStatisticsCardProps {
  tags: TagUsage[];
  loading: boolean;
  onRefresh: () => void;
}

export default function TagStatisticsCard({
  tags,
  loading,
  onRefresh,
}: TagStatisticsCardProps) {
  const unusedTags = tags.filter((t) => t.count === 0);
  const usedTags = tags.filter((t) => t.count > 0);

  return (
    <Card padding="md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-theme-darkest">Tag Usage Statistics</h2>
        <Button
          onClick={onRefresh}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          Refresh
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 rounded-sm border border-theme-light bg-card-highlight-light">
          <div className="text-2xl font-bold text-theme-darkest">{tags.length}</div>
          <div className="text-sm text-theme-dark">Total Tags</div>
        </div>
        <div className="text-center p-4 rounded-sm border border-theme-light" style={{ backgroundColor: 'var(--chip-green-bg)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--chip-green-text)' }}>{usedTags.length}</div>
          <div className="text-sm" style={{ color: 'var(--chip-green-text)' }}>In Use</div>
        </div>
        <div className="text-center p-4 rounded-sm border border-theme-light" style={{ backgroundColor: 'var(--chip-red-bg)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--chip-red-text)' }}>{unusedTags.length}</div>
          <div className="text-sm" style={{ color: 'var(--chip-red-text)' }}>Unused</div>
        </div>
      </div>
    </Card>
  );
}

