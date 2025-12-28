"use client";

import { Button } from "@/components/Button";

interface TagUsage {
  tag: string;
  count: number;
}

interface TagSelectionGridProps {
  tags: TagUsage[];
  selectedTags: Set<string>;
  onToggleTag: (tag: string) => void;
  onSelectUnused: () => void;
  onClearSelection: () => void;
}

export default function TagSelectionGrid({
  tags,
  selectedTags,
  onToggleTag,
  onSelectUnused,
  onClearSelection,
}: TagSelectionGridProps) {
  const unusedTags = tags.filter((t) => t.count === 0);
  const usedTags = tags.filter((t) => t.count > 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-semibold text-theme-darkest">
          Select Tags to Remove ({selectedTags.size} selected)
        </h3>
        <div className="flex gap-2">
          {unusedTags.length > 0 && (
            <Button
              onClick={onSelectUnused}
              variant="outline"
              size="sm"
            >
              Select All Unused
            </Button>
          )}
          <Button
            onClick={onClearSelection}
            variant="outline"
            size="sm"
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Unused Tags Section */}
      {unusedTags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-theme-darker mb-2">
            Unused Tags ({unusedTags.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {unusedTags.map((tagUsage) => (
              <button
                key={tagUsage.tag}
                onClick={() => onToggleTag(tagUsage.tag)}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors border-2 ${
                  selectedTags.has(tagUsage.tag)
                    ? "border-card-overdue-dark"
                    : "border-transparent hover:bg-theme-light"
                }`}
                style={selectedTags.has(tagUsage.tag) ? {
                  backgroundColor: 'var(--chip-danger-bg)',
                  color: 'var(--card-overdue-dark)',
                } : {
                  backgroundColor: 'var(--card-highlight-light)',
                  color: 'var(--theme-darker)',
                }}
              >
                {tagUsage.tag} (0)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Used Tags Section */}
      {usedTags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-theme-darker mb-2">
            Tags in Use ({usedTags.length})
          </h4>
          <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto">
            {usedTags.map((tagUsage) => (
              <button
                key={tagUsage.tag}
                onClick={() => onToggleTag(tagUsage.tag)}
                className={`px-3 py-1.5 rounded-sm text-sm font-medium transition-colors border-2 ${
                  selectedTags.has(tagUsage.tag)
                    ? "border-card-overdue-dark"
                    : "border-transparent hover:bg-theme-light"
                }`}
                style={selectedTags.has(tagUsage.tag) ? {
                  backgroundColor: 'var(--chip-danger-bg)',
                  color: 'var(--card-overdue-dark)',
                } : {
                  backgroundColor: 'var(--chip-green-bg)',
                  color: 'var(--chip-green-text)',
                }}
              >
                {tagUsage.tag} ({tagUsage.count})
              </button>
            ))}
          </div>
        </div>
      )}

      {tags.length === 0 && (
        <p className="text-theme-dark text-center py-8">No tags found</p>
      )}
    </div>
  );
}

