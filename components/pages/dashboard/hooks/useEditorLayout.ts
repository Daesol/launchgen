"use client";
import { useState } from "react";

export function useEditorLayout() {
  const [selectedSection, setSelectedSection] = useState<string>('hero');
  const [editPanelView, setEditPanelView] = useState<'main' | 'section' | 'business' | 'theme' | 'layout'>('main');
  const [showSidePanel, setShowSidePanel] = useState(false);

  const handleSectionSelect = (sectionId: string) => {
    setSelectedSection(sectionId);
    
    // Set the appropriate panel view based on the section type
    if (sectionId === 'theme' || sectionId === 'business' || sectionId === 'layout') {
      setEditPanelView(sectionId as 'theme' | 'business' | 'layout');
    } else {
      setEditPanelView('section');
    }
  };

  const handleBackToMain = () => {
    setEditPanelView('main');
    setSelectedSection('hero');
  };

  const toggleSidePanel = () => {
    setShowSidePanel(prev => !prev);
  };

  const closeSidePanel = () => {
    setShowSidePanel(false);
  };

  return {
    selectedSection,
    editPanelView,
    showSidePanel,
    handleSectionSelect,
    handleBackToMain,
    toggleSidePanel,
    closeSidePanel
  };
}
