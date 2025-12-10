import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // All standard input props are inherited
}

/**
 * Reusable Input component with consistent styling
 * Provides consistent styling across all text input elements in the application
 */
export default function Input({ className = "", ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${className}`}
    />
  );
}

