"use client";
import React from 'react';

interface PreviewHeaderProps {
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  onRegenerate: () => void;
  regenerating: boolean;
}

export default function PreviewHeader({ 
  previewMode, 
  onPreviewModeChange, 
  onRegenerate, 
  regenerating 
}: PreviewHeaderProps) {
  return (
    <div className="bg-neutral-800 border-b border-[#2D2D2D] px-3 py-2 flex items-center justify-between">
      {/* Left side - View toggle buttons */}
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-neutral-300 mr-3">Preview</span>
        
        {/* Desktop/Mobile view buttons */}
        <button
          onClick={() => onPreviewModeChange('desktop')}
          className={`p-1.5 rounded transition-colors ${
            previewMode === 'desktop'
              ? 'bg-blue-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
          }`}
          title="Desktop view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </button>
        
        <button
          onClick={() => onPreviewModeChange('mobile')}
          className={`p-1.5 rounded transition-colors ${
            previewMode === 'mobile'
              ? 'bg-blue-600 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
          }`}
          title="Mobile view"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Right side - Regenerate button */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onRegenerate}
          disabled={regenerating}
          className="px-3 py-1.5 text-sm border border-[#2D2D2D] text-white hover:bg-neutral-700 hover:border-neutral-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0A0A0A' }}
        >
          {regenerating ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Regenerating...</span>
            </div>
          ) : (
            'Regenerate'
          )}
        </button>
      </div>
    </div>
  );
}
