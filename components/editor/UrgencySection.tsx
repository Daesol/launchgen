"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface UrgencySectionProps {
  urgency: {
    enabled: boolean;
    message: string;
    deadline: string;
  };
  onUrgencyChange: (field: string, value: any) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function UrgencySection({
  urgency,
  onUrgencyChange,
  isExpanded,
  onToggle,
}: UrgencySectionProps) {
  // Provide default values if urgency is undefined
  const safeUrgency = urgency || {
    enabled: false,
    message: '',
    deadline: ''
  };
  return (
    <EditorSection
      title="Urgency Settings"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="urgency-enabled"
            checked={safeUrgency.enabled}
            onChange={(e) => onUrgencyChange("enabled", e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="urgency-enabled" className="ml-2 block text-sm text-gray-700">
            Enable urgency/scarcity messaging
          </label>
        </div>
        
        {safeUrgency.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Message
              </label>
              <input
                type="text"
                value={safeUrgency.message}
                onChange={(e) => onUrgencyChange("message", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Limited Time Offer, Act Now"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <input
                type="text"
                value={safeUrgency.deadline}
                onChange={(e) => onUrgencyChange("deadline", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Ends in 24 hours, Expires tomorrow"
              />
            </div>
          </>
        )}
      </div>
    </EditorSection>
  );
} 