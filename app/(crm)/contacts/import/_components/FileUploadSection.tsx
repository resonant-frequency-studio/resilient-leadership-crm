"use client";

import { DragEvent, useRef, useState } from "react";

interface FileUploadSectionProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isImporting: boolean;
  selectedFileName: string | null;
  fileSize: string | null;
}

export default function FileUploadSection({
  fileInputRef,
  onFileSelect,
  isImporting,
  selectedFileName,
  fileSize,
}: FileUploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (isImporting) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          fileInputRef.current.files = dataTransfer.files;
          const event = new Event("change", { bubbles: true });
          fileInputRef.current.dispatchEvent(event);
        }
      }
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : isImporting
          ? "border-gray-300 bg-gray-50"
          : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={onFileSelect}
        disabled={isImporting}
        className="hidden"
        id="csv-upload"
      />
      <label
        htmlFor="csv-upload"
        className={`flex flex-col items-center ${
          isImporting ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
          isDragging ? "bg-blue-200" : "bg-blue-100"
        }`}>
          <svg
            className={`w-8 h-8 transition-colors ${
              isDragging ? "text-blue-700" : "text-blue-600"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        {selectedFileName && !isImporting ? (
          <div className="mb-2">
            <p className="text-lg font-medium text-theme-darkest mb-1">{selectedFileName}</p>
            {fileSize && (
              <p className="text-sm text-gray-500">Size: {fileSize}</p>
            )}
          </div>
        ) : (
          <>
            <p className="text-lg font-medium text-theme-darkest mb-1">
              {isImporting ? "Importing..." : isDragging ? "Drop CSV file here" : "Click to upload or drag and drop"}
            </p>
            <p className="text-sm text-gray-500">CSV files only (max size: 10MB)</p>
          </>
        )}
      </label>
    </div>
  );
}

