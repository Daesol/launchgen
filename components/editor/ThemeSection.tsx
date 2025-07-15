"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface ThemeSectionProps {
  theme: {
    mode: string;
    accentColor: string;
  };
  onThemeChange: (field: string, value: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ThemeSection({
  theme,
  onThemeChange,
  isExpanded,
  onToggle,
}: ThemeSectionProps) {
  return (
    <EditorSection
      title="Theme Settings"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme Mode
          </label>
          <select
            value={theme.mode}
            onChange={(e) => onThemeChange("mode", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="white">Light Theme</option>
            <option value="black">Dark Theme</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accent Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={theme.accentColor}
              onChange={(e) => onThemeChange("accentColor", e.target.value)}
              className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={theme.accentColor}
              onChange={(e) => onThemeChange("accentColor", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#6366f1"
            />
          </div>
        </div>
      </div>
    </EditorSection>
  );
} 