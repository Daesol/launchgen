"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { renderIcon, getDefaultIcon } from "@/lib/iconUtils";
import { getThemeClasses, getAccentColor } from "@/utils/theme";
import { Feature, Theme } from "@/types/landing-page.types";
import { PreviewMode } from "@/types/common.types";

interface FeaturesSectionProps {
  features: Feature[];
  featuresTitle?: string;
  featuresSubtitle?: string;
  theme: Theme;
  previewMode?: PreviewMode;
  onSectionSelect?: (sectionId: string) => void;
}

export default function FeaturesSection({ 
  features, 
  featuresTitle, 
  featuresSubtitle, 
  theme, 
  previewMode = 'desktop',
  onSectionSelect 
}: FeaturesSectionProps) {
  const themeClasses = getThemeClasses(theme);
  const isMobilePreview = previewMode === 'mobile';

  return (
    <section 
      id="features" 
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 scroll-mt-16 sm:scroll-mt-20 ${themeClasses.muted}`}
      onClick={() => onSectionSelect?.('features')}
      style={{ cursor: onSectionSelect ? 'pointer' : 'default' }}
    >
      <div className={`max-w-6xl mx-auto ${
        isMobilePreview ? 'px-2' : 'px-4 sm:px-6 lg:px-8'
      }`}>
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
          <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
              isMobilePreview 
                ? 'text-xl' 
                : 'text-4xl'
            }`}>
              {featuresTitle || "Solutions/Features"}
            </h2>
            <p className={`${themeClasses.textSecondary} ${
              isMobilePreview 
                ? 'text-xs max-w-[280px]' 
                : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
            }`}>
              {featuresSubtitle || "Everything you need to build, deploy, and scale your applications with confidence."}
            </p>
          </div>
        </div>
        <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
          isMobilePreview 
            ? 'grid-cols-1 max-w-sm' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
        }`}>
          {features
            .filter(feature => feature && typeof feature === 'object')
            .map((feature, i) => (
              <Card 
                key={i} 
                className={`h-full ${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-opacity-80`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="p-2 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: getAccentColor(theme.accentColor, 0.1),
                        color: theme.accentColor
                      }}
                    >
                      {feature.icon 
                        ? renderIcon(feature.icon, "h-5 w-5") 
                        : renderIcon(getDefaultIcon(i), "h-5 w-5")
                      }
                    </div>
                    <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                      isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                    }`}>
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className={`${themeClasses.textSecondary} ${
                    isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                  }`}>
                    {feature.description}
                  </CardDescription>
                  {feature.benefit && (
                    <div className={`text-sm font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`} 
                         style={{ color: theme.accentColor }}>
                      What this means for you: {feature.benefit}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Removed "Feature included" text as requested */}
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}