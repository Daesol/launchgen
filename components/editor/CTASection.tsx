"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface CTASectionProps {
  ctaTitle: string;
  ctaSubtitle: string;
  onPageContentChange: (field: string, value: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function CTASection({
  ctaTitle,
  ctaSubtitle,
  onPageContentChange,
  isExpanded,
  onToggle,
  isVisible,
  onToggleVisibility,
}: CTASectionProps) {
  return (
    <EditorSection
      title="CTA"
      isExpanded={isExpanded}
      onToggle={onToggle}
      isVisible={isVisible}
      onToggleVisibility={onToggleVisibility}
      showVisibilityToggle={true}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CTA Title
          </label>
          <input
            type="text"
            value={ctaTitle}
            onChange={(e) => onPageContentChange("ctaTitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Get Started Today, Start Your Journey"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CTA Subtitle
          </label>
          <textarea
            value={ctaSubtitle}
            onChange={(e) => onPageContentChange("ctaSubtitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Supporting text for your call to action"
          />
        </div>
      </div>
    </EditorSection>
  );
} 