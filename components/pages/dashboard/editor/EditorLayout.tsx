"use client";
import React from "react";
import EditPanel from "../../../features/editor/panels/EditPanel";
import PreviewHeader from "../../../features/editor/PreviewHeader";
import MobilePreview from "./MobilePreview";
import DesktopPreview from "./DesktopPreview";

interface EditorLayoutProps {
  // Edit Panel Props
  sidePanelCollapsed: boolean;
  selectedSection: string;
  editPanelView: 'main' | 'section' | 'business' | 'theme' | 'layout';
  pageContent: any;
  pageStyle: any;
  sectionState: {
    expandedSections: Record<string, boolean>;
    visibleSections: Record<string, boolean>;
    sectionOrder: string[];
  };
  onPageContentChange: (path: string, value: any) => void;
  onPageStyleChange: (path: string, value: any) => void;
  onSectionSelect: (sectionId: string) => void;
  onBackToMain: () => void;
  onSectionToggle: (sectionName: string) => void;
  onSectionVisibilityToggle: (sectionName: string) => void;
  onSectionOrderUpdate: (newOrder: string[]) => void;
  
  // Preview Props
  previewMode: 'desktop' | 'mobile';
  onPreviewModeChange: (mode: 'desktop' | 'mobile') => void;
  onRegenerate: () => void;
  regenerating: boolean;
}

export default function EditorLayout({
  sidePanelCollapsed,
  selectedSection,
  editPanelView,
  pageContent,
  pageStyle,
  sectionState,
  onPageContentChange,
  onPageStyleChange,
  onSectionSelect,
  onBackToMain,
  onSectionToggle,
  onSectionVisibilityToggle,
  onSectionOrderUpdate,
  previewMode,
  onPreviewModeChange,
  onRegenerate,
  regenerating
}: EditorLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row h-full bg-black">
      {/* Edit Panel - Desktop Sidebar - Now on the left */}
      <div className={`hidden lg:flex ${
        sidePanelCollapsed ? 'w-0 overflow-hidden' : 'w-96'
      } pr-1 pt-0 pb-2 pl-2 transition-all duration-300`}>
        <div className="rounded-lg border border-[#2D2D2D] overflow-hidden h-full flex flex-col w-full" style={{ backgroundColor: '#0A0A0A' }}>
          <EditPanel
            selectedSection={selectedSection}
            view={editPanelView}
            pageContent={pageContent}
            pageStyle={pageStyle}
            sectionState={sectionState}
            onPageContentChange={onPageContentChange}
            onPageStyleChange={onPageStyleChange}
            onSectionSelect={(sectionId: string) => {
              if (sectionId === 'back') {
                onBackToMain();
              } else {
                onSectionSelect(sectionId);
              }
            }}
            onBackToMain={onBackToMain}
            onSectionToggle={onSectionToggle}
            onSectionVisibilityToggle={onSectionVisibilityToggle}
            onSectionOrderUpdate={onSectionOrderUpdate}
          />
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Container with rounded corners */}
        <div className="flex-1 overflow-auto pl-1 pr-2 pt-0 pb-2">
          <div className="bg-neutral-900 rounded-lg border border-[#2D2D2D] overflow-hidden h-full flex flex-col">
            {/* Preview Header */}
            <PreviewHeader
              previewMode={previewMode}
              onPreviewModeChange={onPreviewModeChange}
              onRegenerate={onRegenerate}
              regenerating={regenerating}
            />
            
            {/* Preview Content */}
            <div className="flex-1 overflow-auto" style={{ backgroundColor: '#0A0A0A' }}>
              {previewMode === 'mobile' ? (
                <MobilePreview
                  pageContent={pageContent}
                  pageStyle={pageStyle}
                  sectionState={sectionState}
                  onSectionSelect={onSectionSelect}
                />
              ) : (
                <DesktopPreview
                  pageContent={pageContent}
                  pageStyle={pageStyle}
                  sectionState={sectionState}
                  onSectionSelect={onSectionSelect}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
