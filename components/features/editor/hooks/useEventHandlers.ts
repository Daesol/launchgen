import { useEffect, useCallback } from 'react';
import { UseEventHandlersReturn } from '../types/editor.types';

export function useEventHandlers(
  handlers: {
    onSetPreviewMode: (mode: 'desktop' | 'mobile') => void;
    onPreviewPage: () => void;
    onRegeneratePage: () => void;
    onPublishPage: () => void;
    onTitleUpdate: (title: string) => void;
  }
): UseEventHandlersReturn {
  // Event handlers that match the expected interface
  const handleSetPreviewMode = useCallback((mode: 'desktop' | 'mobile') => {
    handlers.onSetPreviewMode(mode);
  }, [handlers]);

  const handlePreviewPage = useCallback(() => {
    handlers.onPreviewPage();
  }, [handlers]);

  const handleRegeneratePage = useCallback(() => {
    handlers.onRegeneratePage();
  }, [handlers]);

  const handlePublishPage = useCallback(() => {
    handlers.onPublishPage();
  }, [handlers]);

  const handleTitleUpdate = useCallback((title: string) => {
    handlers.onTitleUpdate(title);
  }, [handlers]);

  // Internal event handlers for DOM events
  const handleSetPreviewModeEvent = useCallback((event: CustomEvent) => {
    handlers.onSetPreviewMode(event.detail);
  }, [handlers]);

  const handleTitleUpdateEvent = useCallback((event: CustomEvent) => {
    if (event.detail && event.detail.title) {
      handlers.onTitleUpdate(event.detail.title);
    }
  }, [handlers]);

  // Set up event listeners
  useEffect(() => {
    // Add event listeners
    window.addEventListener('set-preview-mode', handleSetPreviewModeEvent as EventListener);
    window.addEventListener('preview-page', handlePreviewPage);
    window.addEventListener('regenerate-page', handleRegeneratePage);
    window.addEventListener('publish-page', handlePublishPage);
    window.addEventListener('page-title-updated', handleTitleUpdateEvent as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('set-preview-mode', handleSetPreviewModeEvent as EventListener);
      window.removeEventListener('preview-page', handlePreviewPage);
      window.removeEventListener('regenerate-page', handleRegeneratePage);
      window.removeEventListener('publish-page', handlePublishPage);
      window.removeEventListener('page-title-updated', handleTitleUpdateEvent as EventListener);
    };
  }, [handleSetPreviewModeEvent, handlePreviewPage, handleRegeneratePage, handlePublishPage, handleTitleUpdateEvent]);

  return {
    handleSetPreviewMode,
    handlePreviewPage,
    handleRegeneratePage,
    handlePublishPage,
    handleTitleUpdate,
  };
}
