"use client";
import React, { useState, useRef, useEffect } from 'react';
import LandingPageTemplate from '../../landing/LandingPageTemplate';
import Header from '../../landing/components/Header';
import { getThemeClasses } from '@/utils/theme';

interface MobilePreviewOptimizedProps {
  pageContent: any;
  pageStyle: any;
  sectionState: {
    expandedSections: Record<string, boolean>;
    visibleSections: Record<string, boolean>;
    sectionOrder: string[];
  };
  onSectionSelect: (sectionId: string) => void;
}

export default function MobilePreviewOptimized({ 
  pageContent, 
  pageStyle, 
  sectionState, 
  onSectionSelect 
}: MobilePreviewOptimizedProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [showSectionOverlay, setShowSectionOverlay] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle touch/mouse events for section selection
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragCurrent({ x: clientX, y: clientY });
    setShowSectionOverlay(true);
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setDragCurrent({ x: clientX, y: clientY });
  };

  const handleEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.changedTouches[0].clientY : e.clientY;
    
    const deltaX = Math.abs(clientX - dragStart.x);
    const deltaY = Math.abs(clientY - dragStart.y);
    
    // If it's a tap (small movement), try to select section
    if (deltaX < 10 && deltaY < 10) {
      const element = document.elementFromPoint(clientX, clientY);
      if (element) {
        // Look for section indicators or try to determine section from element
        const sectionElement = element.closest('[data-section]');
        if (sectionElement) {
          const sectionId = sectionElement.getAttribute('data-section');
          if (sectionId) {
            onSectionSelect(sectionId);
          }
        }
      }
    }
    
    setIsDragging(false);
    setShowSectionOverlay(false);
    setHoveredSection(null);
  };

  // Section overlay for visual feedback
  const renderSectionOverlay = () => {
    if (!showSectionOverlay || !containerRef.current) return null;

    const containerRect = containerRef.current.getBoundingClientRect();
    const overlayStyle = {
      position: 'absolute' as const,
      left: Math.min(dragStart.x, dragCurrent.x) - containerRect.left,
      top: Math.min(dragStart.y, dragCurrent.y) - containerRect.top,
      width: Math.abs(dragCurrent.x - dragStart.x),
      height: Math.abs(dragCurrent.y - dragStart.y),
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '2px solid rgba(59, 130, 246, 0.5)',
      borderRadius: '8px',
      pointerEvents: 'none' as const,
      zIndex: 10
    };

    return <div style={overlayStyle} />;
  };


  return (
    <div className="h-full relative">
      {/* Mobile Layout - Full screen preview without iPhone mockup */}
      <div className="lg:hidden h-full w-full flex flex-col" style={{ overscrollBehavior: 'contain' }}>
        {/* Fixed Header */}
        <div className="flex-shrink-0">
          <Header
            config={{ 
              ...pageContent, 
              theme: pageStyle?.theme,
              sectionOrder: sectionState.sectionOrder 
            }}
            theme={pageStyle?.theme}
            themeClasses={getThemeClasses(pageStyle?.theme)}
            previewMode="mobile"
            onSectionSelect={onSectionSelect}
          />
        </div>
        
        {/* Scrollable Content */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden mobile-scrollbar-overlay relative bg-white"
          style={{ 
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch'
          }}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={() => {
            setIsDragging(false);
            setShowSectionOverlay(false);
          }}
        >
          <LandingPageTemplate 
            config={{ 
              ...pageContent, 
              theme: pageStyle?.theme,
              sectionOrder: sectionState.sectionOrder 
            }} 
            pageId="preview"
            previewMode="mobile"
            visibleSections={sectionState.visibleSections}
            onSectionSelect={onSectionSelect}
            hideHeader={true} // Hide header since we're showing it separately
          />
          
          {/* Section Overlay */}
          {renderSectionOverlay()}
        </div>
      </div>

      {/* Desktop Layout - iPhone Mockup Container */}
      <div className="hidden lg:flex justify-center items-center py-4 px-4 h-full">
        <div className="relative w-full max-w-sm">
          {/* iPhone Frame - Responsive with iPhone ratio */}
          <div className="w-full aspect-[9/19.5] max-w-[320px] mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-[1.75rem] p-1 shadow-2xl">
            {/* Screen Bezel */}
            <div className="w-full h-full bg-black rounded-[1.5rem] p-1">
              {/* iPhone Screen */}
              <div className="w-full h-full bg-black rounded-[1.25rem] overflow-hidden relative">
                {/* Content Area with Mobile Scrollbar */}
                <div 
                  ref={containerRef}
                  className="h-full overflow-auto mobile-scrollbar-overlay relative"
                  onTouchStart={handleStart}
                  onTouchMove={handleMove}
                  onTouchEnd={handleEnd}
                  onMouseDown={handleStart}
                  onMouseMove={handleMove}
                  onMouseUp={handleEnd}
                  onMouseLeave={() => {
                    setIsDragging(false);
                    setShowSectionOverlay(false);
                  }}
                >
                  <div className="mobile-preview-container">
                    <LandingPageTemplate 
                      config={{ 
                        ...pageContent, 
                        theme: pageStyle?.theme,
                        sectionOrder: sectionState.sectionOrder 
                      }} 
                      pageId="preview"
                      previewMode="mobile"
                      visibleSections={sectionState.visibleSections}
                      onSectionSelect={onSectionSelect}
                    />
                  </div>
                  
                  {/* Section Overlay */}
                  {renderSectionOverlay()}
                </div>
              </div>
            </div>
          </div>
          
          {/* Home Indicator */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-80"></div>
        </div>
      </div>

      {/* Touch Instructions - Mobile only */}
      <div className="absolute top-4 left-4 right-4 z-30 lg:hidden">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 text-center">
          <p className="text-xs text-neutral-300">
            Tap sections to edit • Drag to select area
          </p>
        </div>
      </div>

    </div>
  );
}
