"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Menu, Star } from "lucide-react";
import { renderIcon, getDefaultIcon } from "@/lib/iconUtils";
import Link from "next/link";
import LeadForm from "./LeadForm";
import { getThemeClasses, getAccentColor } from "@/lib/themeUtils";
import HighlightedText from "./HighlightedText";

interface LandingPageTemplateProps {
  config: {
    business?: {
      name?: string;
      logo?: string;
    };
    hero: {
      headline: string;
      headlineHighlights?: string[];
      subheadline: string;
      cta: string;
      backgroundImage?: string;
      backgroundImageEnabled?: boolean;
      backgroundImageOpacity?: number;
      heroTag?: string;
      heroTagIcon?: string;
    };
    // Problem Amplification Section
    problemSection?: {
      title?: string;
      subtitle?: string;
      painPoints?: Array<{ text: string; icon?: string }>;
    };
    // Social Proof Section
    socialProof?: {
      title?: string;
      subtitle?: string;
      testimonials?: Array<{ 
        name: string; 
        role: string; 
        company: string;
        quote: string; 
        rating?: number;
        result?: string;
      }>;
      stats?: Array<{ number: string; label: string; description: string }>;
    };
    features: Array<{ title: string; description: string; icon?: string; benefit?: string }>;
    featuresTitle?: string;
    featuresSubtitle?: string;
    // Risk Reversal Section
    guarantees?: {
      title?: string;
      subtitle?: string;
      guarantees?: Array<{ title: string; description: string; icon?: string }>;
    };
    // FAQ Section
    faq?: {
      title?: string;
      subtitle?: string;
      questions?: Array<{ question: string; answer: string }>;
    };
    ctaTitle?: string;
    ctaSubtitle?: string;
    // Urgency/Scarcity elements
    urgency?: {
      enabled?: boolean;
      message?: string;
      deadline?: string;
    };
    theme?: {
      mode: "white" | "black";
      accentColor: string;
    };
    // Section order for drag-and-drop functionality
    sectionOrder?: string[];
    // Legacy support
    themeColors?: {
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
    };
  };
  pageId?: string;
  previewMode?: 'desktop' | 'mobile';
  visibleSections?: Record<string, boolean>;
  onSectionClick?: (sectionName: string) => void;
}

export default function LandingPageTemplate({ config, pageId, previewMode = 'desktop', visibleSections, onSectionClick }: LandingPageTemplateProps) {
  // Debug logging
  console.log('LandingPageTemplate received config:', config);
  console.log('LandingPageTemplate received visibleSections:', visibleSections);
  console.log('LandingPageTemplate received pageId:', pageId);
  console.log("Problem section:", config?.problemSection);
  console.log("Social proof:", config?.socialProof);
  console.log("Guarantees:", config?.guarantees);
  console.log("FAQ:", config?.faq);
  
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  if (!config || !config.hero || !config.features) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg font-semibold">
        Invalid or incomplete config. Please try again.
      </div>
    );
  }
  
  // Handle legacy themeColors structure
  const legacyTheme: { mode: "white" | "black"; accentColor: string } = config.themeColors ? {
    mode: 'white',
    accentColor: config.themeColors.accentColor || config.themeColors.primaryColor || '#6366f1',
  } : {
    mode: 'white',
    accentColor: '#6366f1',
  };
  
  const theme = config.theme || legacyTheme;
  const { business, hero, features } = config;
  const themeClasses = getThemeClasses(theme);

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

  const scrollToCTA = () => {
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Force mobile layout when in mobile preview mode
  const isMobilePreview = previewMode === 'mobile';



  // Helper function to check if a section should be visible
  const isSectionVisible = (sectionName: string): boolean => {
    if (!visibleSections) return true; // Default to visible if no visibility config
    return visibleSections[sectionName] !== false; // Show if not explicitly hidden
  };

  // Helper function to safely get rating for testimonials
  const getSafeRating = (rating: any): number => {
    if (rating === null || rating === undefined) return 5;
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1) return 5;
    if (numRating > 5) return 5;
    return Math.floor(numRating);
  };

  // Add a function to render sections based on sectionOrder
  const renderSection = (sectionName: string) => {
    console.log(`Checking section ${sectionName}:`, {
      isVisible: isSectionVisible(sectionName),
      hasConfig: !!(config as any)[sectionName],
      configData: (config as any)[sectionName]
    });
    switch (sectionName) {
      case 'problemSection':
        return isSectionVisible('problemSection') ? (
          <section key="problemSection" id="problem-section" className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.background}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  }`}>{config.problemSection?.title || "The Problem"}</h2>
                  <p className={`text-left ${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-sm' 
                      : 'text-base sm:text-lg md:text-xl'
                  }`}>
                    {config.problemSection?.subtitle || "Are you struggling with these common challenges?"}
                  </p>
                </div>
                
                {/* Right Column - Pain Points */}
                {config.problemSection?.painPoints && config.problemSection.painPoints.length > 0 && (
                  <div className="space-y-3 sm:space-y-4">
                    {config.problemSection.painPoints.filter(painPoint => painPoint && typeof painPoint === 'object').map((painPoint, i) => (
                      <Card key={i} className={`${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-opacity-80 p-4 sm:p-5`}>
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ 
                              backgroundColor: getAccentColor(theme.accentColor, 0.1),
                              color: theme.accentColor
                            }}
                          >
                            {painPoint.icon ? renderIcon(painPoint.icon, "h-4 w-4") : renderIcon(getDefaultIcon(i), "h-4 w-4")}
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
        ) : null;
      case 'features':
        return isSectionVisible('features') ? (
          <section key="features" id="features" className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.muted}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.featuresTitle || "Solutions/Features"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.featuresSubtitle || "Everything you need to build, deploy, and scale your applications with confidence."}
                  </p>
                </div>
              </div>
              <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                isMobilePreview 
                  ? 'grid-cols-1 max-w-sm' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
              }`}>
                                  {features.filter(feature => feature && typeof feature === 'object').map((feature, i) => (
                  <Card key={i} className={`h-full ${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-opacity-80`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="p-2 rounded-lg flex items-center justify-center"
                          style={{ 
                            backgroundColor: getAccentColor(theme.accentColor, 0.1),
                            color: theme.accentColor
                          }}
                        >
                          {feature.icon ? renderIcon(feature.icon, "h-5 w-5") : renderIcon(getDefaultIcon(i), "h-5 w-5")}
                        </div>
                        <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                          isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                        }`}>{feature.title}</CardTitle>
                      </div>
                      <CardDescription className={`${themeClasses.textSecondary} ${
                        isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                      }`}>
                        {feature.description}
                      </CardDescription>
                      {feature.benefit && (
                        <div className={`text-sm font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`} style={{ color: theme.accentColor }}>
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
        ) : null;
      case 'socialProof':
        return isSectionVisible('socialProof') ? (
          <section key="socialProof" id="social-proof" className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.background}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.socialProof?.title || "What Our Customers Say"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.socialProof?.subtitle || "Join thousands of satisfied customers"}
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              {config.socialProof?.stats && config.socialProof.stats.length > 0 && (
                <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                  isMobilePreview 
                    ? 'grid-cols-1 max-w-sm' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
                }`}>
                  {config.socialProof.stats.filter(stat => stat && typeof stat === 'object').map((stat, i) => (
                    <Card key={i} className={`h-full ${themeClasses.surface} ${themeClasses.border} text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-opacity-80`}>
                      <CardHeader className="pb-4">
                        <div className="space-y-2">
                          <div className={`text-3xl sm:text-4xl font-bold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`} style={{ color: theme.accentColor }}>
                            {stat.number}
                          </div>
                          <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                            isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                          }`}>{stat.label}</CardTitle>
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
              {config.socialProof?.testimonials && Array.isArray(config.socialProof.testimonials) && config.socialProof.testimonials.length > 0 && (
                <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                  isMobilePreview 
                    ? 'grid-cols-1 max-w-sm' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
                }`}>
                  {config.socialProof.testimonials.filter(testimonial => testimonial && typeof testimonial === 'object').map((testimonial, i) => (
                    <Card key={i} className={`h-full ${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-opacity-80`}>
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
                            <div className={`text-sm font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`} style={{ color: theme.accentColor }}>
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
        ) : null;
      case 'guarantees':
        return isSectionVisible('guarantees') ? (
          <section key="guarantees" id="guarantees" className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.background}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.guarantees?.title || "Our Guarantees"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.guarantees?.subtitle || "We're confident you'll love our solution"}
                  </p>
                </div>
              </div>
              {config.guarantees?.guarantees && config.guarantees.guarantees.length > 0 && (
                <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                  isMobilePreview 
                    ? 'grid-cols-1 max-w-sm' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
                }`}>
                  {config.guarantees.guarantees.filter(guarantee => guarantee && typeof guarantee === 'object').map((guarantee, i) => (
                    <Card key={i} className={`h-full ${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-opacity-80`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div 
                            className="p-2 rounded-lg flex items-center justify-center"
                            style={{ 
                              backgroundColor: getAccentColor(theme.accentColor, 0.1),
                              color: theme.accentColor
                            }}
                          >
                            {guarantee.icon ? renderIcon(guarantee.icon, "h-5 w-5") : renderIcon(getDefaultIcon(i), "h-5 w-5")}
                          </div>
                          <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                            isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                          }`}>{guarantee.title}</CardTitle>
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
        ) : null;
      case 'faq':
        return isSectionVisible('faq') ? (
          <section key="faq" id="faq" className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.muted}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.faq?.title || "Frequently Asked Questions"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.faq?.subtitle || "Everything you need to know"}
                  </p>
                </div>
              </div>
              {config.faq?.questions && config.faq.questions.length > 0 && (
                <div className={`mx-auto max-w-4xl py-8 sm:py-12 space-y-4 sm:space-y-6`}>
                  {config.faq.questions.filter(faq => faq && typeof faq === 'object').map((faq, i) => (
                    <Card key={i} className={`${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:border-opacity-80`}>
                      <CardHeader>
                        <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                          isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                        }`}>{faq.question}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className={`${themeClasses.textSecondary} ${
                          isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                        }`}>
                          {faq.answer}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : null;
      case 'cta':
        return isSectionVisible('cta') ? (
          <section key="cta" id="cta-section" className="w-full py-8 sm:py-12 md:py-16 lg:py-24" style={{ backgroundColor: getAccentColor(theme.accentColor, 0.9) }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 text-center">
                {/* Urgency Banner */}
                {config.urgency?.enabled && (
                  <div className={`w-full max-w-2xl mx-auto p-4 rounded-lg ${themeClasses.surface} ${themeClasses.border} animate-pulse`}>
                    <div className={`text-sm font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`} style={{ color: theme.accentColor }}>
                      ⏰ {config.urgency.message || "Limited Time Offer"}
                      {config.urgency.deadline && (
                        <span className="ml-2">- {config.urgency.deadline}</span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>
                    {config.ctaTitle || "Ready to Get Started?"}
                  </h2>
                  <p className={`mx-auto ${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[500px] sm:max-w-[600px] px-4 sm:px-0'
                  }`}>
                    {config.ctaSubtitle || "Join thousands of users who are already building amazing things with our platform."}
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
                  }`}>Start your free trial. No credit card required.</p>
                </div>
              </div>
            </div>
        </section>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${themeClasses.background}`}>
      {/* Header - Only show when not in dashboard preview */}
      {!pageId && (
        <header className={`px-4 sm:px-6 lg:px-8 flex items-center border-b ${themeClasses.border} ${themeClasses.background} ${
          isMobilePreview ? 'h-12' : 'h-14'
        }`}>
        <Link className="flex items-center justify-center" href="#">
          {business?.logo ? (
            <img 
              src={business.logo} 
              alt={`${business.name || 'Business'} Logo`}
              className={`rounded-md object-cover ${
                isMobilePreview ? 'h-6 w-6' : 'h-8 w-8'
              }`}
            />
          ) : (
            <div className={`rounded-md flex items-center justify-center font-bold ${
              isMobilePreview ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'
            } text-white`}
            style={{ 
              backgroundColor: theme.mode === 'black' ? '#1e293b' : theme.accentColor
            }}>
              {business?.name ? business.name.charAt(0).toUpperCase() : 'L'}
            </div>
          )}
          <span className={`ml-2 font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
            isMobilePreview ? 'text-sm' : 'text-base sm:text-lg'
          }`}>
            {business?.name || 'LaunchGen'}
          </span>
        </Link>
        <nav className="ml-auto hidden md:flex items-center gap-4 lg:gap-6">
          <Link className={`text-sm font-medium hover:underline underline-offset-4 ${themeClasses.textSecondary} hover:${themeClasses.text}`} href="#features">
            Features
          </Link>
          <Link className={`text-sm font-medium hover:underline underline-offset-4 ${themeClasses.textSecondary} hover:${themeClasses.text}`} href="#pricing">
            Pricing
          </Link>
          <Link className={`text-sm font-medium hover:underline underline-offset-4 ${themeClasses.textSecondary} hover:${themeClasses.text}`} href="#about">
            About
          </Link>
          <Link className={`text-sm font-medium hover:underline underline-offset-4 ${themeClasses.textSecondary} hover:${themeClasses.text}`} href="#contact">
            Contact
          </Link>
          <Button 
            size="sm" 
            onClick={scrollToCTA}
            className="transition-all duration-300 hover:scale-105 hover:shadow-md"
            style={{ 
              backgroundColor: theme.accentColor,
              borderColor: theme.accentColor
            }}
    >
            {hero.cta}
          </Button>
        </nav>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`ml-auto md:hidden ${theme.mode === 'black' ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'}`}
          onClick={toggleMobileMenu}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </header>

      {/* Mobile Menu - Only show when not in dashboard preview */}
      {!pageId && isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute top-0 left-0 right-0 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-semibold text-gray-800">Menu</span>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-4">
              {isSectionVisible('features') && (
                <button
                  onClick={() => scrollToSection('features')}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${themeClasses.textSecondary} hover:${themeClasses.text} hover:bg-gray-100`}
                >
                  Features
                </button>
              )}
              {isSectionVisible('problemSection') && (
                <button
                  onClick={() => scrollToSection('problem-section')}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${themeClasses.textSecondary} hover:${themeClasses.text} hover:bg-gray-100`}
                >
                  Problems
                </button>
              )}
              {isSectionVisible('socialProof') && (
                <button
                  onClick={() => scrollToSection('social-proof')}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${themeClasses.textSecondary} hover:${themeClasses.text} hover:bg-gray-100`}
                >
                  Social Proof
                </button>
              )}
              {isSectionVisible('guarantees') && (
                <button
                  onClick={() => scrollToSection('guarantees')}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${themeClasses.textSecondary} hover:${themeClasses.text} hover:bg-gray-100`}
                >
                  Guarantees
                </button>
              )}
              {isSectionVisible('faq') && (
                <button
                  onClick={() => scrollToSection('faq')}
                  className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${themeClasses.textSecondary} hover:${themeClasses.text} hover:bg-gray-100`}
                >
                  FAQ
                </button>
              )}
              <button
                onClick={scrollToCTA}
                className={`block w-full text-left py-2 px-3 rounded-lg transition-colors font-medium`}
                style={{ 
                  backgroundColor: theme.accentColor,
                  color: 'white'
                }}
              >
                {hero.cta}
              </button>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1">
      {/* Hero Section */}
        <section 
          className={`w-full relative cursor-pointer hover:bg-gray-50 transition-colors ${isMobilePreview ? 'min-h-[90vh] flex items-center justify-center' : 'py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32'}`}
          style={{
            backgroundImage: hero.backgroundImageEnabled && hero.backgroundImage 
              ? `linear-gradient(rgba(255, 255, 255, ${1 - (hero.backgroundImageOpacity || 30) / 100}), rgba(255, 255, 255, ${1 - (hero.backgroundImageOpacity || 30) / 100})), url(${hero.backgroundImage})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
          onClick={() => onSectionClick?.('hero')}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center">
              <div className="space-y-4 sm:space-y-6">
                <Badge 
                  variant="secondary" 
                  className={`mb-4 sm:mb-6 flex items-center gap-2 w-fit mx-auto px-4 py-2 ${theme.mode === 'black' ? 'text-white' : ''}`}
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
              <div className="w-full flex justify-center items-center">
                <div className={`flex justify-center ${isMobilePreview ? 'w-full' : 'w-full sm:w-auto min-w-[320px] max-w-[400px]'}`}>
                  <LeadForm pageId={pageId || ''} theme={theme} ctaText={hero.cta} previewMode={previewMode} />
                </div>
              </div>
          </div>
        </div>
      </section>

        {/* Render sections in order */}
        {(config.sectionOrder || ['problemSection', 'features', 'socialProof', 'guarantees', 'faq', 'cta']).map(sectionName => {
          const renderedSection = renderSection(sectionName);
          console.log(`Rendering section ${sectionName}:`, renderedSection ? 'SHOWN' : 'HIDDEN');
          return renderedSection;
        })}
      </main>

      {/* Footer */}
      <footer className={`flex flex-col gap-3 sm:gap-2 py-4 sm:py-6 w-full shrink-0 items-center px-4 sm:px-6 lg:px-8 border-t ${themeClasses.border} ${themeClasses.background}`}>
        <p className={`${themeClasses.textSecondary} text-center ${
          isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
        }`}>© 2024 {business?.name || 'LaunchGen'} AI. All rights reserved.</p>
      </footer>
    </div>
  );
} 