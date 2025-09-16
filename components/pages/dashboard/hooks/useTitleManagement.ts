"use client";
import { useState, useEffect } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export function useTitleManagement(currentPageId: string | null) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const supabase = createPagesBrowserClient();

  const startEditingTitle = () => {
    setEditingTitle(true);
  };

  const stopEditingTitle = () => {
    setEditingTitle(false);
  };

  const updatePageTitle = (title: string) => {
    setPageTitle(title);
  };

  const handleTitleSave = async () => {
    if (!currentPageId || !pageTitle.trim()) return;
    
    try {
      const { error } = await supabase
        .from('landing_pages')
        .update({ title: pageTitle.trim() })
        .eq('id', currentPageId);

      if (error) throw error;

      stopEditingTitle();
    } catch (error) {
      console.error('Error updating page title:', error);
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    }
  };

  // Listen for title update events
  useEffect(() => {
    const handleTitleUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.title) {
        updatePageTitle(event.detail.title);
      }
    };

    const handleTitleSync = (event: CustomEvent) => {
      if (event.detail && event.detail.title) {
        updatePageTitle(event.detail.title);
      }
    };

    window.addEventListener('update-page-title', handleTitleUpdate as EventListener);
    window.addEventListener('sync-page-title', handleTitleSync as EventListener);
    
    return () => {
      window.removeEventListener('update-page-title', handleTitleUpdate as EventListener);
      window.removeEventListener('sync-page-title', handleTitleSync as EventListener);
    };
  }, []);

  // Handle click outside to save title
  useEffect(() => {
    if (!editingTitle) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.title-input-container')) {
        handleTitleSave();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingTitle, handleTitleSave]);

  return {
    editingTitle,
    pageTitle,
    startEditingTitle,
    stopEditingTitle,
    updatePageTitle,
    handleTitleSave,
    handleTitleKeyDown
  };
}
