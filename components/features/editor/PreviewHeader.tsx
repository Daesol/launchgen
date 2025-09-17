"use client";
import React from 'react';
import MobilePreviewQR from '../../widgets/MobilePreviewQR';

interface PreviewHeaderProps {
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  onRegenerate: () => void;
  regenerating: boolean;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  pageUrl?: string;
  pageId?: string;
  previewUrl?: string;
  isPublished?: boolean;
  slug?: string;
}

export default function PreviewHeader({ 
  previewMode, 
  onPreviewModeChange, 
  onRegenerate, 
  regenerating,
  isFullScreen = false,
  onToggleFullScreen,
  pageUrl,
  pageId,
  previewUrl,
  isPublished = false,
  slug
}: PreviewHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b border-[#2D2D2D] px-2 py-1.5 flex items-center justify-between" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Left side - Mobile Preview Label */}
      <div className="flex items-center">
        <span className="text-xs font-medium text-neutral-300">Mobile Preview</span>
      </div>

      {/* Right side - Full screen toggle and Regenerate button */}
      <div className="flex items-center space-x-1">
        {/* Full screen toggle button */}
        {onToggleFullScreen && (
          <button
            onClick={onToggleFullScreen}
            className={`p-1 rounded transition-colors ${
              isFullScreen
                ? 'bg-blue-600 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
            }`}
            title={isFullScreen ? "Exit full screen" : "Enter full screen"}
          >
            {isFullScreen ? (
              // Exit full screen icon
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9v4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15v-4.5M15 15h4.5M15 15l5.5 5.5" />
              </svg>
            ) : (
              // Enter full screen icon
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            )}
          </button>
        )}
        
        {/* QR Code for Mobile Preview */}
        <div className="mr-2">
          <MobilePreviewQR 
            pageUrl={pageUrl || ''}
            pageId={pageId || ''}
            previewUrl={previewUrl}
            isPublished={isPublished}
            slug={slug}
          />
        </div>
        
        <button
          onClick={onRegenerate}
          disabled={regenerating}
          className="px-2 py-1 text-xs border border-[#2D2D2D] text-white hover:bg-neutral-700 hover:border-neutral-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#0A0A0A' }}
        >
          {regenerating ? (
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Regen...</span>
            </div>
          ) : (
            'Regen'
          )}
        </button>
      </div>
    </div>
  );
}
