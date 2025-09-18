import { useState, useCallback } from 'react';
import { 
  UseSectionManagementReturn, 
  SectionState, 
  EditPanelState,
  SectionToggleHandler,
  SectionVisibilityHandler,
  SectionSelectHandler 
} from '../types/editor.types';

export function useSectionManagement(initialVisibleSections?: Record<string, boolean>, initialSectionOrder?: string[]): UseSectionManagementReturn {
  // Section expansion state - default: all sections expanded for better visibility
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    business: true,
    hero: true,
    features: true,
    cta: true,
    problemSection: true,
    socialProof: true,
    pricing: true,
    guarantees: true,
    faq: true,
    urgency: true,
    theme: true,
  });

  // Section visibility state - use initial values if provided, otherwise default to all visible
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>(
    initialVisibleSections || {
      features: true,
      cta: true,
      problemSection: true,
      socialProof: true,
      pricing: true,
      guarantees: true,
      faq: true,
    }
  );

  // Section order state for drag-and-drop - use initial values if provided
  const [sectionOrder, setSectionOrder] = useState<string[]>(
    initialSectionOrder || [
      'problemSection',
      'features',
      'socialProof',
      'pricing',
      'guarantees',
      'faq',
      'cta'
    ]
  );

  // Edit panel view state
  const [editPanelView, setEditPanelView] = useState<EditPanelState['editPanelView']>('main');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  // Toggle section expansion
  const toggleSection = useCallback<SectionToggleHandler>((sectionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  }, []);

  // Toggle section visibility
  const toggleSectionVisibility = useCallback<SectionVisibilityHandler>((sectionName: string) => {
    console.log('toggleSectionVisibility called for:', sectionName);
    setVisibleSections(prev => {
      const newState = {
        ...prev,
        [sectionName]: !prev[sectionName]
      };
      console.log('Section visibility state updated:', { sectionName, newState });
      return newState;
    });
  }, []);

  // Handle section selection from preview
  const handleSectionSelect = useCallback<SectionSelectHandler>((sectionId: string) => {
    setSelectedSection(sectionId);
    setEditPanelView('section');
    
    // Scroll to the selected section in the preview
    const sectionElement = document.getElementById(`section-${sectionId}`);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  // Function to go back to main edit panel
  const handleBackToMain = useCallback(() => {
    setEditPanelView('main');
    setSelectedSection(null);
  }, []);

  // Update section order (for drag and drop)
  const updateSectionOrder = useCallback((newOrder: string[]) => {
    // Filter out 'hero' from the new order since it's always fixed at the top
    const filteredOrder = newOrder.filter(section => section !== 'hero');
    setSectionOrder(filteredOrder);
  }, []);

  // Get section state
  const getSectionState = useCallback((): SectionState => ({
    expandedSections,
    visibleSections,
    sectionOrder,
  }), [expandedSections, visibleSections, sectionOrder]);

  // Get edit panel state
  const getEditPanelState = useCallback((): EditPanelState => ({
    editPanelView,
    selectedSection,
  }), [editPanelView, selectedSection]);

  return {
    sectionState: getSectionState(),
    editPanelState: getEditPanelState(),
    toggleSection,
    toggleSectionVisibility,
    handleSectionSelect,
    handleBackToMain,
    setEditPanelView,
    setSelectedSection,
    updateSectionOrder,
  };
}
