"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface BusinessInfoSectionProps {
  business: {
    name: string;
    logo: string;
  };
  onBusinessChange: (field: string, value: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function BusinessInfoSection({
  business,
  onBusinessChange,
  isExpanded,
  onToggle,
}: BusinessInfoSectionProps) {
  return (
    <EditorSection
      title="Business Info"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={business.name}
            onChange={(e) => onBusinessChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your business name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo URL
          </label>
          <input
            type="text"
            value={business.logo}
            onChange={(e) => onBusinessChange("logo", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter logo URL or leave empty for default"
          />
        </div>
      </div>
    </EditorSection>
  );
} 