"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { renderIcon, getDefaultIcon } from "@/lib/iconUtils";
import { getThemeClasses, getAccentColor } from "@/utils/theme";
import { ProblemSection as ProblemSectionType, Theme } from "@/types/landing-page.types";
import { PreviewMode } from "@/types/common.types";

interface ProblemSectionProps {
  problemSection: ProblemSectionType;
  theme: Theme;
  previewMode?: PreviewMode;
  onSectionSelect?: (sectionId: string) => void;
}

export default function ProblemSection({ 
  problemSection, 
  theme, 
  previewMode = 'desktop',
  onSectionSelect 
}: ProblemSectionProps) {
  const themeClasses = getThemeClasses(theme);
  const isMobilePreview = previewMode === 'mobile';

  return (
    <section 
      id="problem-section" 
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 scroll-mt-16 sm:scroll-mt-20 ${themeClasses.background}`}
      onClick={() => onSectionSelect?.('problemSection')}
      style={{ cursor: onSectionSelect ? 'pointer' : 'default' }}
    >
      <div className={`max-w-6xl mx-auto ${
        isMobilePreview ? 'px-2' : 'px-4 sm:px-6 lg:px-8'
      }`}>
        <div className={`grid gap-8 sm:gap-12 lg:gap-16 ${
          isMobilePreview 
            ? 'grid-cols-1' 
            : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          {/* Left Column - Headings */}
          <div className="space-y-4 sm:space-y-6">
                  <h2 className={`font-bold tracking-tighter text-left ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
              isMobilePreview 
                ? 'text-xl' 
                : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
            }`}>
              {problemSection.title || "The Problem"}
            </h2>
            <p className={`text-left ${themeClasses.textSecondary} ${
              isMobilePreview 
                ? 'text-sm' 
                : 'text-base sm:text-lg md:text-xl'
            }`}>
              {problemSection.subtitle || "Are you struggling with these common challenges?"}
            </p>
          </div>
          
          {/* Right Column - Pain Points */}
          {problemSection.painPoints && problemSection.painPoints.length > 0 && (
            <div className="space-y-3 sm:space-y-4">
              {problemSection.painPoints
                .filter(painPoint => painPoint && typeof painPoint === 'object')
                .map((painPoint, i) => (
                  <Card 
                    key={i} 
                    className={`${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-opacity-80 p-4 sm:p-5`}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: getAccentColor(theme.accentColor, 0.1),
                          color: theme.accentColor
                        }}
                      >
                        {painPoint.icon 
                          ? renderIcon(painPoint.icon, "h-4 w-4") 
                          : renderIcon(getDefaultIcon(i), "h-4 w-4")
                        }
                      </div>
                      <div className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                        isMobilePreview ? 'text-sm' : 'text-base sm:text-lg'
                      }`}>
                        {painPoint.text}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}