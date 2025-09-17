"use client";
import React from "react";
import LandingPageTemplate from "../../landing/LandingPageTemplate";

interface MobilePreviewProps {
  pageContent: any;
  pageStyle: any;
  sectionState: {
    sectionOrder: string[];
    visibleSections: Record<string, boolean>;
  };
  onSectionSelect: (sectionId: string) => void;
}

export default function MobilePreview({ 
  pageContent, 
  pageStyle, 
  sectionState, 
  onSectionSelect 
}: MobilePreviewProps) {
  return (
    <div className="flex justify-center items-center py-4 px-4 h-full">
      {/* iPhone Mockup Container */}
      <div className="relative w-full max-w-sm">
        {/* iPhone Frame - Responsive with iPhone ratio */}
        <div className="w-full aspect-[9/19.5] max-w-[320px] mx-auto bg-gradient-to-b from-gray-800 to-gray-900 rounded-[1.75rem] p-1 shadow-2xl">
          {/* Screen Bezel */}
          <div className="w-full h-full bg-black rounded-[1.5rem] p-1">
            {/* iPhone Screen */}
            <div className="w-full h-full bg-black rounded-[1.25rem] overflow-hidden relative">
              {/* Content Area with Mobile Scrollbar */}
              <div className="h-full overflow-auto mobile-scrollbar-overlay">
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
              </div>
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-80"></div>
      </div>
    </div>
  );
}
