"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface Feature {
  title: string;
  description: string;
  icon: string;
  benefit: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  featuresTitle: string;
  featuresSubtitle: string;
  onFeatureChange: (idx: number, value: any) => void;
  onAddFeature: () => void;
  onRemoveFeature: (idx: number) => void;
  onPageContentChange: (field: string, value: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const iconOptions = [
  "rocket", "star", "heart", "shield", "zap", "check", "arrow-up", "trophy",
  "gem", "crown", "fire", "bolt", "diamond", "medal", "target", "lightning",
  "brain", "cart", "clock", "book", "wallet", "users", "chart", "globe"
];

export default function FeaturesSection({
  features,
  featuresTitle,
  featuresSubtitle,
  onFeatureChange,
  onAddFeature,
  onRemoveFeature,
  onPageContentChange,
  isExpanded,
  onToggle,
  isVisible,
  onToggleVisibility,
}: FeaturesSectionProps) {
  return (
    <EditorSection
      title="Solutions/Features"
      isExpanded={isExpanded}
      onToggle={onToggle}
      isVisible={isVisible}
      onToggleVisibility={onToggleVisibility}
      showVisibilityToggle={true}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={featuresTitle}
            onChange={(e) => onPageContentChange("featuresTitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Key Features, Our Solutions"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <textarea
            value={featuresSubtitle}
            onChange={(e) => onPageContentChange("featuresSubtitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Describe your features or solutions"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-700">Features</h4>
            <button
              onClick={onAddFeature}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Feature
            </button>
          </div>
          
          {features.map((feature, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-600">Feature {idx + 1}</h5>
                <button
                  onClick={() => onRemoveFeature(idx)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => onFeatureChange(idx, { ...feature, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Feature title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={feature.description}
                  onChange={(e) => onFeatureChange(idx, { ...feature, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  placeholder="Feature description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  value={feature.icon}
                  onChange={(e) => onFeatureChange(idx, { ...feature, icon: e.target.value })}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Benefit
                </label>
                <input
                  type="text"
                  value={feature.benefit}
                  onChange={(e) => onFeatureChange(idx, { ...feature, benefit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="What benefit does this provide?"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorSection>
  );
} 