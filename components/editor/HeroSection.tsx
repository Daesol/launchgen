"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface HeroSectionProps {
  hero: {
    headline: string;
    headlineHighlights: string[];
    subheadline: string;
    cta: string;
    heroTag: string;
    heroTagIcon: string;
    backgroundImage: string;
  };
  onHeroChange: (field: string, value: string) => void;
  onHighlightToggle: (word: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const iconOptions = [
  "rocket", "star", "heart", "shield", "zap", "check", "arrow-up", "trophy",
  "gem", "crown", "fire", "bolt", "diamond", "medal", "target", "lightning"
];

export default function HeroSection({
  hero,
  onHeroChange,
  onHighlightToggle,
  isExpanded,
  onToggle,
}: HeroSectionProps) {
  // Extract words from headline for highlighting
  const headlineWords = hero.headline.split(' ').filter(word => word.length > 0);

  return (
    <EditorSection
      title="Hero Section"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Tag
          </label>
          <input
            type="text"
            value={hero.heroTag}
            onChange={(e) => onHeroChange("heroTag", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AI-Powered, New, Limited Time"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Tag Icon
          </label>
          <select
            value={hero.heroTagIcon}
            onChange={(e) => onHeroChange("heroTagIcon", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {iconOptions.map((icon) => (
              <option key={icon} value={icon}>
                {icon.charAt(0).toUpperCase() + icon.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headline
          </label>
          <textarea
            value={hero.headline}
            onChange={(e) => onHeroChange("headline", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Enter your main headline"
          />
          {headlineWords.length > 0 && (
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlight Words (click to toggle):
              </label>
              <div className="flex flex-wrap gap-2">
                {headlineWords.map((word, index) => {
                  const cleanWord = word.replace(/[^\w]/g, '');
                  const isHighlighted = hero.headlineHighlights.includes(cleanWord);
                  return (
                    <button
                      key={index}
                      onClick={() => onHighlightToggle(cleanWord)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        isHighlighted
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {cleanWord}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subheadline
          </label>
          <textarea
            value={hero.subheadline}
            onChange={(e) => onHeroChange("subheadline", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Enter your subheadline"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CTA Button Text
          </label>
          <input
            type="text"
            value={hero.cta}
            onChange={(e) => onHeroChange("cta", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Get Started, Learn More"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Background Image URL (optional)
          </label>
          <input
            type="text"
            value={hero.backgroundImage}
            onChange={(e) => onHeroChange("backgroundImage", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter background image URL"
          />
        </div>
      </div>
    </EditorSection>
  );
} 