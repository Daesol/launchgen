"use client";
import React from "react";

interface EditorSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  showVisibilityToggle?: boolean;
}

export default function EditorSection({
  title,
  children,
  isExpanded,
  onToggle,
  isVisible = true,
  onToggleVisibility,
  showVisibilityToggle = false,
}: EditorSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg mb-4">
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <button
          onClick={onToggle}
          className="flex items-center justify-between text-left flex-1 cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showVisibilityToggle && onToggleVisibility && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility();
            }}
            className={`ml-3 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              isVisible
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-red-100 text-red-700 hover:bg-red-200"
            }`}
            title={isVisible ? 'Hide section' : 'Show section'}
          >
            {isVisible ? "Visible" : "Hidden"}
          </button>
        )}
      </div>
      {isExpanded && <div className="p-4">{children}</div>}
    </div>
  );
} 