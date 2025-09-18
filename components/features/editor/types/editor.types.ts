// Editor Types for PageEditorRefactored refactoring

export interface PageEditorProps {
  initialConfig: any; // Should contain page_content, page_style, template_id, id (if editing)
  onSave?: (config: any) => void;
  saveStatus?: 'saved' | 'saving' | 'error' | 'unsaved';
  lastSaved?: Date | null;
}

export interface PageContent {
  business: {
    name: string;
    logo: string;
  };
  hero: {
    headline: string;
    headlineHighlights: string[];
    subheadline: string;
    cta: string;
    heroTag: string;
    heroTagIcon: string;
  };
  problemSection: {
    title: string;
    subtitle: string;
    painPoints: Array<{
      text: string;
      icon: string;
    }>;
  };
  socialProof: {
    title: string;
    subtitle: string;
    testimonials: Array<{
      name: string;
      role: string;
      company: string;
      quote: string;
      rating?: number;
      result?: string;
    }>;
    stats: Array<{
      number: string;
      label: string;
      description: string;
    }>;
  };
  features: Array<{
    title: string;
    description: string;
    icon: string;
    benefit?: string;
  }>;
  featuresTitle: string;
  featuresSubtitle: string;
  guarantees: {
    title: string;
    subtitle: string;
    guarantees: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  faq: {
    title: string;
    subtitle: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  urgency: {
    enabled: boolean;
    message: string;
    deadline: string;
  };
  sectionOrder: string[];
  visibleSections?: Record<string, boolean>;
}

export interface PageStyle {
  theme: {
    mode: 'white' | 'black';
    accentColor: string;
  };
}

export interface PageEditorState {
  pageContent: PageContent;
  pageStyle: PageStyle;
  templateId: string;
  id?: string;
  saving: boolean;
  originalPrompt: string;
  published: boolean;
  error: string;
  sidePanelCollapsed: boolean;
  previewMode: 'desktop' | 'mobile';
  showSidePanel: boolean;
  regenerating: boolean;
  showErrorToast: boolean;
  hasUnsavedChanges: boolean;
  autoSaveTimer: NodeJS.Timeout | null;
  showPublishModal: boolean;
  publishedUrl: string;
}

export interface SectionState {
  expandedSections: Record<string, boolean>;
  visibleSections: Record<string, boolean>;
  sectionOrder: string[];
}

export interface EditPanelState {
  editPanelView: 'main' | 'theme' | 'business' | 'layout' | 'section';
  selectedSection: string | null;
}

export interface FieldChange {
  fieldPath: string;
  value: any;
  originalValue: any;
}

export interface IconOption {
  value: string;
  label?: string;
}

// Event handler types
export type FieldChangeHandler = (fieldPath: string, value: any) => void;
export type FieldBlurHandler = (fieldPath: string, value: any) => void;
export type SectionToggleHandler = (sectionName: string) => void;
export type SectionVisibilityHandler = (sectionName: string) => void;
export type SectionSelectHandler = (sectionId: string) => void;

// Hook return types
export interface UsePageEditorReturn {
  state: PageEditorState;
  setPageContent: (content: Partial<PageContent> | ((prev: PageContent) => Partial<PageContent>)) => void;
  setPageStyle: (style: Partial<PageStyle> | ((prev: PageStyle) => Partial<PageStyle>)) => void;
  handleSave: () => Promise<void>;
  handlePublish: () => Promise<void>;
  handleRegenerate: () => Promise<void>;
  setError: (error: string) => void;
  clearError: () => void;
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
}

export interface UseFieldAutoSaveReturn {
  handleFieldChange: FieldChangeHandler;
  handleFieldBlur: FieldBlurHandler;
  initializeFieldTracking: (fieldPath: string, value: any) => void;
  hasUnsavedChanges: boolean;
  markAsUnsaved: () => void;
}

export interface UseSectionManagementReturn {
  sectionState: SectionState;
  editPanelState: EditPanelState;
  toggleSection: SectionToggleHandler;
  toggleSectionVisibility: SectionVisibilityHandler;
  handleSectionSelect: SectionSelectHandler;
  handleBackToMain: () => void;
  setEditPanelView: (view: EditPanelState['editPanelView']) => void;
  setSelectedSection: (section: string | null) => void;
  updateSectionOrder: (newOrder: string[]) => void;
}

export interface UseEventHandlersReturn {
  handleSetPreviewMode: (mode: 'desktop' | 'mobile') => void;
  handlePreviewPage: () => void;
  handleRegeneratePage: () => void;
  handlePublishPage: () => void;
  handleTitleUpdate: (title: string) => void;
}
