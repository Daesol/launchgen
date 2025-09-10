import React from 'react';
import { useTheme } from '@/lib/theme-context';

interface ThemePanelProps {
  theme: {
    mode: 'white' | 'black';
    accentColor: string;
  };
  onThemeChange: (field: string, value: any) => void;
  onBack: () => void;
}

export default function ThemePanel({ theme, onThemeChange, onBack }: ThemePanelProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
          title="Back to main panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-slate-800">Theme Settings</h3>
      </div>
      
      <div className="space-y-4">
        {/* Theme Mode */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Theme Mode
          </label>
          <select
            value={theme.mode}
            onChange={(e) => {
              const newMode = e.target.value as 'white' | 'black';
              onThemeChange('theme.mode', newMode);
            }}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
          >
            <option value="white">Light Theme</option>
            <option value="black">Dark Theme</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">
            This setting applies to the landing page theme.
          </p>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Accent Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.accentColor}
              onChange={(e) => onThemeChange('theme.accentColor', e.target.value)}
              className="w-12 h-10 border border-slate-300 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={theme.accentColor}
              onChange={(e) => onThemeChange('theme.accentColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm font-mono"
              placeholder="#6366f1"
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            This color is specific to this page and will be saved with your page.
          </p>
        </div>

        {/* Color Preview */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Preview
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border border-slate-300"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span className="text-xs text-slate-600">Accent Color</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className={`w-4 h-4 rounded border border-slate-300 ${
                  theme.mode === 'white' ? 'bg-white' : 'bg-slate-900'
                }`}
              />
              <span className="text-xs text-slate-600">
                {theme.mode === 'white' ? 'Light' : 'Dark'} Background
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
