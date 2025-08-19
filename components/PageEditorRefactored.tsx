"use client";
import React, { useState, useEffect, useRef } from "react";
import LandingPageTemplate from "./LandingPageTemplate";
import DraggableSection from "./DraggableSection";
import MobilePreviewQR from "./MobilePreviewQR";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// Import modular section components
import BusinessInfoSection from "./editor/BusinessInfoSection";
import HeroSection from "./editor/HeroSection";
import FeaturesSection from "./editor/FeaturesSection";
import ProblemSection from "./editor/ProblemSection";
import SocialProofSection from "./editor/SocialProofSection";
import GuaranteesSection from "./editor/GuaranteesSection";
import FAQSection from "./editor/FAQSection";
import CTASection from "./editor/CTASection";
import UrgencySection from "./editor/UrgencySection";
import ThemeSection from "./editor/ThemeSection";

interface PageEditorProps {
  initialConfig: any; // Should contain page_content, page_style, template_id, id (if editing)
  onSave?: (config: any) => void;
  saveStatus?: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved?: Date | null;
}

export default function PageEditorRefactored({ initialConfig, onSave, saveStatus = 'saved', lastSaved }: PageEditorProps) {
  // Split initial config into content, style, template, id
  const defaultContent = {
    business: { name: '', logo: '' },
    hero: { headline: '', headlineHighlights: [], subheadline: '', cta: '', heroTag: '', heroTagIcon: '' },
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
    ctaTitle: '',
    ctaSubtitle: '',
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

  console.log('Default content structure:', defaultContent);

  const {
    page_content: initialContent = defaultContent,
    page_style: initialStyle = {},
    template_id: initialTemplateId = 'default',
    id: initialId = undefined,
    original_prompt: initialOriginalPrompt = "",
  } = initialConfig || {};

  // Debug logging for original prompt
  console.log('Initial config received:', initialConfig);
  console.log('Extracted original_prompt:', initialOriginalPrompt);

  // Handle legacy themeColors structure
  const legacyTheme = initialStyle?.themeColors ? {
    mode: 'white',
    accentColor: initialStyle.themeColors.accentColor || initialStyle.themeColors.primaryColor || '#6366f1',
  } : {
    mode: 'white',
    accentColor: '#6366f1',
  };

  const processedInitialStyle = {
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

  const [pageContent, setPageContent] = useState<any>(mergedContent);
  const [pageStyle, setPageStyle] = useState<any>(processedInitialStyle);
  const [templateId, setTemplateId] = useState<string>(initialTemplateId);
  const [id, setId] = useState<string | undefined>(initialId);
  const [saving, setSaving] = useState(false);
  const [originalPrompt, setOriginalPrompt] = useState<string>(initialOriginalPrompt);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [sidePanelCollapsed, setSidePanelCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop'); // Default to desktop
  const [showSidePanel, setShowSidePanel] = useState(false); // For mobile
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
    console.log('Problem section:', initialContent?.problemSection);
    console.log('Social proof:', initialContent?.socialProof);
    console.log('Guarantees:', initialContent?.guarantees);
    console.log('FAQ:', initialContent?.faq);
    console.log('CTA title:', initialContent?.ctaTitle);
    console.log('CTA subtitle:', initialContent?.ctaSubtitle);
  }, [initialContent, pageContent, mergedContent, initialConfig, originalPrompt]);

  // Section expansion state - default: all sections expanded for better visibility
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    business: true,
    hero: true,
    features: true,
    cta: true,
    problemSection: true,
    socialProof: true,
    guarantees: true,
    faq: true,
    urgency: true,
    theme: true,
  });

  // Section visibility state - default: all sections visible
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    features: true,
    cta: true,
    problemSection: true,
    socialProof: true,
    guarantees: true,
    faq: true,
  });

  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState<Record<string, any>>({});
  const [fieldChangeQueue, setFieldChangeQueue] = useState<Record<string, any>>({});

  // Section order state for drag-and-drop
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'problemSection',
    'features',
    'socialProof', 
    'guarantees',
    'faq',
    'cta'
  ]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Toggle section expansion
  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Toggle section visibility
  const toggleSectionVisibility = (sectionName: string) => {
    setVisibleSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Handle drag end for section reordering
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Sync sectionOrder changes to pageContent
  useEffect(() => {
    setPageContent((prev: any) => ({
      ...prev,
      sectionOrder: sectionOrder,
    }));
  }, [sectionOrder]);

  // Event listeners for top bar buttons
  useEffect(() => {
    const handleSetPreviewMode = (event: CustomEvent) => {
      setPreviewMode(event.detail);
    };

    const handlePreviewPage = () => {
      handleSave().then(() => {
        if (id) {
          window.open(`/page/${initialConfig.slug}`, '_blank');
        }
      });
    };

    const handleRegeneratePage = () => {
      handleRegenerate();
    };

    const handlePublishPage = () => {
      handlePublish();
    };

    // Add event listeners
    window.addEventListener('set-preview-mode', handleSetPreviewMode as EventListener);
    window.addEventListener('preview-page', handlePreviewPage);
    window.addEventListener('regenerate-page', handleRegeneratePage);
    window.addEventListener('publish-page', handlePublishPage);

    // Cleanup
    return () => {
      window.removeEventListener('set-preview-mode', handleSetPreviewMode as EventListener);
      window.removeEventListener('preview-page', handlePreviewPage);
      window.removeEventListener('regenerate-page', handleRegeneratePage);
      window.removeEventListener('publish-page', handlePublishPage);
    };
  }, [id, initialConfig.slug]);

  // Listen for title updates from top bar
  useEffect(() => {
    const handleTitleUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.title && id) {
        // Update the initialConfig title to keep it in sync
        if (initialConfig) {
          initialConfig.title = event.detail.title;
        }
      }
    };

    window.addEventListener('page-title-updated', handleTitleUpdate as EventListener);
    return () => {
      window.removeEventListener('page-title-updated', handleTitleUpdate as EventListener);
    };
  }, [id, initialConfig]);

  // Sync title with top bar when component mounts
  useEffect(() => {
    if (id && initialConfig?.title) {
      // Dispatch event to sync title with top bar
      window.dispatchEvent(new CustomEvent('sync-page-title', { 
        detail: { title: initialConfig.title } 
      }));
    }
  }, [id, initialConfig?.title]);

  // Initialize field tracking for all existing content
  useEffect(() => {
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
        const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], pageContent);
        if (value !== undefined) {
          initializeFieldTracking(fieldPath, value);
        }
      });
    }
  }, [pageContent]);

  // Function to resize textarea to fit content
  const resizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  // Field-level auto-save functions
  const initializeFieldTracking = (fieldPath: string, value: any) => {
    if (originalValues[fieldPath] === undefined) {
      setOriginalValues(prev => ({
        ...prev,
        [fieldPath]: value
      }));
    }
  };

  const handleFieldChange = (fieldPath: string, value: any) => {
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

    // Queue the change for potential auto-save
    setFieldChangeQueue(prev => ({
      ...prev,
      [fieldPath]: value
    }));

    // Mark as having unsaved changes
    markAsUnsaved();
  };

  const handleFieldBlur = async (fieldPath: string, currentValue: any) => {
    const originalValue = originalValues[fieldPath];
    
    // Only save if the value actually changed
    if (originalValue !== currentValue) {
      try {
        // Save this specific field to database
        await saveFieldToDatabase(fieldPath, currentValue);
        
        // Update original values to reflect the new saved state
        setOriginalValues(prev => ({
          ...prev,
          [fieldPath]: currentValue
        }));
        
        // Remove from change queue
        setFieldChangeQueue(prev => {
          const newQueue = { ...prev };
          delete newQueue[fieldPath];
          return newQueue;
        });
        
        // Clear unsaved changes if no more pending changes
        if (Object.keys(fieldChangeQueue).length === 0) {
          setHasUnsavedChanges(false);
        }
        
        console.log(`Auto-saved field: ${fieldPath} = ${currentValue}`);
      } catch (error) {
        console.error(`Failed to auto-save field ${fieldPath}:`, error);
        // Revert to original value on error
        setPageContent((prev: any) => {
          const pathParts = fieldPath.split('.');
          let newContent = { ...prev };
          let current = newContent;
          
          for (let i = 0; i < pathParts.length - 1; i++) {
            if (!current[pathParts[i]]) {
              current[pathParts[i]] = {};
            }
            current = current[pathParts[i]];
          }
          
          current[pathParts[pathParts.length - 1]] = originalValue;
          return newContent;
        });
      }
    }
  };

  const saveFieldToDatabase = async (fieldPath: string, value: any) => {
    if (!id || !onSave) return;

    try {
      // Create a minimal config with just the changed field
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
  };

  // Enhanced auto-resize function that handles all textarea resizing
  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    resizeTextarea(target);
  };

  // Event handlers for different sections
  const handleBusinessChange = (field: string, value: string) => {
    const fieldPath = `business.${field}`;
    initializeFieldTracking(fieldPath, value);
    handleFieldChange(fieldPath, value);
  };

  const handleBusinessBlur = (field: string, value: string) => {
    const fieldPath = `business.${field}`;
    handleFieldBlur(fieldPath, value);
  };

  const handleHeroChange = (field: string, value: string) => {
    const fieldPath = `hero.${field}`;
    initializeFieldTracking(fieldPath, value);
    handleFieldChange(fieldPath, value);
  };

  const handleHeroBlur = (field: string, value: string) => {
    const fieldPath = `hero.${field}`;
    handleFieldBlur(fieldPath, value);
  };

  const handleHighlightToggle = (word: string) => {
    setPageContent((prev: any) => {
      const currentHighlights = prev?.hero?.headlineHighlights || [];
      const newHighlights = currentHighlights.includes(word)
        ? currentHighlights.filter((w: string) => w !== word)
        : [...currentHighlights, word];
      
      return {
        ...prev,
        hero: { ...(prev?.hero || {}), headlineHighlights: newHighlights }
      };
    });
    markAsUnsaved();
  };

  const handlePageContentChange = (field: string, value: string) => {
    setPageContent((prev: any) => ({
      ...prev,
      [field]: value
    }));
    markAsUnsaved();
  };

  const handleFeatureChange = (idx: number, field: string, value: string) => {
    setPageContent((prev: any) => ({
      ...prev,
      features: (prev?.features || []).map((feature: any, i: number) => 
        i === idx ? { ...feature, [field]: value } : feature
      )
    }));
  };

  const handleThemeChange = (field: string, value: string) => {
    setPageStyle((prev: any) => ({
      ...prev,
      theme: { ...(prev?.theme || { mode: 'white', accentColor: '#6366f1' }), [field]: value }
    }));
    markAsUnsaved();
  };

  const handleAddFeature = () => {
    setPageContent((prev: any) => ({
      ...prev,
      features: [...(prev?.features || []), {
        title: '',
        description: '',
        icon: 'star',
        benefit: ''
      }]
    }));
  };

  const handleRemoveFeature = (idx: number) => {
    setPageContent((prev: any) => ({
      ...prev,
      features: (prev?.features || []).filter((_: any, i: number) => i !== idx)
    }));
  };

  const handleProblemSectionChange = (field: string, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      problemSection: { ...prev.problemSection, [field]: value }
    }));
  };

  const handleSocialProofChange = (field: string, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      socialProof: { ...prev.socialProof, [field]: value }
    }));
  };

  const handleGuaranteesChange = (field: string, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      guarantees: { ...prev.guarantees, [field]: value }
    }));
  };

  const handleFAQChange = (field: string, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      faq: { ...prev.faq, [field]: value }
    }));
  };

  const handleUrgencyChange = (field: string, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      urgency: { ...prev.urgency, [field]: value }
    }));
  };

  // Array change handlers
  const handlePainPointsChange = (idx: number, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      problemSection: {
        ...(prev?.problemSection || {}),
        painPoints: (prev?.problemSection?.painPoints || []).map((point: any, i: number) => 
          i === idx ? value : point
        )
      }
    }));
  };

  const handleTestimonialsChange = (idx: number, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      socialProof: {
        ...(prev?.socialProof || {}),
        testimonials: (prev?.socialProof?.testimonials || []).map((testimonial: any, i: number) => 
          i === idx ? value : testimonial
        )
      }
    }));
  };

  const handleStatsChange = (idx: number, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      socialProof: {
        ...(prev?.socialProof || {}),
        stats: (prev?.socialProof?.stats || []).map((stat: any, i: number) => 
          i === idx ? value : stat
        )
      }
    }));
  };

  const handleGuaranteesArrayChange = (idx: number, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      guarantees: {
        ...(prev?.guarantees || {}),
        guarantees: (prev?.guarantees?.guarantees || []).map((guarantee: any, i: number) => 
          i === idx ? value : guarantee
        )
      }
    }));
  };

  const handleQuestionsChange = (idx: number, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      faq: {
        ...(prev?.faq || {}),
        questions: (prev?.faq?.questions || []).map((question: any, i: number) => 
          i === idx ? value : question
        )
      }
    }));
  };

  // Add handlers
  const handleAddPainPoint = () => {
    setPageContent((prev: any) => ({
      ...prev,
      problemSection: {
        ...(prev?.problemSection || {}),
        painPoints: [...(prev?.problemSection?.painPoints || []), { icon: 'clock', text: '' }]
      }
    }));
  };

  const handleAddTestimonial = () => {
    setPageContent((prev: any) => ({
      ...prev,
      socialProof: {
        ...(prev?.socialProof || {}),
        testimonials: [...(prev?.socialProof?.testimonials || []), {
          name: '', role: '', company: '', quote: '', rating: 5, result: ''
        }]
      }
    }));
  };

  const handleAddStat = () => {
    setPageContent((prev: any) => ({
      ...prev,
      socialProof: {
        ...(prev?.socialProof || {}),
        stats: [...(prev?.socialProof?.stats || []), { number: '', label: '', description: '' }]
      }
    }));
  };

  const handleAddGuarantee = () => {
    setPageContent((prev: any) => ({
      ...prev,
      guarantees: {
        ...(prev?.guarantees || {}),
        guarantees: [...(prev?.guarantees?.guarantees || []), { title: '', description: '', icon: 'shield' }]
      }
    }));
  };

  const handleAddQuestion = () => {
    setPageContent((prev: any) => ({
      ...prev,
      faq: {
        ...(prev?.faq || {}),
        questions: [...(prev?.faq?.questions || []), { question: '', answer: '' }]
      }
    }));
  };

  // Remove handlers
  const handleRemovePainPoint = (idx: number) => {
    setPageContent((prev: any) => ({
      ...prev,
      problemSection: {
        ...(prev?.problemSection || {}),
        painPoints: (prev?.problemSection?.painPoints || []).filter((_: any, i: number) => i !== idx)
      }
    }));
  };

  const handleRemoveTestimonial = (idx: number) => {
    setPageContent((prev: any) => ({
      ...prev,
      socialProof: {
        ...(prev?.socialProof || {}),
        testimonials: (prev?.socialProof?.testimonials || []).filter((_: any, i: number) => i !== idx)
      }
    }));
  };

  const handleRemoveStat = (idx: number) => {
    setPageContent((prev: any) => ({
      ...prev,
      socialProof: {
        ...(prev?.socialProof || {}),
        stats: (prev?.socialProof?.stats || []).filter((_: any, i: number) => i !== idx)
      }
    }));
  };

  const handleRemoveGuarantee = (idx: number) => {
    setPageContent((prev: any) => ({
      ...prev,
      guarantees: {
        ...(prev?.guarantees || {}),
        guarantees: (prev?.guarantees?.guarantees || []).filter((_: any, i: number) => i !== idx)
      }
    }));
  };

  const handleRemoveQuestion = (idx: number) => {
    setPageContent((prev: any) => ({
      ...prev,
      faq: {
        ...(prev?.faq || {}),
        questions: (prev?.faq?.questions || []).filter((_: any, i: number) => i !== idx)
      }
    }));
  };

  // Save and publish handlers
  const handleSave = async () => {
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
  };

  // Auto-save functionality
  const scheduleAutoSave = () => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    const timer = setTimeout(() => {
      if (hasUnsavedChanges && onSave) {
        handleSave();
      }
    }, 3000); // Auto-save after 3 seconds of inactivity
    
    setAutoSaveTimer(timer);
  };

  // Mark changes as unsaved
  const markAsUnsaved = () => {
    setHasUnsavedChanges(true);
    scheduleAutoSave();
  };

  const handlePublish = async () => {
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
  };

  const handleRegenerate = async () => {
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
          mode: 'white',
          accentColor: '#6366f1',
        };
        
        // Create page_style object with theme
        const newPageStyle = {
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
        
        setPageContent(newPageContent);
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
  };

  // Auto-resize textareas on mount and when content changes
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(resizeTextarea);
  }, [pageContent]);

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

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

  // State for edit panel views
  const [editPanelView, setEditPanelView] = useState<'main' | 'theme' | 'business' | 'layout' | 'section'>('main');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Function to handle section selection from preview
  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
    setEditPanelView('section');
    // Scroll to the selected section in the preview
    const sectionElement = document.getElementById(`section-${sectionId}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Function to go back to main edit panel
  const handleBackToMain = () => {
    setEditPanelView('main');
    setSelectedSection(null);
  };

  // Function to render the appropriate edit panel content
  const renderEditPanelContent = () => {
    switch (editPanelView) {
      case 'theme':
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleBackToMain}
                className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                title="Back to main panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-sm font-semibold text-slate-800">Theme Settings</h3>
            </div>
            <ThemeSection
              theme={pageStyle?.theme || { mode: 'white', accentColor: '#6366f1' }}
              onThemeChange={handleThemeChange}
              isExpanded={true}
              onToggle={() => {}}
            />
          </div>
        );

      case 'business':
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleBackToMain}
                className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                title="Back to main panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-sm font-semibold text-slate-800">Business Info</h3>
            </div>
            <BusinessInfoSection
              business={pageContent?.business || {}}
              onBusinessChange={handleBusinessChange}
              onBusinessBlur={handleBusinessBlur}
              isExpanded={true}
              onToggle={() => {}}
            />
          </div>
        );

      case 'layout':
        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleBackToMain}
                className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                title="Back to main panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-sm font-semibold text-slate-800">Page Layout</h3>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-slate-600 uppercase tracking-wider">Section Order & Visibility</h4>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sectionOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {sectionOrder.map((sectionId) => (
                    <DraggableSection key={sectionId} id={sectionId}>
                      <div className="flex items-center justify-between p-2 text-xs text-slate-700 bg-slate-50 rounded border">
                        <span className="flex-1">
                          {sectionId === 'problemSection' ? 'Problem Section' : 
                           sectionId === 'features' ? 'Features' :
                           sectionId === 'socialProof' ? 'Social Proof' :
                           sectionId === 'guarantees' ? 'Guarantees' :
                           sectionId === 'faq' ? 'FAQ' :
                           sectionId === 'cta' ? 'CTA' : sectionId}
                        </span>
                        <button
                          onClick={() => toggleSectionVisibility(sectionId)}
                          className={`ml-2 px-2 py-1 text-xs rounded transition-colors ${
                            visibleSections[sectionId] 
                              ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                          title={visibleSections[sectionId] ? 'Hide section' : 'Show section'}
                        >
                          {visibleSections[sectionId] ? 'Visible' : 'Hidden'}
                        </button>
                      </div>
                    </DraggableSection>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
        );

      case 'section':
        if (!selectedSection) return null;
        
        const renderSectionEditor = () => {
          switch (selectedSection) {
            case 'business':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Business Information</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={pageContent?.business?.name || ''}
                        onChange={(e) => handleBusinessChange("name", e.target.value)}
                        onBlur={(e) => handleBusinessBlur("name", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        value={pageContent?.business?.logo || ''}
                        onChange={(e) => handleBusinessChange("logo", e.target.value)}
                        onBlur={(e) => handleBusinessBlur("logo", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="Enter logo URL or leave empty for default"
                      />
                    </div>
                  </div>
                </div>
              );
            case 'hero':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Hero Section</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={pageContent?.hero?.headline || ''}
                        onChange={(e) => handleHeroChange("headline", e.target.value)}
                        onBlur={(e) => handleHeroBlur("headline", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="Enter your main headline"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Subheadline
                      </label>
                      <textarea
                        value={pageContent?.hero?.subheadline || ''}
                        onChange={(e) => handleHeroChange("subheadline", e.target.value)}
                        onBlur={(e) => handleHeroBlur("subheadline", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                        rows={3}
                        placeholder="Enter your subheadline"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={pageContent?.hero?.cta || ''}
                        onChange={(e) => handleHeroChange("cta", e.target.value)}
                        onBlur={(e) => handleHeroBlur("cta", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="Enter CTA button text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Hero Tag
                      </label>
                      <input
                        type="text"
                        value={pageContent?.hero?.heroTag || ''}
                        onChange={(e) => handleHeroChange("heroTag", e.target.value)}
                        onBlur={(e) => handleHeroBlur("heroTag", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="e.g., AI-Powered Solution"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Hero Tag Icon
                      </label>
                      <select
                        value={pageContent?.hero?.heroTagIcon || ''}
                        onChange={(e) => handleHeroChange("heroTagIcon", e.target.value)}
                        onBlur={(e) => handleHeroBlur("heroTagIcon", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                      >
                        <option value="">Select an icon</option>
                        <option value="rocket">🚀</option>
                        <option value="lightning">⚡</option>
                        <option value="lightbulb">💡</option>
                        <option value="target">🎯</option>
                        <option value="fire">🔥</option>
                        <option value="star">⭐</option>
                        <option value="diamond">💎</option>
                        <option value="helicopter">🚁</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            case 'problemSection':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Problem Section</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={pageContent?.problemSection?.title || ''}
                        onChange={(e) => handleProblemSectionChange("title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="e.g., The Problem, Pain Points"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Subtitle
                      </label>
                      <textarea
                        value={pageContent?.problemSection?.subtitle || ''}
                        onChange={(e) => handleProblemSectionChange("subtitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                        rows={3}
                        placeholder="Describe the problem your product solves"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Pain Points
                      </label>
                      <div className="space-y-2">
                        {(pageContent?.problemSection?.painPoints || []).map((painPoint: any, idx: number) => (
                          <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={painPoint?.text || ''}
                                onChange={(e) => handlePainPointsChange(idx, { ...painPoint, text: e.target.value })}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                                placeholder="Enter pain point"
                              />
                              <select
                                value={painPoint?.icon || ''}
                                onChange={(e) => handlePainPointsChange(idx, { ...painPoint, icon: e.target.value })}
                                className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              >
                                <option value="">Icon</option>
                                <option value="alert">🚨</option>
                                <option value="warning">⚠️</option>
                                <option value="cross">❌</option>
                                <option value="broken-heart">💔</option>
                                <option value="anxious">😰</option>
                                <option value="frustrated">😤</option>
                                <option value="tired">😫</option>
                                <option value="angry">😡</option>
                              </select>
                            </div>
                            <button
                              onClick={() => handleRemovePainPoint(idx)}
                              className="w-full px-3 py-2 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={handleAddPainPoint}
                          className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-600 hover:text-slate-800 hover:border-slate-400 text-sm"
                        >
                          + Add Pain Point
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            case 'features':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Features Section</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={pageContent?.features?.title || ''}
                        onChange={(e) => handlePageContentChange("featuresTitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="e.g., Features, Why Choose Us"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Subtitle
                      </label>
                      <textarea
                        value={pageContent?.features?.subtitle || ''}
                        onChange={(e) => handlePageContentChange("featuresSubtitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                        rows={3}
                        placeholder="Describe your features section"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Features
                      </label>
                      <div className="space-y-2">
                        {(pageContent?.features || []).map((feature: any, idx: number) => (
                          <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                            <input
                              type="text"
                              value={feature?.title || ''}
                              onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              placeholder="Feature title"
                            />
                            <textarea
                              value={feature?.description || ''}
                              onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                              rows={2}
                              placeholder="Feature description"
                            />
                            <div className="flex gap-2">
                              <select
                                value={feature?.icon || ''}
                                onChange={(e) => handleFeatureChange(idx, "icon", e.target.value)}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              >
                                <option value="">Select icon</option>
                                <option value="rocket">🚀</option>
                                <option value="lightning">⚡</option>
                                <option value="lightbulb">💡</option>
                                <option value="target">🎯</option>
                                <option value="fire">🔥</option>
                                <option value="star">⭐</option>
                                <option value="diamond">💎</option>
                                <option value="helicopter">🚁</option>
                                <option value="tools">🔧</option>
                                <option value="mobile">📱</option>
                                <option value="computer">💻</option>
                                <option value="web">🌐</option>
                              </select>
                              <button
                                onClick={() => handleRemoveFeature(idx)}
                                className="px-3 py-2 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50"
                                title="Remove feature"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleAddFeature}
                          className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-600 hover:text-slate-800 hover:border-slate-400 text-sm"
                        >
                          + Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            case 'socialProof':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Social Proof Section</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={pageContent?.socialProof?.title || ''}
                        onChange={(e) => handleSocialProofChange("title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="e.g., What Our Customers Say, Social Proof"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Subtitle
                      </label>
                      <textarea
                        value={pageContent?.socialProof?.subtitle || ''}
                        onChange={(e) => handleSocialProofChange("subtitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                        rows={3}
                        placeholder="Describe your social proof section"
                      />
                    </div>
                    
                    {/* Testimonials */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Testimonials
                      </label>
                      <div className="space-y-2">
                        {(pageContent?.socialProof?.testimonials || []).map((testimonial: any, idx: number) => (
                          <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                            <input
                              type="text"
                              value={testimonial?.name || ''}
                              onChange={(e) => handleTestimonialsChange(idx, { ...testimonial, name: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              placeholder="Customer name"
                            />
                            <input
                              type="text"
                              value={testimonial?.role || ''}
                              onChange={(e) => handleTestimonialsChange(idx, { ...testimonial, role: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              placeholder="Job title/role"
                            />
                            <input
                              type="text"
                              value={testimonial?.company || ''}
                              onChange={(e) => handleTestimonialsChange(idx, { ...testimonial, company: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              placeholder="Company name"
                            />
                            <textarea
                              value={testimonial?.quote || ''}
                              onChange={(e) => handleTestimonialsChange(idx, { ...testimonial, quote: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                              rows={2}
                              placeholder="Customer testimonial"
                            />
                            <button
                              onClick={() => handleRemoveTestimonial(idx)}
                              className="w-full px-3 py-2 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={handleAddTestimonial}
                          className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-600 hover:text-slate-800 hover:border-slate-400 text-sm"
                        >
                          + Add Testimonial
                        </button>
                      </div>
                    </div>

                    {/* Stats */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Statistics
                      </label>
                      <div className="space-y-2">
                        {(pageContent?.socialProof?.stats || []).map((stat: any, idx: number) => (
                          <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                            <input
                              type="text"
                              value={stat?.number || ''}
                              onChange={(e) => handleStatsChange(idx, { ...stat, number: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              placeholder="e.g., 10,000+"
                            />
                            <input
                              type="text"
                              value={stat?.label || ''}
                              onChange={(e) => handleStatsChange(idx, { ...stat, label: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              placeholder="e.g., Happy Customers"
                            />
                            <textarea
                              value={stat?.description || ''}
                              onChange={(e) => handleStatsChange(idx, { ...stat, description: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                              rows={2}
                              placeholder="Brief description"
                            />
                            <button
                              onClick={() => handleRemoveStat(idx)}
                              className="w-full px-3 py-2 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={handleAddStat}
                          className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-600 hover:text-slate-800 hover:border-slate-400 text-sm"
                        >
                          + Add Statistic
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            case 'guarantees':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Guarantees Section</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={pageContent?.guarantees?.title || ''}
                        onChange={(e) => handleGuaranteesChange("title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="e.g., Our Guarantee, Risk-Free Promise"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Subtitle
                      </label>
                      <textarea
                        value={pageContent?.guarantees?.subtitle || ''}
                        onChange={(e) => handleGuaranteesChange("subtitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                        rows={3}
                        placeholder="Describe your guarantees"
                      />
                    </div>
                    
                    {/* Guarantee Items */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Guarantees
                      </label>
                      <div className="space-y-2">
                        {(pageContent?.guarantees?.guarantees || []).map((guarantee: any, idx: number) => (
                          <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                            <input
                              type="text"
                              value={guarantee?.title || ''}
                              onChange={(e) => handleGuaranteesArrayChange(idx, { ...guarantee, title: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              placeholder="Guarantee title"
                            />
                            <textarea
                              value={guarantee?.description || ''}
                              onChange={(e) => handleGuaranteesArrayChange(idx, { ...guarantee, description: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                              rows={2}
                              placeholder="Guarantee description"
                            />
                            <div className="flex gap-2">
                              <select
                                value={guarantee?.icon || ''}
                                onChange={(e) => handleGuaranteesArrayChange(idx, { ...guarantee, icon: e.target.value })}
                                className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              >
                                <option value="">Select icon</option>
                                <option value="checkmark">✅</option>
                                <option value="shield">🛡️</option>
                                <option value="diamond">💎</option>
                                <option value="star">⭐</option>
                                <option value="lock">🔒</option>
                                <option value="target">🎯</option>
                                <option value="rocket">🚀</option>
                                <option value="strong">💪</option>
                              </select>
                              <button
                                onClick={() => handleRemoveGuarantee(idx)}
                                className="px-3 py-2 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50"
                                title="Remove guarantee"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={handleAddGuarantee}
                          className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-600 hover:text-slate-800 hover:border-slate-400 text-sm"
                        >
                          + Add Guarantee
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            case 'faq':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">FAQ Section</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={pageContent?.faq?.title || ''}
                        onChange={(e) => handleFAQChange("title", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="e.g., Frequently Asked Questions"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Section Subtitle
                      </label>
                      <textarea
                        value={pageContent?.faq?.subtitle || ''}
                        onChange={(e) => handleFAQChange("subtitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                        rows={3}
                        placeholder="Describe your FAQ section"
                      />
                    </div>
                    
                    {/* FAQ Questions */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Questions & Answers
                      </label>
                      <div className="space-y-2">
                        {(pageContent?.faq?.questions || []).map((question: any, idx: number) => (
                          <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                            <input
                              type="text"
                              value={question?.question || ''}
                              onChange={(e) => handleQuestionsChange(idx, { ...question, question: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                              placeholder="Enter question"
                            />
                            <textarea
                              value={question?.answer || ''}
                              onChange={(e) => handleQuestionsChange(idx, { ...question, answer: e.target.value })}
                              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                              rows={3}
                              placeholder="Enter answer"
                            />
                            <button
                              onClick={() => handleRemoveQuestion(idx)}
                              className="w-full px-3 py-2 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={handleAddQuestion}
                          className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-600 hover:text-slate-800 hover:border-slate-400 text-sm"
                        >
                          + Add Question & Answer
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            case 'cta':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">CTA Section</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        CTA Title
                      </label>
                      <input
                        type="text"
                        value={pageContent?.cta?.title || ''}
                        onChange={(e) => handlePageContentChange("ctaTitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="e.g., Get Started Today, Ready to Begin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        CTA Subtitle
                      </label>
                      <textarea
                        value={pageContent?.cta?.subtitle || ''}
                        onChange={(e) => handlePageContentChange("ctaSubtitle", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                        rows={3}
                        placeholder="Describe your call to action"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={pageContent?.cta?.buttonText || ''}
                        onChange={(e) => handlePageContentChange("ctaButtonText", e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                        placeholder="e.g., Get Started, Start Now"
                      />
                    </div>
                  </div>
                </div>
              );
            case 'urgency':
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-800 mb-3">Urgency Section</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="urgency-enabled"
                        checked={pageContent?.urgency?.enabled || false}
                        onChange={(e) => handleUrgencyChange("enabled", e.target.checked)}
                        className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
                      />
                      <label htmlFor="urgency-enabled" className="text-sm font-medium text-slate-700">
                        Enable urgency message
                      </label>
                    </div>
                    {pageContent?.urgency?.enabled && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Urgency Message
                          </label>
                          <input
                            type="text"
                            value={pageContent?.urgency?.message || ''}
                            onChange={(e) => handleUrgencyChange("message", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                            placeholder="e.g., Limited Time Offer, Only 24 Hours Left"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Deadline
                          </label>
                          <input
                            type="text"
                            value={pageContent?.urgency?.deadline || ''}
                            onChange={(e) => handleUrgencyChange("deadline", e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                            placeholder="e.g., Ends Tonight, Until Midnight"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            default:
              return <div className="text-xs text-slate-500">Section editor not found</div>;
          }
        };

        return (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleBackToMain}
                className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
                title="Back to main panel"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-sm font-semibold text-slate-800 capitalize">
                {selectedSection === 'problemSection' ? 'Problem Section' : 
                 selectedSection === 'socialProof' ? 'Social Proof' :
                 selectedSection === 'cta' ? 'CTA' : selectedSection} Editor
              </h3>
            </div>
            {renderSectionEditor()}
          </div>
        );

      default:
        return (
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Edit Page</h3>
            
            {/* Main Edit Panel Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setEditPanelView('theme')}
                className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border transition-colors"
              >
                Theme Settings
              </button>
              
              <button
                onClick={() => setEditPanelView('business')}
                className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border transition-colors"
              >
                Business Info
              </button>
              
              <button
                onClick={() => setEditPanelView('layout')}
                className="w-full flex items-center justify-center px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded border transition-colors"
              >
                Page Layout
              </button>
            </div>
            
            <div className="border-t border-slate-200 pt-4">
              <p className="text-xs text-slate-500 text-center">
                Click on any section in the preview to edit its content
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Edit Panel - Desktop Sidebar - Now on the left */}
      <div className={`hidden lg:flex ${
        sidePanelCollapsed ? 'w-0 overflow-hidden' : 'w-96'
      } bg-white border-r border-gray-200 flex-col transition-all duration-300`}>
        <div className="flex-1 overflow-y-auto">
          {renderEditPanelContent()}
        </div>
      </div>

      {/* Preview Panel - Now on the right */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidePanelCollapsed ? 'ml-0' : 'ml-0'
      }`}>
        
        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-2 sm:p-4 lg:pb-4 pb-20">
          <div className={`mx-auto transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-sm' : 'w-full max-w-none'
          }`}>
            {/* QR Code for Mobile Preview - At the top */}
            {previewMode === 'mobile' && id && initialConfig.slug && (
              <div className="mb-4">
                <MobilePreviewQR 
                  pageUrl={`${window.location.origin}/page/${initialConfig.slug}`}
                  pageId={id}
                />
              </div>
            )}
            
            {/* Save reminder for QR code - At the top */}
            {previewMode === 'mobile' && (!id || !initialConfig.slug) && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  💡 Save your page to generate a QR code for mobile preview
                </p>
              </div>
            )}
            
            <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${
              previewMode === 'mobile' ? 'border-4 sm:border-8 border-gray-800 rounded-2xl sm:rounded-3xl' : ''
            }`}>
              <LandingPageTemplate
                config={{
                  ...pageContent,
                  ...(pageStyle || {}),
                }}
                pageId={id}
                previewMode={previewMode}
                visibleSections={visibleSections}
                onSectionSelect={handleSectionSelect}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Panel - Mobile Overlay */}
      {showSidePanel && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Edit Page</h2>
              <button
                onClick={() => setShowSidePanel(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              {/* Theme Settings - Moved to top */}
              <ThemeSection
                theme={pageStyle?.theme || { mode: 'white', accentColor: '#6366f1' }}
                onThemeChange={handleThemeChange}
                isExpanded={expandedSections.theme}
                onToggle={() => toggleSection('theme')}
              />

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sectionOrder}
                  strategy={verticalListSortingStrategy}
                >
                  {/* Business Info Section */}
                  <BusinessInfoSection
                    business={pageContent?.business || {}}
                    onBusinessChange={handleBusinessChange}
                    onBusinessBlur={handleBusinessBlur}
                    isExpanded={expandedSections.business}
                    onToggle={() => toggleSection('business')}
                  />

                  {/* Hero Section */}
                  <HeroSection
                    hero={pageContent?.hero || {}}
                    onHeroChange={handleHeroChange}
                    onHeroBlur={handleHeroBlur}
                    onHighlightToggle={handleHighlightToggle}
                    isExpanded={expandedSections.hero}
                    onToggle={() => toggleSection('hero')}
                  />

                  {/* Draggable Sections */}
                  {sectionOrder.map((sectionId) => {
                    switch (sectionId) {
                      case 'problemSection':
                        return (
                          <DraggableSection key={sectionId} id={sectionId}>
                            <ProblemSection
                              problemSection={pageContent?.problemSection || {}}
                              onProblemSectionChange={handleProblemSectionChange}
                              onPainPointsChange={handlePainPointsChange}
                              onAddPainPoint={handleAddPainPoint}
                              onRemovePainPoint={handleRemovePainPoint}
                              isExpanded={expandedSections.problemSection}
                              onToggle={() => toggleSection('problemSection')}
                              isVisible={visibleSections.problemSection}
                              onToggleVisibility={() => toggleSectionVisibility('problemSection')}
                            />
                          </DraggableSection>
                        );
                      
                      case 'features':
                        return (
                          <DraggableSection key={sectionId} id={sectionId}>
                            <div className="space-y-4">
                              <h4 className="text-sm font-medium text-slate-800 mb-3">Features Section</h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Section Title
                                  </label>
                                  <input
                                    type="text"
                                    value={pageContent?.features?.title || ''}
                                    onChange={(e) => handlePageContentChange("featuresTitle", e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                                    placeholder="e.g., Features, Why Choose Us"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Section Subtitle
                                  </label>
                                  <textarea
                                    value={pageContent?.features?.subtitle || ''}
                                    onChange={(e) => handlePageContentChange("featuresSubtitle", e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                                    rows={3}
                                    placeholder="Describe your features section"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Features
                                  </label>
                                  <div className="space-y-2">
                                    {(pageContent?.features || []).map((feature: any, idx: number) => (
                                      <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                                        <input
                                          type="text"
                                          value={feature?.title || ''}
                                          onChange={(e) => handleFeatureChange(idx, "title", e.target.value)}
                                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                                          placeholder="Feature title"
                                        />
                                        <textarea
                                          value={feature?.description || ''}
                                          onChange={(e) => handleFeatureChange(idx, "description", e.target.value)}
                                          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
                                          rows={2}
                                          placeholder="Feature description"
                                        />
                                        <div className="flex gap-2">
                                          <select
                                            value={feature?.icon || ''}
                                            onChange={(e) => handleFeatureChange(idx, "icon", e.target.value)}
                                            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                                          >
                                            <option value="">Select icon</option>
                                            <option value="rocket">🚀</option>
                                            <option value="lightning">⚡</option>
                                            <option value="lightbulb">💡</option>
                                            <option value="target">🎯</option>
                                            <option value="fire">🔥</option>
                                            <option value="star">⭐</option>
                                            <option value="diamond">💎</option>
                                            <option value="helicopter">🚁</option>
                                            <option value="tools">🔧</option>
                                            <option value="mobile">📱</option>
                                            <option value="computer">💻</option>
                                            <option value="web">🌐</option>
                                          </select>
                                          <button
                                            onClick={() => handleRemoveFeature(idx)}
                                            className="px-3 py-2 text-red-600 hover:text-red-800 text-sm border border-red-200 rounded-md hover:bg-red-50"
                                            title="Remove feature"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                    <button
                                      onClick={handleAddFeature}
                                      className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-600 hover:text-slate-800 hover:border-slate-400 text-sm"
                                    >
                                      + Add Feature
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DraggableSection>
                        );
                      
                      case 'socialProof':
                        return (
                          <DraggableSection key={sectionId} id={sectionId}>
                            <SocialProofSection
                              socialProof={pageContent?.socialProof || {}}
                              onSocialProofChange={handleSocialProofChange}
                              onTestimonialsChange={handleTestimonialsChange}
                              onStatsChange={handleStatsChange}
                              onAddTestimonial={handleAddTestimonial}
                              onAddStat={handleAddStat}
                              onRemoveTestimonial={handleRemoveTestimonial}
                              onRemoveStat={handleRemoveStat}
                              isExpanded={expandedSections.socialProof}
                              onToggle={() => toggleSection('socialProof')}
                              isVisible={visibleSections.socialProof}
                              onToggleVisibility={() => toggleSectionVisibility('socialProof')}
                            />
                          </DraggableSection>
                        );
                      
                      case 'guarantees':
                        return (
                          <DraggableSection key={sectionId} id={sectionId}>
                            <GuaranteesSection
                              guarantees={pageContent?.guarantees || {}}
                              onGuaranteesChange={handleGuaranteesChange}
                              onGuaranteesArrayChange={handleGuaranteesArrayChange}
                              onAddGuarantee={handleAddGuarantee}
                              onRemoveGuarantee={handleRemoveGuarantee}
                              isExpanded={expandedSections.guarantees}
                              onToggle={() => toggleSection('guarantees')}
                              isVisible={visibleSections.guarantees}
                              onToggleVisibility={() => toggleSectionVisibility('guarantees')}
                            />
                          </DraggableSection>
                        );
                      
                      case 'faq':
                        return (
                          <DraggableSection key={sectionId} id={sectionId}>
                            <FAQSection
                              faq={pageContent?.faq || {}}
                              onFAQChange={handleFAQChange}
                              onQuestionsChange={handleQuestionsChange}
                              onAddQuestion={handleAddQuestion}
                              onRemoveQuestion={handleRemoveQuestion}
                              isExpanded={expandedSections.faq}
                              onToggle={() => toggleSection('faq')}
                              isVisible={visibleSections.faq}
                              onToggleVisibility={() => toggleSectionVisibility('faq')}
                            />
                          </DraggableSection>
                        );
                      
                      case 'cta':
                        return (
                          <DraggableSection key={sectionId} id={sectionId}>
                            <CTASection
                              ctaTitle={pageContent?.cta?.title || ''}
                              ctaSubtitle={pageContent?.cta?.subtitle || ''}
                              onPageContentChange={handlePageContentChange}
                              isExpanded={expandedSections.cta}
                              onToggle={() => toggleSection('cta')}
                              isVisible={visibleSections.cta}
                              onToggleVisibility={() => toggleSectionVisibility('cta')}
                            />
                          </DraggableSection>
                        );
                      
                      default:
                        return null;
                    }
                  })}
                </SortableContext>
              </DndContext>

              {/* Non-draggable sections */}
              <UrgencySection
                urgency={pageContent?.urgency || {}}
                onUrgencyChange={handleUrgencyChange}
                isExpanded={expandedSections.urgency}
                onToggle={() => toggleSection('urgency')}
              />
            </div>
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
              onClick={() => setShowErrorToast(false)}
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