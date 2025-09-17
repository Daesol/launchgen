"use client";
import React from "react";
import LandingPageTemplate from "../../landing/LandingPageTemplate";

interface DesktopPreviewProps {
  pageContent: any;
  pageStyle: any;
  sectionState: {
    sectionOrder: string[];
    visibleSections: Record<string, boolean>;
  };
  onSectionSelect: (sectionId: string) => void;
}

export default function DesktopPreview({ 
  pageContent, 
  pageStyle, 
  sectionState, 
  onSectionSelect 
}: DesktopPreviewProps) {
  return (
    <div className="w-full min-h-full max-w-none">
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
  );
}
