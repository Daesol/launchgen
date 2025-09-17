import React from 'react';
import { EditPanelState } from '../types/editor.types';
import ThemePanel from './ThemePanel';
import BusinessPanel from './BusinessPanel';
import LayoutPanel from './LayoutPanel';
import SectionPanel from './SectionPanel';

interface EditPanelProps {
  view: EditPanelState['editPanelView'];
  selectedSection: string | null;
  pageContent: any;
  pageStyle: any;
  onSectionSelect: (sectionId: string) => void;
  onBackToMain: () => void;
  onPageContentChange: (field: string, value: any) => void;
  onPageStyleChange: (field: string, value: any) => void;
  onSectionToggle: (sectionName: string) => void;
  onSectionVisibilityToggle: (sectionName: string) => void;
  onSectionOrderUpdate: (newOrder: string[]) => void;
  sectionState: {
    expandedSections: Record<string, boolean>;
    visibleSections: Record<string, boolean>;
    sectionOrder: string[];
  };
}

export default function EditPanel({
  view,
  selectedSection,
  pageContent,
  pageStyle,
  onSectionSelect,
  onBackToMain,
  onPageContentChange,
  onPageStyleChange,
  onSectionToggle,
  onSectionVisibilityToggle,
  onSectionOrderUpdate,
  sectionState,
}: EditPanelProps) {
  // Render the appropriate panel content based on the current view
  const renderPanelContent = () => {
    switch (view) {
      case 'theme':
        return (
          <ThemePanel
            theme={pageStyle?.theme || { mode: 'white', accentColor: '#6366f1' }}
            onThemeChange={onPageStyleChange}
            onBack={onBackToMain}
          />
        );

      case 'business':
        return (
          <BusinessPanel
            business={pageContent?.business || {}}
            onBusinessChange={onPageContentChange}
            onBack={onBackToMain}
          />
        );

      case 'layout':
        return (
          <LayoutPanel
            sectionState={sectionState}
            onSectionToggle={onSectionToggle}
            onSectionVisibilityToggle={onSectionVisibilityToggle}
            onSectionOrderUpdate={onSectionOrderUpdate}
            onBack={onBackToMain}
          />
        );

      case 'section':
        if (!selectedSection) return null;
        return (
          <SectionPanel
            sectionId={selectedSection}
            pageContent={pageContent}
            onPageContentChange={onPageContentChange}
            onBack={onBackToMain}
          />
        );

      default:
        return (
          <MainPanel
            onThemeClick={() => onSectionSelect('theme')}
            onBusinessClick={() => onSectionSelect('business')}
            onLayoutClick={() => onSectionSelect('layout')}
            onSectionSelect={onSectionSelect}
          />
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {renderPanelContent()}
    </div>
  );
}

// Main panel with the three main buttons
function MainPanel({
  onThemeClick,
  onBusinessClick,
  onLayoutClick,
  onSectionSelect,
}: {
  onThemeClick: () => void;
  onBusinessClick: () => void;
  onLayoutClick: () => void;
  onSectionSelect: (sectionId: string) => void;
}) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold text-white mb-4">Edit Page</h3>
      
      {/* Main Edit Panel Buttons */}
      <div className="space-y-3">
        <button
          onClick={onThemeClick}
          className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded border border-[#2D2D2D] transition-colors"
        >
          Theme Settings
        </button>
        
        <button
          onClick={onBusinessClick}
          className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded border border-[#2D2D2D] transition-colors"
        >
          Business Info
        </button>
        
        <button
          onClick={onLayoutClick}
          className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 rounded border border-[#2D2D2D] transition-colors"
        >
          Page Layout
        </button>
      </div>
      
      <div className="border-t border-[#2D2D2D] pt-4">
        <p className="text-xs text-neutral-400 text-center">
          Click on any section in the preview to edit its content
        </p>
      </div>
    </div>
  );
}
