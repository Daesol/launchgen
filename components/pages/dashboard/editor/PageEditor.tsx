"use client";
import React, { useEffect, useCallback } from "react";
import MobilePreviewQR from "../../../widgets/MobilePreviewQR";
import LandingPageTemplate from "../../landing/LandingPageTemplate";
import EditPanel from "../../../features/editor/panels/EditPanel";
import PreviewHeader from "../../../features/editor/PreviewHeader";
import MobileEditor from "./MobileEditor";
import MobileSectionEditor from "./MobileSectionEditor";
import MobilePreviewOptimized from "./MobilePreviewOptimized";

// Import our new hooks and components
import { usePageEditor } from "../../../features/editor/hooks/usePageEditor";
import { useFieldAutoSave } from "../../../features/editor/hooks/useFieldAutoSave";
import { useSectionManagement } from "../../../features/editor/hooks/useSectionManagement";
import { useEventHandlers } from "../../../features/editor/hooks/useEventHandlers";
import { usePreviewMode } from "../hooks/usePreviewMode";
import { useEditorLayout } from "../hooks/useEditorLayout";
import EditorLayout from "./EditorLayout";

// SIMPLIFIED: Removed complex refactor hooks

interface PageEditorProps {
  initialConfig: any; // Should contain page_content, page_style, template_id, id (if editing)
  onSave?: (config: any) => void;
  saveStatus?: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved?: Date | null;
  isPublishing?: boolean;
  onPublishingChange?: (isPublishing: boolean) => void;
}

export default function PageEditor({ initialConfig, onSave, saveStatus = 'saved', lastSaved, isPublishing = false, onPublishingChange }: PageEditorProps) {
  // Full screen preview state
  const [isFullScreen, setIsFullScreen] = React.useState(false);
  
  // Mobile editor states
  const [showMobileEditor, setShowMobileEditor] = React.useState(false);
  const [showMobileSectionEditor, setShowMobileSectionEditor] = React.useState(false);

  // Success message state
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  
  // QR code auto-open state
  const [shouldAutoOpenQR, setShouldAutoOpenQR] = React.useState(false);

  // Notify parent components about publishing state changes
  React.useEffect(() => {
    if (onPublishingChange) {
      onPublishingChange(isPublishing);
    }
  }, [isPublishing, onPublishingChange]);

  // SIMPLIFIED: Remove complex refactor, use existing system

  // Legacy: Keep existing usePageEditor for backward compatibility
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
    setPageContent: legacySetPageContent,
    setPageStyle: legacySetPageStyle,
    handleSave: legacyHandleSave,
    handlePublish: originalHandlePublish,
    handleRegenerate,
    setError,
    clearError,
  } = usePageEditor(initialConfig, onSave);

  // Section management - pass initial values from saved data
  const initialVisibleSections = pageContent?.visibleSections;
  const initialSectionOrder = pageContent?.sectionOrder;
  
  // Debug logging
  console.log('PageEditor - initialVisibleSections:', initialVisibleSections);
  console.log('PageEditor - initialSectionOrder:', initialSectionOrder);
  console.log('PageEditor - pageContent:', pageContent);
  console.log('PageEditor - pageContent keys:', pageContent ? Object.keys(pageContent) : 'no pageContent');
  
  // Handle section changes by updating pageContent directly
  const handleSectionChange = useCallback((visibleSections: Record<string, boolean>, sectionOrder: string[]) => {
    console.log('PageEditor - Section change detected, updating pageContent:', {
      visibleSections,
      sectionOrder
    });
    
    // Update pageContent directly with section visibility - this will trigger auto-save
    legacySetPageContent((prevContent: any) => ({
      ...prevContent,
      visibleSections,
      sectionOrder,
    }));
  }, [legacySetPageContent]);

  const sectionManagement = useSectionManagement(initialVisibleSections, initialSectionOrder, handleSectionChange);
  const sectionState = sectionManagement.sectionState;

  // Create a wrapper for handlePublish that manages external publishing state and includes section state
  const handlePublish = React.useCallback(async () => {
    if (onPublishingChange) {
      onPublishingChange(true);
    }
    try {
      // First, call the original handlePublish to update publishedUrl and show modal
      await originalHandlePublish();
      
      // Then do our custom save with section state
      const config = {
        page_content: pageContent,
        page_style: pageStyle,
        template_id: templateId,
        id: id,
        original_prompt: originalPrompt,
        published: true,
        visibleSections: sectionState.visibleSections,
        sectionOrder: sectionState.sectionOrder,
      };
      
      if (onSave) {
        await onSave(config);
        // Trigger QR code auto-open after successful publish
        setShouldAutoOpenQR(true);
        // Reset after a short delay to allow the QR component to process it
        setTimeout(() => setShouldAutoOpenQR(false), 100);
      }
    } finally {
      if (onPublishingChange) {
        onPublishingChange(false);
      }
    }
  }, [pageContent, pageStyle, templateId, id, originalPrompt, sectionState, onSave, onPublishingChange, originalHandlePublish]);

  // Create a wrapper for handleSave that includes section state
  const handleSaveWithSectionState = React.useCallback(async () => {
    const config = {
      page_content: pageContent,
      page_style: pageStyle,
      template_id: templateId,
      id: id,
      original_prompt: originalPrompt,
      visibleSections: sectionState.visibleSections,
      sectionOrder: sectionState.sectionOrder,
    };
    
    if (onSave) {
      await onSave(config);
    }
  }, [pageContent, pageStyle, templateId, id, originalPrompt, sectionState, onSave]);

  // Preview mode management - Force mobile view on mobile devices
  const [isMobile, setIsMobile] = React.useState(false);
  const { previewMode, setPreviewMode } = usePreviewMode('desktop');

  // Detect mobile device and force mobile view
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setPreviewMode('mobile');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setPreviewMode]);
  
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

         // Track previous values to detect actual changes
         const prevVisibleSectionsRef = React.useRef<Record<string, boolean> | null>(null);
         const prevSectionOrderRef = React.useRef<string[] | null>(null);
         const isSavingSectionsRef = React.useRef(false);
         const isInitializedRef = React.useRef(false);
         const saveErrorCountRef = React.useRef(0);
         const maxRetries = 3;
  
  // Only auto-save when there's an actual user-initiated change
  React.useEffect(() => {
    const currentVisibleSections = sectionState.visibleSections;
    const currentSectionOrder = sectionState.sectionOrder;
    
    const autoSaveSectionChanges = async () => {
      if (!id || !onSave || isSavingSectionsRef.current) return;
    
         // Skip auto-save on initial load
         if (!isInitializedRef.current) {
           isInitializedRef.current = true;
           // Set initial values to the loaded data from database, not current state
           prevVisibleSectionsRef.current = initialVisibleSections || null;
           prevSectionOrderRef.current = initialSectionOrder || null;
           return;
         }
    
      // Check if there are actual changes from the previous state
      const hasVisibilityChanges = prevVisibleSectionsRef.current !== null ? 
        JSON.stringify(currentVisibleSections) !== JSON.stringify(prevVisibleSectionsRef.current) : 
        false; // If no previous state, don't consider it a change
      const hasOrderChanges = prevSectionOrderRef.current !== null ? 
        JSON.stringify(currentSectionOrder) !== JSON.stringify(prevSectionOrderRef.current) : 
        false; // If no previous state, don't consider it a change
      
      console.log('Auto-save check:', {
        hasVisibilityChanges,
        hasOrderChanges,
        currentVisibleSections,
        prevVisibleSections: prevVisibleSectionsRef.current,
        currentSectionOrder,
        prevSectionOrder: prevSectionOrderRef.current,
        errorCount: saveErrorCountRef.current,
        initialVisibleSections,
        initialSectionOrder
      });
      
      if (hasVisibilityChanges || hasOrderChanges) {
        // Circuit breaker: stop trying after max retries
        if (saveErrorCountRef.current >= maxRetries) {
          console.warn('Auto-save disabled due to repeated errors. Please refresh the page.');
          return;
        }
        
        isSavingSectionsRef.current = true;
        
             // For section visibility updates, don't pass page_content to avoid conflicts
             // This ensures the API uses the dedicated section visibility update path
             const config = {
               id: id,
               visibleSections: currentVisibleSections,
               sectionOrder: currentSectionOrder,
             };

             console.log('Auto-save config:', config);

             // Skip if both visibleSections and sectionOrder are undefined
             if (currentVisibleSections === undefined && currentSectionOrder === undefined) {
               console.log('Skipping auto-save: both visibleSections and sectionOrder are undefined');
               return;
             }
        
        try {
          await onSave(config);
          console.log('Section visibility/order saved:', { currentVisibleSections, currentSectionOrder });
          
          // Reset error count on successful save
          saveErrorCountRef.current = 0;
          
          // Update the previous values after successful save
          prevVisibleSectionsRef.current = currentVisibleSections;
          prevSectionOrderRef.current = currentSectionOrder;
        } catch (error) {
          console.error('Error auto-saving section changes:', error);
          saveErrorCountRef.current += 1;
        } finally {
          isSavingSectionsRef.current = false;
        }
      }
    };

    autoSaveSectionChanges();
  }, [sectionState.visibleSections, sectionState.sectionOrder, id, onSave]);

  // Field auto-save
  useFieldAutoSave(
    async (fieldPath: string, value: any) => {
      if (!id || !onSave) return;
      
      try {
        const config: any = {
          page_content: pageContent,
          page_style: pageStyle,
          template_id: templateId,
          id: id,
          visibleSections: sectionState.visibleSections,
          sectionOrder: sectionState.sectionOrder,
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
      await legacyHandleSave();
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

  // SIMPLIFIED: Handle page content changes - just use the existing system
  const handlePageContentChange = useCallback((path: string, value: any) => {
    console.log('PageEditor - Content change:', { path, value });
    
    // Use the existing setPageContent which already triggers auto-save
    legacySetPageContent((prevContent: any) => {
      const newContent = { ...prevContent };
      const pathParts = path.split('.');
      let target = newContent;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!target[pathParts[i]]) {
          target[pathParts[i]] = {};
        }
        target = target[pathParts[i]];
      }
      
      target[pathParts[pathParts.length - 1]] = value;
      return newContent;
    });
  }, [legacySetPageContent]);

  // SIMPLIFIED: Handle section visibility changes directly in the section management
  // We'll modify the section management to update pageContent when changes happen

  // SIMPLIFIED: Handle page style changes - just use the existing system
  const handlePageStyleChange = useCallback((path: string, value: any) => {
    console.log('PageEditor - Style change:', { path, value });
    
    // Use the existing setPageStyle which already triggers auto-save
    legacySetPageStyle((prevStyle: any) => {
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
      return newStyle;
    });
  }, [legacySetPageStyle]);

  // Handle section selection from preview
  const handleSectionSelectFromPreview = (sectionId: string) => {
    handleSectionSelect(sectionId);
    // On mobile, show the section editor
    if (window.innerWidth < 1024) {
      setShowMobileSectionEditor(true);
    }
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

    const handleOpenMobileEditor = () => {
      setShowMobileEditor(true);
    };

    window.addEventListener('set-preview-mode', handlePreviewModeChange as EventListener);
    window.addEventListener('open-mobile-editor', handleOpenMobileEditor);
    
    return () => {
      window.removeEventListener('set-preview-mode', handlePreviewModeChange as EventListener);
      window.removeEventListener('open-mobile-editor', handleOpenMobileEditor);
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
    <div 
      className={`flex flex-col lg:flex-row ${isMobile ? 'h-screen' : 'h-full'} bg-black`}
      style={isMobile ? { overscrollBehavior: 'none' } : {}}
    >
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
      <div className={`flex-1 flex flex-col ${isMobile ? 'h-screen' : ''}`} style={isMobile ? { paddingBottom: '100px' } : {}}>
        {/* Preview Container with rounded corners */}
        <div className={`${isFullScreen ? 'h-full' : isMobile ? 'h-full' : 'bg-neutral-900 rounded-lg border border-[#2D2D2D]'} flex flex-col h-full ${isFullScreen ? 'px-0 py-0' : isMobile ? 'px-1 py-1' : 'pl-1 pr-2 pt-0 pb-2'}`}>
          {/* Preview Header - Fixed at top */}
          <div className="flex-shrink-0">
            <PreviewHeader
              previewMode={previewMode}
              onPreviewModeChange={isMobile ? () => {} : setPreviewMode} // Disable mode change on mobile
              onRegenerate={handleRegenerate}
              regenerating={regenerating}
              isFullScreen={isFullScreen}
              onToggleFullScreen={toggleFullScreen}
              pageUrl={publishedUrl}
              pageId={id || ''}
              previewUrl={undefined}
              isPublished={published}
              slug={initialConfig.slug}
              shouldAutoOpenQR={shouldAutoOpenQR}
            />
          </div>
          
          {/* Preview Content - Scrollable area */}
          <div className="flex-1 overflow-auto" style={{ backgroundColor: '#0A0A0A' }}>
              {previewMode === 'mobile' ? (
                <MobilePreviewOptimized
                  pageContent={pageContent}
                  pageStyle={pageStyle}
                  sectionState={sectionState}
                  onSectionSelect={handleSectionSelectFromPreview}
                />
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

      {/* Mobile Editor - Bottom Navigation */}
      <MobileEditor
        selectedSection={selectedSection}
        editPanelView={editPanelView}
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
        onClose={() => setShowMobileEditor(false)}
      />

      {/* Mobile Section Editor - Full Screen */}
      {showMobileSectionEditor && (
        <MobileSectionEditor
          selectedSection={selectedSection}
          pageContent={pageContent}
          onPageContentChange={handlePageContentChange}
          onBack={() => setShowMobileSectionEditor(false)}
          onClose={() => setShowMobileSectionEditor(false)}
        />
      )}

    </div>
  );
}
