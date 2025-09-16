"use client";
import { useState, useEffect } from "react";

export function usePreviewMode(initialMode: 'desktop' | 'mobile' = 'desktop') {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>(initialMode);

  // Listen for preview mode change events
  useEffect(() => {
    const handlePreviewModeChange = (event: CustomEvent) => {
      setPreviewMode(event.detail);
    };

    window.addEventListener('set-preview-mode', handlePreviewModeChange as EventListener);
    return () => {
      window.removeEventListener('set-preview-mode', handlePreviewModeChange as EventListener);
    };
  }, []);

  const togglePreviewMode = () => {
    setPreviewMode(prev => prev === 'desktop' ? 'mobile' : 'desktop');
  };

  return {
    previewMode,
    setPreviewMode,
    togglePreviewMode
  };
}
