"use client";
import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { renderIcon, getDefaultIcon } from "@/lib/iconUtils";
import { getThemeClasses, getAccentColor } from "@/utils/theme";
import { Guarantees, Theme } from "@/types/landing-page.types";
import { PreviewMode } from "@/types/common.types";

interface GuaranteesSectionProps {
  guarantees: Guarantees;
  theme: Theme;
  previewMode?: PreviewMode;
  onSectionSelect?: (sectionId: string) => void;
}

export default function GuaranteesSection({ 
  guarantees, 
  theme, 
  previewMode = 'desktop',
  onSectionSelect 
}: GuaranteesSectionProps) {
  const themeClasses = getThemeClasses(theme);
  const isMobilePreview = previewMode === 'mobile';

  return (
    <section 
      id="guarantees" 
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 scroll-mt-16 sm:scroll-mt-20 ${themeClasses.background}`}
      onClick={() => onSectionSelect?.('guarantees')}
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
              {guarantees.title || "Our Guarantees"}
            </h2>
            <p className={`${themeClasses.textSecondary} ${
              isMobilePreview 
                ? 'text-xs max-w-[280px]' 
                : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
            }`}>
              {guarantees.subtitle || "We're confident you'll love our solution"}
            </p>
          </div>
        </div>
        {guarantees.guarantees && guarantees.guarantees.length > 0 && (
          <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
            isMobilePreview 
              ? 'grid-cols-1 max-w-sm' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
          }`}>
            {guarantees.guarantees
              .filter(guarantee => guarantee && typeof guarantee === 'object')
              .map((guarantee, i) => (
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
                        {guarantee.icon 
                          ? renderIcon(guarantee.icon, "h-5 w-5") 
                          : renderIcon(getDefaultIcon(i), "h-5 w-5")
                        }
                      </div>
                      <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                        isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                      }`}>
                        {guarantee.title}
                      </CardTitle>
                    </div>
                    <CardDescription className={`${themeClasses.textSecondary} ${
                      isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                    }`}>
                      {guarantee.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}