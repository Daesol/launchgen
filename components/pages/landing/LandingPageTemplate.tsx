"use client";
import React, { useEffect } from "react";
import { getThemeClasses, createLegacyTheme } from "@/utils/theme";
import { LandingPageTemplateProps } from "@/types/landing-page.types";
import SectionRenderer from "./SectionRenderer";
import Header from "./components/Header";

export default function LandingPageTemplate({ 
  config, 
  pageId, 
  previewMode = 'desktop', 
  visibleSections, 
  onSectionSelect 
}: LandingPageTemplateProps) {
  // Debug logging - only theme for theme migration issue
  console.log('LandingPageTemplate - Theme received:', config?.theme);
  
  if (!config || !config.hero || !config.features) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg font-semibold">
        Invalid or incomplete config. Please try again.
      </div>
    );
  }
  
  // Handle legacy themeColors structure  
  const legacyTheme = createLegacyTheme(config.themeColors);
  const theme = config.theme || legacyTheme;
  const themeClasses = getThemeClasses(theme);

  // Debug theme changes
  useEffect(() => {
    console.log('Theme changed:', theme);
    console.log('Theme classes computed:', themeClasses);
    console.log('Theme mode check:', theme.mode, theme.mode === 'black');
  }, [theme, themeClasses]);

  useEffect(() => {
    if (pageId) {
      // Generate a session_id for this visit (persist for 1 day)
      let session_id = localStorage.getItem(`lg_session_${pageId}`);
      if (!session_id) {
        session_id = crypto.randomUUID();
        localStorage.setItem(`lg_session_${pageId}`, session_id);
      }
      
      // Check if we've already recorded a page view for this session
      const pageViewRecorded = localStorage.getItem(`lg_pageview_${pageId}_${session_id}`);
      if (!pageViewRecorded) {
        fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landing_page_id: pageId,
            event_type: "page_view",
            referrer: document.referrer,
            utm_source: new URLSearchParams(window.location.search).get("utm_source"),
            session_id,
          }),
        });
        
        // Mark that we've recorded a page view for this session
        localStorage.setItem(`lg_pageview_${pageId}_${session_id}`, 'true');
      }
    }
  }, [pageId]);

  // Force mobile layout when in mobile preview mode
  const isMobilePreview = previewMode === 'mobile';

  return (
    <div className={`flex flex-col min-h-screen ${themeClasses.background}`} style={{
      // Force styles as backup if Tailwind classes don't work
      backgroundColor: theme.mode === 'black' ? '#000000' : '#ffffff',
      color: theme.mode === 'black' ? '#f8fafc' : '#0f172a'
    }}>
      {/* Header */}
      <Header
        config={config}
        theme={theme}
        themeClasses={themeClasses}
        previewMode={previewMode}
        onSectionSelect={onSectionSelect}
      />

      <main className="flex-1">
        <SectionRenderer
          key={`theme-${theme.mode}-${theme.accentColor}`}
          config={config}
          theme={theme}
          pageId={pageId}
          previewMode={previewMode}
          visibleSections={visibleSections}
          onSectionSelect={onSectionSelect}
        />
      </main>

      {/* Footer */}
      <footer className={`flex flex-col gap-3 sm:gap-2 py-4 sm:py-6 w-full shrink-0 items-center px-4 sm:px-6 lg:px-8 border-t ${themeClasses.border} ${themeClasses.background}`}>
        <p className={`${themeClasses.textSecondary} text-center ${
          isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
        }`}>
          © 2024 {config.business?.name || 'LaunchGen'} AI. All rights reserved.
        </p>
      </footer>
    </div>
  );
}