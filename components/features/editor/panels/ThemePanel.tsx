import React from 'react';
import { useTheme } from '@/lib/theme-context';
import { Sun, Moon, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          title="Back to main panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-white">Theme Settings</h3>
      </div>
      
      <div className="space-y-4">
        {/* Theme Mode */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Theme Mode
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-sm border-[#2D2D2D] text-white hover:bg-neutral-800"
                style={{ backgroundColor: '#0A0A0A' }}
              >
                <div className="flex items-center gap-2">
                  {theme.mode === 'white' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                  <span>{theme.mode === 'white' ? 'Light Theme' : 'Dark Theme'}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full min-w-[200px] bg-neutral-800 border-[#2D2D2D]">
              <DropdownMenuItem
                onClick={() => onThemeChange('theme.mode', 'white')}
                className="flex items-center gap-2 cursor-pointer text-white hover:bg-neutral-700"
              >
                <Sun className="h-4 w-4" />
                <span>Light Theme</span>
                {theme.mode === 'white' && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onThemeChange('theme.mode', 'black')}
                className="flex items-center gap-2 cursor-pointer text-white hover:bg-neutral-700"
              >
                <Moon className="h-4 w-4" />
                <span>Dark Theme</span>
                {theme.mode === 'black' && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <p className="text-xs text-neutral-400 mt-1">
            This setting applies to the landing page theme.
          </p>
        </div>

        {/* Accent Color */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Accent Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={theme.accentColor}
              onChange={(e) => onThemeChange('theme.accentColor', e.target.value)}
              className="w-12 h-10 border border-[#2D2D2D] rounded-md cursor-pointer bg-neutral-800"
            />
            <input
              type="text"
              value={theme.accentColor}
              onChange={(e) => onThemeChange('theme.accentColor', e.target.value)}
              className="flex-1 px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono bg-neutral-800 text-white"
              placeholder="#6366f1"
            />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            This color is specific to this page and will be saved with your page.
          </p>
        </div>

        {/* Color Preview */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Preview
          </label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded border border-[#2D2D2D]"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span className="text-xs text-neutral-400">Accent Color</span>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className={`w-4 h-4 rounded border border-[#2D2D2D] ${
                  theme.mode === 'white' ? 'bg-white' : 'bg-black'
                }`}
              />
              <span className="text-xs text-neutral-400">
                {theme.mode === 'white' ? 'Light' : 'Dark'} Background
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
