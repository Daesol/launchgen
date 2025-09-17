"use client";
import React, { useState, useRef, useEffect } from 'react';
import LandingPageTemplate from '../../landing/LandingPageTemplate';

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

  // Section quick access buttons

  return (
    <div className="w-full relative">
      {/* Full Width Mobile Preview */}
      <div 
        ref={containerRef}
        className="w-full mobile-scrollbar-overlay relative"
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
        <div className="mobile-preview-container w-full">
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
  );
}
