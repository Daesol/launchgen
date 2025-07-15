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
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('mobile'); // Default to mobile
  const [showSidePanel, setShowSidePanel] = useState(false); // For mobile
  const [regenerating, setRegenerating] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  
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

  // Function to resize textarea to fit content
  const resizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  // Enhanced auto-resize function that handles all textarea resizing
  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    resizeTextarea(target);
  };

  // Event handlers for different sections
  const handleBusinessChange = (field: string, value: string) => {
    setPageContent((prev: any) => ({
      ...prev,
      business: { ...(prev?.business || {}), [field]: value }
    }));
    markAsUnsaved();
  };

  const handleHeroChange = (field: string, value: string) => {
    setPageContent((prev: any) => ({
      ...prev,
      hero: { ...(prev?.hero || {}), [field]: value }
    }));
    markAsUnsaved();
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
  };

  const handlePageContentChange = (field: string, value: string) => {
    setPageContent((prev: any) => ({
      ...prev,
      [field]: value
    }));
    markAsUnsaved();
  };

  const handleFeatureChange = (idx: number, value: any) => {
    setPageContent((prev: any) => ({
      ...prev,
      features: (prev?.features || []).map((feature: any, i: number) => 
        i === idx ? value : feature
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

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Preview Panel */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidePanelCollapsed ? 'ml-0' : 'ml-0'
      }`}>
        {/* Preview Header */}
        <div className="bg-white border-b border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800">Landing Page Editor</h1>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`px-3 py-1 text-sm rounded hidden sm:block ${
                    previewMode === 'desktop'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Desktop
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`px-3 py-1 text-sm rounded ${
                    previewMode === 'mobile'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Mobile
                </button>
              </div>
              {/* Save Status Indicator */}
              <div className="flex items-center space-x-2">
                {saving ? (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Saving...</span>
                  </div>
                ) : hasUnsavedChanges ? (
                  <div className="flex items-center space-x-1 text-orange-600">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm">Unsaved changes</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-green-600">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm">
                      {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : 'Saved'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => setShowSidePanel(!showSidePanel)}
                className="lg:hidden px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                {showSidePanel ? 'Hide Editor' : 'Show Editor'}
              </button>
              
              <button
                onClick={() => {
                  // Save current state first, then open preview
                  handleSave().then(() => {
                    if (id) {
                      window.open(`/page/${initialConfig.slug}`, '_blank');
                    }
                  });
                }}
                disabled={saving}
                className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                Preview
              </button>
              
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="px-3 sm:px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-sm"
              >
                {regenerating ? 'Regenerating...' : 'Regenerate'}
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-3 sm:px-4 py-2 text-white rounded disabled:opacity-50 text-sm ${
                  hasUnsavedChanges 
                    ? 'bg-orange-500 hover:bg-orange-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {saving ? 'Saving...' : hasUnsavedChanges ? 'Save*' : 'Save'}
              </button>
              
              <button
                onClick={handlePublish}
                disabled={saving || published}
                className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {published ? 'Published' : 'Publish'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-2 sm:p-4">
          <div className={`mx-auto transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
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
              />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Panel - Desktop Sidebar */}
      <div className={`hidden lg:flex ${
        sidePanelCollapsed ? 'w-0 overflow-hidden' : 'w-96'
      } bg-white border-l border-gray-200 flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Edit Page</h2>
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
                isExpanded={expandedSections.business}
                onToggle={() => toggleSection('business')}
              />

              {/* Hero Section */}
              <HeroSection
                hero={pageContent?.hero || {}}
                onHeroChange={handleHeroChange}
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
                        <FeaturesSection
                          features={pageContent?.features || []}
                          featuresTitle={pageContent?.featuresTitle || ''}
                          featuresSubtitle={pageContent?.featuresSubtitle || ''}
                          onFeatureChange={handleFeatureChange}
                          onAddFeature={handleAddFeature}
                          onRemoveFeature={handleRemoveFeature}
                          onPageContentChange={handlePageContentChange}
                          isExpanded={expandedSections.features}
                          onToggle={() => toggleSection('features')}
                          isVisible={visibleSections.features}
                          onToggleVisibility={() => toggleSectionVisibility('features')}
                        />
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
                          ctaTitle={pageContent?.ctaTitle || ''}
                          ctaSubtitle={pageContent?.ctaSubtitle || ''}
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
                    isExpanded={expandedSections.business}
                    onToggle={() => toggleSection('business')}
                  />

                  {/* Hero Section */}
                  <HeroSection
                    hero={pageContent?.hero || {}}
                    onHeroChange={handleHeroChange}
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
                            <FeaturesSection
                              features={pageContent?.features || []}
                              featuresTitle={pageContent?.featuresTitle || ''}
                              featuresSubtitle={pageContent?.featuresSubtitle || ''}
                              onFeatureChange={handleFeatureChange}
                              onAddFeature={handleAddFeature}
                              onRemoveFeature={handleRemoveFeature}
                              onPageContentChange={handlePageContentChange}
                              isExpanded={expandedSections.features}
                              onToggle={() => toggleSection('features')}
                              isVisible={visibleSections.features}
                              onToggleVisibility={() => toggleSectionVisibility('features')}
                            />
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
                              ctaTitle={pageContent?.ctaTitle || ''}
                              ctaSubtitle={pageContent?.ctaSubtitle || ''}
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