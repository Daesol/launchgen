"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface PainPoint {
  icon: string;
  text: string;
}

interface ProblemSectionProps {
  problemSection: {
    title: string;
    subtitle: string;
    painPoints: PainPoint[];
  };
  onProblemSectionChange: (field: string, value: any) => void;
  onPainPointsChange: (idx: number, value: any) => void;
  onAddPainPoint: () => void;
  onRemovePainPoint: (idx: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const iconOptions = [
  "clock", "book", "wallet", "users", "chart", "globe", "shield", "zap",
  "exclamation", "question", "minus", "x", "alert", "warning", "info"
];

export default function ProblemSection({
  problemSection,
  onProblemSectionChange,
  onPainPointsChange,
  onAddPainPoint,
  onRemovePainPoint,
  isExpanded,
  onToggle,
  isVisible,
  onToggleVisibility,
}: ProblemSectionProps) {
  // Provide default values if problemSection is undefined
  const safeProblemSection = problemSection || {
    title: '',
    subtitle: '',
    painPoints: []
  };
  return (
    <EditorSection
      title="Problem Section"
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
            value={safeProblemSection.title}
            onChange={(e) => onProblemSectionChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Common Challenges, Problems We Solve"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <textarea
            value={safeProblemSection.subtitle}
            onChange={(e) => onProblemSectionChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Describe the problems your audience faces"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-700">Pain Points</h4>
            <button
              onClick={onAddPainPoint}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Pain Point
            </button>
          </div>
          
          {safeProblemSection.painPoints.map((painPoint, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-600">Pain Point {idx + 1}</h5>
                <button
                  onClick={() => onRemovePainPoint(idx)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  value={painPoint.icon}
                  onChange={(e) => onPainPointsChange(idx, { ...painPoint, icon: e.target.value })}
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
                  Text
                </label>
                <input
                  type="text"
                  value={painPoint.text}
                  onChange={(e) => onPainPointsChange(idx, { ...painPoint, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the pain point"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorSection>
  );
} 