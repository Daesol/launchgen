"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getThemeClasses } from "@/utils/theme";
import { FAQSection as FAQSectionType, Theme } from "@/types/landing-page.types";
import { PreviewMode } from "@/types/common.types";

interface FAQSectionProps {
  faq: FAQSectionType;
  theme: Theme;
  previewMode?: PreviewMode;
  onSectionSelect?: (sectionId: string) => void;
}

export default function FAQSection({ 
  faq, 
  theme, 
  previewMode = 'desktop',
  onSectionSelect 
}: FAQSectionProps) {
  const themeClasses = getThemeClasses(theme);
  const isMobilePreview = previewMode === 'mobile';

  return (
    <section 
      id="faq" 
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 scroll-mt-16 sm:scroll-mt-20 ${themeClasses.muted}`}
      onClick={() => onSectionSelect?.('faq')}
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
              {faq.title || "Frequently Asked Questions"}
            </h2>
            <p className={`${themeClasses.textSecondary} ${
              isMobilePreview 
                ? 'text-xs max-w-[280px]' 
                : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
            }`}>
              {faq.subtitle || "Everything you need to know"}
            </p>
          </div>
        </div>
        {faq.questions && faq.questions.length > 0 && (
          <div className={`mx-auto max-w-4xl py-8 sm:py-12 space-y-4 sm:space-y-6`}>
            {faq.questions
              .filter(faqItem => faqItem && typeof faqItem === 'object')
              .map((faqItem, i) => (
                <Card 
                  key={i} 
                  className={`${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:border-opacity-80`}
                >
                  <CardHeader>
                    <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                      isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                    }`}>
                      {faqItem.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className={`${themeClasses.textSecondary} ${
                      isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                    }`}>
                      {faqItem.answer}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}