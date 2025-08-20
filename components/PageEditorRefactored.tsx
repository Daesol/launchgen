"use client";
import React from "react";
import LandingPageTemplate from "./LandingPageTemplate";
import MobilePreviewQR from "./MobilePreviewQR";

// Import our new hooks and components
import { usePageEditor } from "./editor/hooks/usePageEditor";
import { useFieldAutoSave } from "./editor/hooks/useFieldAutoSave";
import { useSectionManagement } from "./editor/hooks/useSectionManagement";
import { useEventHandlers } from "./editor/hooks/useEventHandlers";
import EditPanel from "./editor/panels/EditPanel";

interface PageEditorProps {
  initialConfig: any; // Should contain page_content, page_style, template_id, id (if editing)
  onSave?: (config: any) => void;
  saveStatus?: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved?: Date | null;
}

export default function PageEditorRefactored({ initialConfig, onSave, saveStatus = 'saved', lastSaved }: PageEditorProps) {
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
      previewMode,
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

  // Add missing state variables that are needed for the component
  const [showSidePanel, setShowSidePanel] = React.useState(false);
  const [showPublishModal, setShowPublishModal] = React.useState(false);

  const {
    sectionState,
    editPanelState,
    toggleSection,
    toggleSectionVisibility,
    handleSectionSelect,
    handleBackToMain,
    setEditPanelView,
    setSelectedSection,
    updateSectionOrder,
  } = useSectionManagement();

  // Create a markAsUnsaved function that can be used by the field auto-save hook
  const markAsUnsaved = React.useCallback(() => {
    // This will be handled by the page editor hook
  }, []);

  const {
    handleFieldChange,
    handleFieldBlur,
    initializeFieldTracking,
    hasUnsavedChanges: fieldUnsavedChanges,
    markAsUnsaved: fieldMarkAsUnsaved,
  } = useFieldAutoSave(
    async (fieldPath: string, value: any) => {
      if (!id || !onSave) return;
      
      try {
        const config = {
          page_content: { [fieldPath]: value },
          page_style: pageStyle,
          template_id: templateId,
          id: id,
          original_prompt: originalPrompt,
        };
        await onSave(config);
      } catch (error) {
        throw error;
      }
    },
    markAsUnsaved
  );

  const {
    handleSetPreviewMode,
    handlePreviewPage,
    handleRegeneratePage,
    handlePublishPage,
    handleTitleUpdate,
  } = useEventHandlers({
    onSetPreviewMode: (mode) => {
      // This will be handled by the hook
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
      if (initialConfig) {
        initialConfig.title = title;
      }
    },
  });

  // Initialize field tracking for all existing content
  React.useEffect(() => {
    if (pageContent) {
      const fieldsToTrack = [
        'business.name',
        'business.logo',
        'hero.headline',
        'hero.subheadline',
        'hero.cta',
        'hero.heroTag',
        'hero.heroTagIcon',
        'featuresTitle',
        'featuresSubtitle',
        'ctaTitle',
        'ctaSubtitle'
      ];

      fieldsToTrack.forEach(fieldPath => {
        const value = fieldPath.split('.').reduce((obj: any, key: string) => obj?.[key], pageContent);
        if (value !== undefined) {
          initializeFieldTracking(fieldPath, value);
        }
      });
    }
  }, [pageContent, initializeFieldTracking]);

  // Sync title with top bar when component mounts
  React.useEffect(() => {
    if (id && initialConfig?.title) {
      window.dispatchEvent(new CustomEvent('sync-page-title', { 
        detail: { title: initialConfig.title } 
      }));
    }
  }, [id, initialConfig?.title]);

  // Handle page content changes
  const handlePageContentChange = (field: string, value: any) => {
    const fieldPath = field.includes('.') ? field : field;
    initializeFieldTracking(fieldPath, value);
    handleFieldChange(fieldPath, value);
    
    // Update the page content immediately for real-time preview
    setPageContent((prev: any) => {
      const pathParts = fieldPath.split('.');
      let newContent = { ...prev };
      let current = newContent;
      
      // Navigate to the nested field
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      // Set the final field value
      current[pathParts[pathParts.length - 1]] = value;
      
      return newContent;
    });
  };

  // Handle page style changes
  const handlePageStyleChange = (field: string, value: any) => {
    const fieldPath = field.includes('.') ? field : field;
    handleFieldChange(fieldPath, value);
    
    setPageStyle((prev: any) => {
      const pathParts = fieldPath.split('.');
      let newStyle = { ...prev };
      let current = newStyle;
      
      // Navigate to the nested field
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      // Set the final field value
      current[pathParts[pathParts.length - 1]] = value;
      
      return newStyle;
    });
  };

  // Handle section selection from preview
  const handleSectionSelectFromPreview = (sectionId: string) => {
    setSelectedSection(sectionId);
    setEditPanelView('section');
    
    // Scroll to the selected section in the preview
    const sectionElement = document.getElementById(`section-${sectionId}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Edit Panel - Desktop Sidebar - Now on the left */}
      <div className={`hidden lg:flex ${
        sidePanelCollapsed ? 'w-0 overflow-hidden' : 'w-96'
      } bg-white border-r border-gray-200 flex-col transition-all duration-300`}>
        
        {/* Edit Panel Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit Page</h2>
        </div>

        {/* Edit Panel Content */}
        <EditPanel
          view={editPanelState.editPanelView}
          selectedSection={editPanelState.selectedSection}
          pageContent={pageContent}
          pageStyle={pageStyle}
          onSectionSelect={(sectionId) => {
            if (sectionId === 'theme' || sectionId === 'business' || sectionId === 'layout') {
              setEditPanelView(sectionId);
            } else {
              handleSectionSelectFromPreview(sectionId);
            }
          }}
          onBackToMain={handleBackToMain}
          onPageContentChange={handlePageContentChange}
          onPageStyleChange={handlePageStyleChange}
          onSectionToggle={toggleSection}
          onSectionVisibilityToggle={toggleSectionVisibility}
          onSectionOrderUpdate={updateSectionOrder}
          sectionState={sectionState}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Preview Content */}
        <div className="flex-1 overflow-auto">
          {previewMode === 'mobile' ? (
            <div className="max-w-sm mx-auto p-4">
              <MobilePreviewQR 
                pageUrl={`/page/${initialConfig?.slug || 'preview'}`}
                pageId={id || 'preview'}
              />
            </div>
          ) : (
            <div className="w-full max-w-none">
              <LandingPageTemplate 
                config={{ ...pageContent, theme: pageStyle?.theme }} 
                pageId={id || 'preview'}
                onSectionSelect={handleSectionSelectFromPreview}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidePanel && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Edit Page</h2>
                <button
                  onClick={() => setShowSidePanel(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <EditPanel
              view={editPanelState.editPanelView}
              selectedSection={editPanelState.selectedSection}
              pageContent={pageContent}
              pageStyle={pageStyle}
              onSectionSelect={(sectionId) => {
                if (sectionId === 'theme' || sectionId === 'business' || sectionId === 'layout') {
                  setEditPanelView(sectionId);
                } else {
                  handleSectionSelectFromPreview(sectionId);
                }
              }}
              onBackToMain={handleBackToMain}
              onPageContentChange={handlePageContentChange}
              onPageStyleChange={handlePageStyleChange}
              onSectionToggle={toggleSection}
              onSectionVisibilityToggle={toggleSectionVisibility}
              onSectionOrderUpdate={updateSectionOrder}
              sectionState={sectionState}
            />
          </div>
        </div>
      )}

      {/* Sticky Show Editor Button - Mobile Only */}
      {!showSidePanel && (
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setShowSidePanel(true)}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Show Editor
          </button>
        </div>
      )}

      {/* Publish Success Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Published Successfully!</h3>
              <p className="text-sm text-gray-600 mb-4">Your landing page is now live and ready to share.</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">Published URL</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={publishedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(publishedUrl)}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">QR Code</label>
                <div className="flex justify-center">
                  <MobilePreviewQR 
                    pageUrl={publishedUrl}
                    pageId={id || ''}
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.open(publishedUrl, '_blank');
                    setShowPublishModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Toast */}
      {showErrorToast && error && (
        <div className="fixed bottom-4 left-4 right-4 sm:right-4 sm:left-auto bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-md mx-auto sm:mx-0">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold mb-1">Regeneration Failed</h4>
              <p className="text-sm opacity-90 mb-2">{error}</p>
              <p className="text-xs opacity-75">
                Your original content has been preserved. You can try regenerating again or contact support if the issue persists.
              </p>
            </div>
            <button
              onClick={clearError}
              className="flex-shrink-0 text-white hover:text-gray-200 text-lg font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 