import { useState, useEffect, useCallback } from 'react';
import { 
  PageContent, 
  PageStyle, 
  PageEditorState, 
  UsePageEditorReturn,
  PageEditorProps 
} from '../types/editor.types';

export function usePageEditor(
  initialConfig: PageEditorProps['initialConfig'],
  onSave?: PageEditorProps['onSave']
): UsePageEditorReturn {
  // Default content structure
  const defaultContent: PageContent = {
    business: { name: '', logo: '' },
    hero: { 
      headline: '', 
      headlineHighlights: [], 
      subheadline: '', 
      cta: '', 
      heroTag: '', 
      heroTagIcon: '' 
    },
    problemSection: {
      title: '',
      subtitle: '',
      painPoints: []
    },
    socialProof: {
      title: '',
      subtitle: '',
      testimonials: [],
      stats: []
    },
    features: [],
    featuresTitle: '',
    featuresSubtitle: '',
    guarantees: {
      title: '',
      subtitle: '',
      guarantees: []
    },
    faq: {
      title: '',
      subtitle: '',
      questions: []
    },
    cta: {
      title: '',
      subtitle: '',
      buttonText: ''
    },
    urgency: {
      enabled: false,
      message: '',
      deadline: ''
    },
    sectionOrder: [
      'problemSection',
      'features',
      'socialProof',
      'guarantees', 
      'faq',
      'cta'
    ],
  };

  // Extract initial values from config
  const {
    page_content: initialContent = defaultContent,
    page_style: initialStyle = {},
    template_id: initialTemplateId = 'default',
    id: initialId = undefined,
    original_prompt: initialOriginalPrompt = "",
  } = initialConfig || {};

  // Handle legacy themeColors structure
  const legacyTheme = initialStyle?.themeColors ? {
    mode: 'white' as const,
    accentColor: initialStyle.themeColors.accentColor || initialStyle.themeColors.primaryColor || '#6366f1',
  } : {
    mode: 'white' as const,
    accentColor: '#6366f1',
  };

  const processedInitialStyle: PageStyle = {
    theme: initialStyle?.theme || legacyTheme,
  };

  // Merge AI-generated content with defaults if it exists
  const mergedContent = initialConfig?.page_content ? {
    ...defaultContent,
    ...initialConfig.page_content,
    // Ensure nested objects are properly merged
    business: { ...defaultContent.business, ...initialConfig.page_content.business },
    hero: { ...defaultContent.hero, ...initialConfig.page_content.hero },
    problemSection: { ...defaultContent.problemSection, ...initialConfig.page_content.problemSection },
    socialProof: { ...defaultContent.socialProof, ...initialConfig.page_content.socialProof },
    guarantees: { ...defaultContent.guarantees, ...initialConfig.page_content.guarantees },
    faq: { ...defaultContent.faq, ...initialConfig.page_content.faq },
    urgency: { ...defaultContent.urgency, ...initialConfig.page_content.urgency },
  } : defaultContent;

  // Main state
  const [pageContent, setPageContent] = useState<PageContent>(mergedContent);
  const [pageStyle, setPageStyle] = useState<PageStyle>(processedInitialStyle);
  const [templateId, setTemplateId] = useState<string>(initialTemplateId);
  const [id, setId] = useState<string | undefined>(initialId);
  const [saving, setSaving] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState<string>(initialOriginalPrompt);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [sidePanelCollapsed, setSidePanelCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string>('');

  // Set preview mode based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setPreviewMode('desktop');
      } else {
        setPreviewMode('mobile');
      }
    };

    // Set initial mode
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug logging for initial content
  useEffect(() => {
    console.log('Initial content loaded:', initialContent);
    console.log('Page content state:', pageContent);
    console.log('Merged content:', mergedContent);
    console.log('Initial config:', initialConfig);
    console.log('Original prompt:', originalPrompt);
  }, [initialContent, pageContent, mergedContent, initialConfig, originalPrompt]);

  // Auto-save functionality
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    const timer = setTimeout(() => {
      if (hasUnsavedChanges && onSave) {
        handleSave();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity
    
    setAutoSaveTimer(timer);
  }, [autoSaveTimer, hasUnsavedChanges, onSave]);

  // Mark changes as unsaved
  const markAsUnsaved = useCallback(() => {
    setHasUnsavedChanges(true);
    scheduleAutoSave();
  }, [scheduleAutoSave]);

  // Save handlers
  const handleSave = useCallback(async () => {
    setSaving(true);
    setError("");
    
    try {
      const config = {
        page_content: pageContent,
        page_style: pageStyle,
        template_id: templateId,
        id: id,
        original_prompt: originalPrompt,
      };
      
      if (onSave) {
        await onSave(config);
      }
      
      setSaving(false);
      setHasUnsavedChanges(false);
    } catch (err) {
      setError("Failed to save page");
      setSaving(false);
    }
  }, [pageContent, pageStyle, templateId, id, originalPrompt, onSave]);

  const handlePublish = useCallback(async () => {
    setSaving(true);
    setError("");
    
    try {
      const config = {
        page_content: pageContent,
        page_style: pageStyle,
        template_id: templateId,
        id: id,
        original_prompt: originalPrompt,
        published: true,
      };
      
      if (onSave) {
        await onSave(config);
      }
      
      setPublished(true);
      setSaving(false);
      
      // Generate the published URL and show modal
      if (id && initialConfig.slug) {
        const url = `${window.location.origin}/page/${initialConfig.slug}`;
        setPublishedUrl(url);
        setShowPublishModal(true);
      }
    } catch (err) {
      setError("Failed to publish page");
      setSaving(false);
    }
  }, [pageContent, pageStyle, templateId, id, originalPrompt, onSave, initialConfig.slug]);

  const handleRegenerate = useCallback(async () => {
    setRegenerating(true);
    setError("");
    setShowErrorToast(false);
    
    // Store current content as backup
    const originalContent = { ...pageContent };
    const originalStyle = { ...pageStyle };
    
    // Ensure we have the original prompt for regeneration
    console.log('Checking original prompt for regeneration:', originalPrompt);
    if (!originalPrompt || originalPrompt.trim() === "") {
      console.log('Original prompt is empty or missing');
      setError("No original prompt found. Cannot regenerate without the original prompt.");
      setShowErrorToast(true);
      setRegenerating(false);
      return;
    }
    
    console.log('Regenerating with original prompt:', originalPrompt);
    console.log('Current page content:', pageContent);
    console.log('Current page style:', pageStyle);
    
    try {
      const response = await fetch('/api/generate-page', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: originalPrompt, // Always use the original prompt for regeneration
          existingConfig: {
            page_content: pageContent,
            page_style: pageStyle,
            template_id: templateId,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to regenerate page`);
      }

      const data = await response.json();
      
      if (data.success && data.config) {
        // The API returns a flat config object, we need to separate page_content and page_style
        const config = data.config;
        
        // Extract theme from the config (it's at the root level)
        const theme = config.theme || {
          mode: 'white' as const,
          accentColor: '#6366f1',
        };
        
        // Create page_style object with theme
        const newPageStyle: PageStyle = {
          theme: theme,
        };
        
        // Create page_content object by removing theme from the config
        const { theme: _, ...pageContentWithoutTheme } = config;
        const newPageContent = pageContentWithoutTheme || {};
        
        // Validate that the new content has meaningful data
        const hasValidContent = newPageContent.business?.name && 
                               newPageContent.hero?.headline && 
                               newPageContent.hero?.subheadline;
        
        if (!hasValidContent) {
          throw new Error("Regeneration returned incomplete content. Please try again.");
        }
        
        setPageContent(newPageContent as PageContent);
        setPageStyle(newPageStyle);
        setRegenerating(false);
        setHasUnsavedChanges(true); // Mark as unsaved since content changed
      } else {
        throw new Error(data.error || 'Regeneration failed - no valid content returned');
      }
    } catch (err: any) {
      console.error("Regeneration error:", err);
      
      // Restore original content on error
      setPageContent(originalContent);
      setPageStyle(originalStyle);
      
      // Set user-friendly error message
      const errorMessage = err.message || "Failed to regenerate page";
      setError(errorMessage);
      setShowErrorToast(true);
      setRegenerating(false);
      
      // Show error toast for longer duration
      setTimeout(() => {
        setShowErrorToast(false);
      }, 8000); // Show for 8 seconds
    }
  }, [originalPrompt, pageContent, pageStyle, templateId]);

  // Error handling
  const clearError = useCallback(() => {
    setError("");
    setShowErrorToast(false);
  }, []);

  // Auto-save when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && onSave) {
        // Try to save synchronously if possible
        try {
          const config = {
            page_content: pageContent,
            page_style: pageStyle,
            template_id: templateId,
            id: id,
            original_prompt: originalPrompt,
          };
          
          // Use sendBeacon for reliable saving on page unload
          const blob = new Blob([JSON.stringify(config)], { type: 'application/json' });
          navigator.sendBeacon('/api/landing-pages', blob);
          
          // Clear the unsaved changes flag
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Failed to auto-save on page unload:', error);
        }
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden' && hasUnsavedChanges && onSave) {
        // Save when page becomes hidden (user switches tabs or minimizes)
        try {
          const config = {
            page_content: pageContent,
            page_style: pageStyle,
            template_id: templateId,
            id: id,
            original_prompt: originalPrompt,
          };
          
          await onSave(config);
          setHasUnsavedChanges(false);
        } catch (error) {
          console.error('Failed to auto-save on visibility change:', error);
        }
      }
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasUnsavedChanges, pageContent, pageStyle, templateId, id, originalPrompt, onSave]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  // Return the state and handlers
  return {
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
      showSidePanel,
      regenerating,
      showErrorToast,
      hasUnsavedChanges,
      autoSaveTimer,
      showPublishModal,
      publishedUrl,
    },
    setPageContent: (content: Partial<PageContent> | ((prev: PageContent) => Partial<PageContent>)) => {
      if (typeof content === 'function') {
        setPageContent(prev => {
          const newContent = content(prev);
          return { ...prev, ...newContent };
        });
      } else {
        setPageContent(prev => ({ ...prev, ...content }));
      }
      markAsUnsaved();
    },
    setPageStyle: (style: Partial<PageStyle> | ((prev: PageStyle) => Partial<PageStyle>)) => {
      if (typeof style === 'function') {
        setPageStyle(prev => {
          const newStyle = style(prev);
          return { ...prev, ...newStyle };
        });
      } else {
        setPageStyle(prev => ({ ...prev, ...style }));
      }
      markAsUnsaved();
    },
    handleSave,
    handlePublish,
    handleRegenerate,
    setError,
    clearError,
  };
}
