"use client";
import React from "react";
import { getThemeClasses, getAccentColor } from "@/utils/theme";
import LeadForm from "@/components/features/forms/LeadForm";
import { Theme } from "@/types/landing-page.types";
import { PreviewMode } from "@/types/common.types";

interface CTASectionProps {
  ctaTitle?: string;
  ctaSubtitle?: string;
  theme: Theme;
  pageId?: string;
  previewMode?: PreviewMode;
  onSectionSelect?: (sectionId: string) => void;
}

export default function CTASection({ 
  ctaTitle, 
  ctaSubtitle, 
  theme, 
  pageId,
  previewMode = 'desktop',
  onSectionSelect 
}: CTASectionProps) {
  const themeClasses = getThemeClasses(theme);
  const isMobilePreview = previewMode === 'mobile';

  return (
    <section 
      id="cta-section" 
      className="w-full py-8 sm:py-12 md:py-16 lg:py-24 scroll-mt-16 sm:scroll-mt-20" 
      style={{ 
        backgroundColor: getAccentColor(theme.accentColor, 0.9),
        cursor: onSectionSelect ? 'pointer' : 'default'
      }}
      onClick={() => onSectionSelect?.('cta')}
    >
      <div className={`max-w-6xl mx-auto ${
        isMobilePreview ? 'px-2' : 'px-4 sm:px-6 lg:px-8'
      }`}>
        <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 text-center">
          
          <div className="space-y-3 sm:space-y-4">
            <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
              isMobilePreview 
                ? 'text-xl' 
                : 'text-4xl'
            }`}>
              {ctaTitle || "Ready to Get Started?"}
            </h2>
            <p className={`mx-auto ${themeClasses.textSecondary} ${
              isMobilePreview 
                ? 'text-xs max-w-[280px]' 
                : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[500px] sm:max-w-[600px] px-4 sm:px-0'
            }`}>
              {ctaSubtitle || "Join thousands of users who are already building amazing things with our platform."}
            </p>
          </div>
          <div className={`w-full space-y-3 sm:space-y-4 ${
            isMobilePreview ? 'max-w-xs' : 'max-w-sm sm:max-w-md'
          }`}>
            <div className={`${themeClasses.background} rounded-lg p-4 sm:p-6`}>
              <LeadForm pageId={pageId || ''} theme={theme} previewMode={previewMode} />
            </div>
            <p className={`${themeClasses.textSecondary} ${
              isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
            }`}>
              Start your free trial. No credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}