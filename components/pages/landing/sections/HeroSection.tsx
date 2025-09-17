"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { renderIcon } from "@/lib/iconUtils";
import { getThemeClasses, getAccentColor } from "@/utils/theme";
import HighlightedText from "@/components/widgets/HighlightedText";
import LeadForm from "@/components/features/forms/LeadForm";
import MediaComponent from "@/components/features/media/MediaComponent";
import { Hero, Theme } from "@/types/landing-page.types";
import { PreviewMode } from "@/types/common.types";

interface HeroSectionProps {
  hero: Hero;
  theme: Theme;
  pageId?: string;
  previewMode?: PreviewMode;
  onSectionSelect?: (sectionId: string) => void;
}

export default function HeroSection({ 
  hero, 
  theme, 
  pageId, 
  previewMode = 'desktop',
  onSectionSelect 
}: HeroSectionProps) {
  const themeClasses = getThemeClasses(theme);
  const isMobilePreview = previewMode === 'mobile';


  return (
    <section 
      id="hero" 
      className={`relative py-4 sm:py-6 lg:py-8 scroll-mt-16 sm:scroll-mt-20 ${themeClasses.background}`}
      onClick={() => onSectionSelect?.('hero')}
      style={{ 
        cursor: onSectionSelect ? 'pointer' : 'default',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingTop: '10vh'
      }}
    >
      <div className={`${isMobilePreview ? 'px-2' : 'px-4 sm:px-6 lg:px-8'}`}>
        {/* Main Content - Natural flow */}
        <div className={`text-center ${isMobilePreview ? 'px-2' : 'px-4 sm:px-6 lg:px-8'}`}>
          <div className={`max-w-6xl mx-auto text-center relative z-10`}>
            <div className={`${isMobilePreview ? 'space-y-4' : 'space-y-6 sm:space-y-8'}`}>
              <div className={`${isMobilePreview ? 'space-y-3' : 'space-y-4 sm:space-y-6'}`}>
                {/* Hero Tag */}
                <Badge 
                  variant="secondary" 
                  className={`${isMobilePreview ? 'mb-3' : 'mb-4 sm:mb-6'} flex items-center gap-2 w-fit mx-auto px-4 py-2 ${theme.mode === 'black' ? 'text-white' : ''}`}
                  style={{ 
                    backgroundColor: getAccentColor(theme.accentColor, 0.1),
                    color: theme.mode === 'black' ? '#fff' : theme.accentColor,
                    borderColor: getAccentColor(theme.accentColor, 0.2)
                  }}
                >
                  {hero.heroTagIcon && renderIcon(hero.heroTagIcon, "h-3 w-3")}
                  {hero.heroTag || "AI-Powered Solution"}
                </Badge>
                
                <h1 className={`font-bold tracking-tighter leading-tight ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                  isMobilePreview 
                    ? 'text-2xl' 
                    : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'
                }`}>
                  <HighlightedText 
                    text={hero.headline} 
                    highlights={hero.headlineHighlights || []}
                    accentColor={theme.accentColor}
                    className={themeClasses.text}
                  />
                </h1>
                <p className={`mx-auto ${themeClasses.textSecondary} ${
                  isMobilePreview 
                    ? 'text-sm max-w-[300px]' 
                    : 'text-base sm:text-lg md:text-xl max-w-[600px] sm:max-w-[700px] px-4 sm:px-0'
                }`}>
                  {hero.subheadline}
                </p>
              </div>
              
              {/* Lead Capture Form */}
              <div className="w-full flex justify-center items-center">
                <div className={`flex justify-center ${isMobilePreview ? 'w-full' : 'w-full sm:w-auto min-w-[320px] max-w-[400px]'}`}>
                  <LeadForm 
                    pageId={pageId || ''} 
                    theme={theme} 
                    ctaText={hero.cta} 
                    previewMode={previewMode} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Media Component - Positioned below main content */}
        {hero.media?.enabled && (
          <div className="w-full flex justify-center mt-8">
            <div className={`w-full ${isMobilePreview ? 'max-w-md' : 'max-w-6xl'}`}>
              <MediaComponent
                media={hero.media}
                theme={theme}
                previewMode={previewMode}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}