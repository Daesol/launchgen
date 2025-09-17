"use client";
import React, { useEffect } from "react";
import MobilePreviewQR from "../../../widgets/MobilePreviewQR";
import LandingPageTemplate from "../../landing/LandingPageTemplate";
import EditPanel from "../../../features/editor/panels/EditPanel";
import PreviewHeader from "../../../features/editor/PreviewHeader";

// Import our new hooks and components
import { usePageEditor } from "../../../features/editor/hooks/usePageEditor";
import { useFieldAutoSave } from "../../../features/editor/hooks/useFieldAutoSave";
import { useSectionManagement } from "../../../features/editor/hooks/useSectionManagement";
import { useEventHandlers } from "../../../features/editor/hooks/useEventHandlers";
import { usePreviewMode } from "../hooks/usePreviewMode";
import { useEditorLayout } from "../hooks/useEditorLayout";
import EditorLayout from "./EditorLayout";

interface PageEditorProps {
  initialConfig: any; // Should contain page_content, page_style, template_id, id (if editing)
  onSave?: (config: any) => void;
  saveStatus?: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved?: Date | null;
}

export default function PageEditor({ initialConfig, onSave, saveStatus = 'saved', lastSaved }: PageEditorProps) {
  // Full screen preview state
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  // Use our custom hooks for all the logic
  const {
    state: {
      pageContent,
      pageStyle,
      templateId,
      id,
      saving,
      originalPrompt,
      published,
      error,
      sidePanelCollapsed,
      regenerating,
      showErrorToast,
      hasUnsavedChanges,
      publishedUrl,
    },
    setPageContent,
    setPageStyle,
    handleSave,
    handlePublish,
    handleRegenerate,
    setError,
    clearError,
  } = usePageEditor(initialConfig, onSave);

  // Preview mode management
  const { previewMode, setPreviewMode } = usePreviewMode('desktop');
  
  // Full screen toggle function
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  
  // Editor layout management
  const {
    selectedSection,
    editPanelView,
    showSidePanel,
    handleSectionSelect,
    handleBackToMain,
    toggleSidePanel,
    closeSidePanel
  } = useEditorLayout();

  // Section management
  const sectionManagement = useSectionManagement();
  const sectionState = sectionManagement.sectionState;

  // Field auto-save
  useFieldAutoSave(
    async (fieldPath: string, value: any) => {
      if (!id || !onSave) return;
      
      try {
        const config: any = {
          page_content: pageContent,
          page_style: pageStyle,
          template_id: templateId,
          id: id
        };

        // Update the specific field
        const newConfig = { ...config };
        const pathParts = fieldPath.split('.');
        let current: any = newConfig;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) {
            current[pathParts[i]] = {};
          }
          current = current[pathParts[i]];
        }
        
        current[pathParts[pathParts.length - 1]] = value;

        await onSave(newConfig);
      } catch (error) {
        console.error('Error auto-saving field:', error);
      }
    }
  );

  // Event handlers
  const {
    handleSetPreviewMode,
    handlePreviewPage,
    handleRegeneratePage,
    handlePublishPage,
    handleTitleUpdate,
  } = useEventHandlers({
    onSetPreviewMode: (mode) => {
      setPreviewMode(mode);
    },
    onPreviewPage: async () => {
      await handleSave();
      if (id && initialConfig.slug) {
        window.open(`/page/${initialConfig.slug}`, '_blank');
      }
    },
    onRegeneratePage: handleRegenerate,
    onPublishPage: handlePublish,
    onTitleUpdate: (title) => {
      // Handle title update
      console.log('Title updated:', title);
    }
  });

  // Handle page content changes
  const handlePageContentChange = (path: string, value: any) => {
    setPageContent((prevContent: any) => {
      const newContent = { ...prevContent };
      const pathParts = path.split('.');
      let current = newContent;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = value;
      
      console.log('PageEditor - New pageContent after change:', newContent);
      return newContent;
    });
  };

  // Handle page style changes
  const handlePageStyleChange = (path: string, value: any) => {
    setPageStyle((prevStyle: any) => {
      const newStyle = { ...prevStyle };
      const pathParts = path.split('.');
      let current = newStyle;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = value;
      
      console.log('PageEditor - New pageStyle after change:', newStyle);
      return newStyle;
    });
  };

  // Handle section selection from preview
  const handleSectionSelectFromPreview = (sectionId: string) => {
    handleSectionSelect(sectionId);
  };

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = () => {
    toggleSidePanel();
  };

  // Handle mobile sidebar close
  const handleMobileSidebarClose = () => {
    closeSidePanel();
  };

  // Listen for preview mode change events
  useEffect(() => {
    const handlePreviewModeChange = (event: CustomEvent) => {
      setPreviewMode(event.detail);
    };

    window.addEventListener('set-preview-mode', handlePreviewModeChange as EventListener);
    return () => {
      window.removeEventListener('set-preview-mode', handlePreviewModeChange as EventListener);
    };
  }, [setPreviewMode]);

  // Manage full screen mode - hide header when in full screen
  useEffect(() => {
    const header = document.querySelector('header');
    if (header) {
      if (isFullScreen) {
        header.style.display = 'none';
      } else {
        header.style.display = '';
      }
    }

    // Cleanup on unmount
    return () => {
      const header = document.querySelector('header');
      if (header) {
        header.style.display = '';
      }
    };
  }, [isFullScreen]);

  return (
    <div className="flex flex-col lg:flex-row h-full bg-black">
      {/* Edit Panel - Desktop Sidebar - Hidden in full screen mode */}
      {!isFullScreen && (
        <div className={`hidden lg:flex ${
          sidePanelCollapsed ? 'w-0 overflow-hidden' : 'w-96'
        } pr-1 pt-0 pb-2 pl-2 transition-all duration-300`}>
          <div className="rounded-lg border border-[#2D2D2D] overflow-hidden h-full flex flex-col w-full" style={{ backgroundColor: '#0A0A0A' }}>
            <EditPanel
              selectedSection={selectedSection}
              view={editPanelView as any}
              pageContent={pageContent}
              pageStyle={pageStyle}
              sectionState={sectionState}
              onPageContentChange={handlePageContentChange}
              onPageStyleChange={handlePageStyleChange}
              onSectionSelect={(sectionId: string) => {
                if (sectionId === 'back') {
                  handleBackToMain();
                } else {
                  handleSectionSelectFromPreview(sectionId);
                }
              }}
              onBackToMain={handleBackToMain}
              onSectionToggle={sectionManagement.toggleSection}
              onSectionVisibilityToggle={sectionManagement.toggleSectionVisibility}
              onSectionOrderUpdate={sectionManagement.updateSectionOrder}
            />
          </div>
        </div>
      )}

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Container with rounded corners */}
        <div className={`flex-1 overflow-auto ${isFullScreen ? 'px-0 py-0' : 'pl-1 pr-2 pt-0 pb-2'}`}>
          <div className={`${isFullScreen ? 'h-full' : 'bg-neutral-900 rounded-lg border border-[#2D2D2D]'} overflow-hidden h-full flex flex-col`}>
            {/* Preview Header - Always visible */}
            <PreviewHeader
              previewMode={previewMode}
              onPreviewModeChange={setPreviewMode}
              onRegenerate={handleRegenerate}
              regenerating={regenerating}
              isFullScreen={isFullScreen}
              onToggleFullScreen={toggleFullScreen}
              pageUrl={publishedUrl}
              pageId={id || ''}
              previewUrl={id && initialConfig.slug ? `${window.location.origin}/page/${initialConfig.slug}` : undefined}
              isPublished={published}
            />
            
            {/* Preview Content */}
            <div className="flex-1 overflow-auto" style={{ backgroundColor: '#0A0A0A', height: '100%' }}>
              {previewMode === 'mobile' ? (
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
                                onSectionSelect={handleSectionSelectFromPreview}
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
              ) : (
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
                    onSectionSelect={handleSectionSelectFromPreview}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidePanel && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute left-0 top-0 h-full w-80 bg-black border-r border-[#2D2D2D] shadow-xl">
            <EditPanel
              selectedSection={selectedSection}
              view={editPanelView as any}
              pageContent={pageContent}
              pageStyle={pageStyle}
              sectionState={sectionState}
              onPageContentChange={handlePageContentChange}
              onPageStyleChange={handlePageStyleChange}
              onSectionSelect={(sectionId: string) => {
                if (sectionId === 'back') {
                  handleBackToMain();
                } else {
                  handleSectionSelectFromPreview(sectionId);
                }
              }}
              onBackToMain={handleBackToMain}
              onSectionToggle={sectionManagement.toggleSection}
              onSectionVisibilityToggle={sectionManagement.toggleSectionVisibility}
              onSectionOrderUpdate={sectionManagement.updateSectionOrder}
            />
          </div>
        </div>
      )}

      {/* Sticky Show Editor Button - Mobile Only */}
      {!showSidePanel && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={handleMobileSidebarToggle}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Show Editor
          </button>
        </div>
      )}

    </div>
  );
}
