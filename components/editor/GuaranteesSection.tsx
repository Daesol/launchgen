"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface Guarantee {
  title: string;
  description: string;
  icon: string;
}

interface GuaranteesSectionProps {
  guarantees: {
    title: string;
    subtitle: string;
    guarantees: Guarantee[];
  };
  onGuaranteesChange: (field: string, value: any) => void;
  onGuaranteesArrayChange: (idx: number, value: any) => void;
  onAddGuarantee: () => void;
  onRemoveGuarantee: (idx: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const iconOptions = [
  "shield", "star", "check", "heart", "gem", "crown", "medal", "trophy",
  "lock", "key", "safety", "guarantee", "certificate", "badge", "award"
];

export default function GuaranteesSection({
  guarantees,
  onGuaranteesChange,
  onGuaranteesArrayChange,
  onAddGuarantee,
  onRemoveGuarantee,
  isExpanded,
  onToggle,
  isVisible,
  onToggleVisibility,
}: GuaranteesSectionProps) {
  // Provide default values if guarantees is undefined
  const safeGuarantees = guarantees || {
    title: '',
    subtitle: '',
    guarantees: []
  };
  return (
    <EditorSection
      title="Guarantees"
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
            value={safeGuarantees.title}
            onChange={(e) => onGuaranteesChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Our Guarantee, Risk-Free Promise"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <textarea
            value={safeGuarantees.subtitle}
            onChange={(e) => onGuaranteesChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Describe your guarantees or risk reversal"
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-700">Guarantees</h4>
            <button
              onClick={onAddGuarantee}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Guarantee
            </button>
          </div>
          
          {safeGuarantees.guarantees.map((guarantee, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-600">Guarantee {idx + 1}</h5>
                <button
                  onClick={() => onRemoveGuarantee(idx)}
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
                  value={guarantee.icon}
                  onChange={(e) => onGuaranteesArrayChange(idx, { ...guarantee, icon: e.target.value })}
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
                  Title
                </label>
                <input
                  type="text"
                  value={guarantee.title}
                  onChange={(e) => onGuaranteesArrayChange(idx, { ...guarantee, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Money-Back Guarantee"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={guarantee.description}
                  onChange={(e) => onGuaranteesArrayChange(idx, { ...guarantee, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  placeholder="Describe the guarantee"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorSection>
  );
} 