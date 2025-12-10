import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // All standard textarea props are inherited
}

/**
 * Reusable Textarea component with consistent styling
 * Provides consistent styling across all textarea elements in the application
 */
export default function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${className}`}
    />
  );
}

