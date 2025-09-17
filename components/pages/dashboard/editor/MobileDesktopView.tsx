"use client";
import React, { useState, useRef, useEffect } from 'react';
import LandingPageTemplate from '../../landing/LandingPageTemplate';

interface MobileDesktopViewProps {
  pageContent: any;
  pageStyle: any;
  sectionState: {
    expandedSections: Record<string, boolean>;
    visibleSections: Record<string, boolean>;
    sectionOrder: string[];
  };
  onSectionSelect: (sectionId: string) => void;
}

export default function MobileDesktopView({ 
  pageContent, 
  pageStyle, 
  sectionState, 
  onSectionSelect 
}: MobileDesktopViewProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  };

  const handleResetZoom = () => {
    setZoomLevel(0.5);
    setPosition({ x: 0, y: 0 });
  };

  // Handle touch/mouse events for panning
  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (zoomLevel <= 0.5) return; // Only allow panning when zoomed in
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragCurrent({ x: clientX, y: clientY });
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 0.5) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    
    setPosition(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setDragStart({ x: clientX, y: clientY });
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  // Handle section selection
  const handleSectionClick = (e: React.MouseEvent) => {
    if (isDragging) return;
    
    const element = e.target as HTMLElement;
    const sectionElement = element.closest('[data-section]');
    if (sectionElement) {
      const sectionId = sectionElement.getAttribute('data-section');
      if (sectionId) {
        onSectionSelect(sectionId);
      }
    }
  };

  return (
    <div className="h-full w-full bg-black relative overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 z-20 flex flex-col space-y-1">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-black/80 backdrop-blur-sm text-white rounded flex items-center justify-center text-sm font-bold hover:bg-black/90 transition-colors"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-black/80 backdrop-blur-sm text-white rounded flex items-center justify-center text-sm font-bold hover:bg-black/90 transition-colors"
        >
          −
        </button>
        <button
          onClick={handleResetZoom}
          className="w-8 h-8 bg-black/80 backdrop-blur-sm text-white rounded flex items-center justify-center text-xs hover:bg-black/90 transition-colors"
        >
          ⌂
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-2 left-2 z-20 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
        {Math.round(zoomLevel * 100)}%
      </div>

      {/* Instructions */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-black/80 backdrop-blur-sm text-white px-3 py-1 rounded text-xs">
        {zoomLevel <= 0.5 ? 'Pinch to zoom • Tap sections to edit' : 'Drag to pan • Tap sections to edit'}
      </div>

      {/* Desktop Preview Container */}
      <div 
        ref={containerRef}
        className="h-full w-full overflow-hidden relative"
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onClick={handleSectionClick}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        <div
          className="origin-top-left transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
            width: `${100 / zoomLevel}%`,
            height: `${100 / zoomLevel}%`
          }}
        >
          <LandingPageTemplate 
            config={{ 
              ...pageContent, 
              theme: pageStyle?.theme,
              sectionOrder: sectionState.sectionOrder 
            }} 
            pageId="preview"
            previewMode="desktop"
            visibleSections={sectionState.visibleSections}
            onSectionSelect={onSectionSelect}
          />
        </div>
      </div>

      {/* Section Quick Access */}
      <div className="absolute bottom-2 left-2 right-2 z-20">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2">
          <div className="flex flex-wrap gap-1 justify-center">
            {sectionState.sectionOrder.slice(0, 8).map((sectionId) => {
              const isVisible = sectionState.visibleSections[sectionId];
              const sectionNames: Record<string, string> = {
                'business': 'Business',
                'hero': 'Hero',
                'problemSection': 'Problem',
                'features': 'Features',
                'socialProof': 'Social',
                'pricing': 'Pricing',
                'guarantees': 'Guarantees',
                'faq': 'FAQ',
                'cta': 'CTA',
                'urgency': 'Urgency'
              };
              
              return (
                <button
                  key={sectionId}
                  onClick={() => onSectionSelect(sectionId)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                    isVisible
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                  }`}
                >
                  {sectionNames[sectionId] || sectionId}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
