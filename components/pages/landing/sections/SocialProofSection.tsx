"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { getThemeClasses, getAccentColor } from "@/utils/theme";
import { SocialProof, Theme } from "@/types/landing-page.types";
import { PreviewMode } from "@/types/common.types";

interface SocialProofSectionProps {
  socialProof: SocialProof;
  theme: Theme;
  previewMode?: PreviewMode;
  onSectionSelect?: (sectionId: string) => void;
}

// Helper function to safely get rating for testimonials
const getSafeRating = (rating: any): number => {
  if (rating === null || rating === undefined) return 5;
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1) return 5;
  if (numRating > 5) return 5;
  return Math.floor(numRating);
};

export default function SocialProofSection({ 
  socialProof, 
  theme, 
  previewMode = 'desktop',
  onSectionSelect 
}: SocialProofSectionProps) {
  const themeClasses = getThemeClasses(theme);
  const isMobilePreview = previewMode === 'mobile';

  return (
    <section 
      id="social-proof" 
      className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 scroll-mt-16 sm:scroll-mt-20 ${themeClasses.background}`}
      onClick={() => onSectionSelect?.('socialProof')}
      style={{ cursor: onSectionSelect ? 'pointer' : 'default' }}
    >
      <div className={`max-w-6xl mx-auto ${
        isMobilePreview ? 'px-2' : 'px-4 sm:px-6 lg:px-8'
      }`}>
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
          <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${theme.mode === 'black' ? 'text-white' : ''} ${
              isMobilePreview 
                ? 'text-xl' 
                : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
            }`}>
              {socialProof.title || "What Our Customers Say"}
            </h2>
            <p className={`${themeClasses.textSecondary} ${
              isMobilePreview 
                ? 'text-xs max-w-[280px]' 
                : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
            }`}>
              {socialProof.subtitle || "Join thousands of satisfied customers"}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        {socialProof.stats && socialProof.stats.length > 0 && (
          <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
            isMobilePreview 
              ? 'grid-cols-1 max-w-sm' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
          }`}>
            {socialProof.stats
              .filter(stat => stat && typeof stat === 'object')
              .map((stat, i) => (
                <Card 
                  key={i} 
                  className={`h-full ${themeClasses.surface} ${themeClasses.border} text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-opacity-80`}
                >
                  <CardHeader className="pb-4">
                    <div className="space-y-2">
                      <div className={`text-3xl sm:text-4xl font-bold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`} 
                           style={{ color: theme.accentColor }}>
                        {stat.number}
                      </div>
                      <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                        isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                      }`}>
                        {stat.label}
                      </CardTitle>
                      <CardDescription className={`${themeClasses.textSecondary} ${
                        isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                      }`}>
                        {stat.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
          </div>
        )}

        {/* Testimonials */}
        {socialProof.testimonials && Array.isArray(socialProof.testimonials) && socialProof.testimonials.length > 0 && (
          <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
            isMobilePreview 
              ? 'grid-cols-1 max-w-sm' 
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
          }`}>
            {socialProof.testimonials
              .filter(testimonial => testimonial && typeof testimonial === 'object')
              .map((testimonial, i) => (
                <Card 
                  key={i} 
                  className={`h-full ${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-opacity-80`}
                >
                  <CardHeader className="pb-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-1">
                        {[...Array(getSafeRating(testimonial.rating))].map((_, starIndex) => (
                          <Star key={starIndex} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <CardDescription className={`${themeClasses.textSecondary} italic ${
                        isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                      }`}>
                        "{testimonial.quote}"
                      </CardDescription>
                      {testimonial.result && (
                        <div className={`text-sm font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`} 
                             style={{ color: theme.accentColor }}>
                          Result: {testimonial.result}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className={`font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`}>
                        {testimonial.name}
                      </div>
                      <div className={`text-sm ${themeClasses.textSecondary}`}>
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}