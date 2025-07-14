"use client";
import React from "react";

interface CollapsibleSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isVisible?: boolean;
  onVisibilityToggle?: () => void;
  showVisibilityToggle?: boolean;
}

export default function CollapsibleSection({ 
  title, 
  isExpanded, 
  onToggle, 
  children,
  isVisible = true,
  onVisibilityToggle,
  showVisibilityToggle = false
}: CollapsibleSectionProps) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between">
        <button
          onClick={onToggle}
          className="flex items-center justify-between text-left flex-1"
        >
          <h3 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h3>
          <svg 
            className={`w-5 h-5 text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showVisibilityToggle && onVisibilityToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVisibilityToggle();
            }}
            className={`ml-3 px-3 py-1 text-xs font-medium rounded-full transition-colors ${
              isVisible 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
            title={isVisible ? 'Hide section' : 'Show section'}
          >
            {isVisible ? 'Visible' : 'Hidden'}
          </button>
        )}
      </div>
      {isExpanded && (
        <div className="p-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
} 