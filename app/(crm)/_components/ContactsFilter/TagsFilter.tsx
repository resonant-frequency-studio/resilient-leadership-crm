"use client";

import { useState } from "react";
import Input from "@/components/Input";
import { Button } from "@/components/Button";

interface TagsFilterProps {
  selectedTags: string[];
  uniqueTags: string[];
  disabled: boolean;
  onTagsChange: (tags: string[]) => void;
}

export default function TagsFilter({
  selectedTags,
  uniqueTags,
  disabled,
  onTagsChange,
}: TagsFilterProps) {
  const [tagSearch, setTagSearch] = useState<string>("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  if (uniqueTags.length === 0) {
    return null;
  }

  return (
    <div>
      <label htmlFor="tag-search" className="block text-sm font-medium text-theme-darker mb-2">
        Filter by Tags
      </label>

      {/* Searchable Tag Dropdown */}
      <div className="relative">
        <Input
          id="tag-search"
          type="text"
          value={tagSearch}
          onChange={(e) => {
            setTagSearch(e.target.value);
            setShowTagDropdown(true);
          }}
          onFocus={() => setShowTagDropdown(true)}
          placeholder="Search and select tags..."
          aria-expanded={showTagDropdown}
          aria-haspopup="listbox"
          disabled={disabled}
        />

        {/* Dropdown - positioned absolutely to prevent layout shift */}
        {showTagDropdown && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowTagDropdown(false)}
              aria-hidden="true"
            />
            <div
              className="absolute z-20 w-full top-full mt-1 bg-card-highlight-light border border-gray-200 rounded-sm shadow-lg max-h-60 overflow-y-auto"
              role="listbox"
            >
              {uniqueTags
                .filter(tag =>
                  !selectedTags.includes(tag) &&
                  tag.toLowerCase().includes(tagSearch.toLowerCase())
                )
                .slice(0, 20)
                .map(tag => (
                  <Button
                    key={tag}
                    onClick={() => {
                      toggleTag(tag);
                      setTagSearch("");
                    }}
                    variant="link"
                    size="sm"
                    className="w-full text-left px-4 py-2 no-underline! hover:bg-selected-active hover:text-selected-foreground text-sm text-foreground justify-start"
                    role="option"
                    aria-selected="false"
                  >
                    {tag}
                  </Button>
                ))}
              {uniqueTags.filter(tag =>
                !selectedTags.includes(tag) &&
                tag.toLowerCase().includes(tagSearch.toLowerCase())
              ).length === 0 && (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No tags found
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Selected Tags Display - Below input */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-sm text-sm font-medium"
            >
              {tag}
              <Button
                onClick={() => toggleTag(tag)}
                variant="link"
                size="sm"
                className="p-0 w-auto h-auto hover:text-blue-900"
                aria-label={`Remove ${tag} tag`}
                icon={
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                }
              >
                <span className="sr-only">Remove {tag}</span>
              </Button>
            </span>
          ))}
        </div>
      )}

      {selectedTags.length > 0 && (
        <p className="mt-2 text-xs text-gray-500">
          {selectedTags.length} {selectedTags.length === 1 ? "tag" : "tags"} selected
        </p>
      )}
    </div>
  );
}

