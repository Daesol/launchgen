"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Menu, Star, Play, Download, Users, TrendingUp, Award, Shield } from "lucide-react";
import { renderIcon, getDefaultIcon } from "@/lib/iconUtils";
import Link from "next/link";
import LeadForm from "./LeadForm";
import { getThemeClasses, getAccentColor } from "@/lib/themeUtils";
import HighlightedText from "./HighlightedText";

interface LandingPageTemplateImageProps {
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
      heroImage?: string; // New: Hero section image
    };
    // Problem Amplification Section
    problemSection?: {
      title?: string;
      subtitle?: string;
      painPoints?: Array<{ text: string; icon?: string; image?: string }>;
      backgroundImage?: string;
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
        avatar?: string; // New: User avatar
      }>;
      stats?: Array<{ number: string; label: string; description: string; icon?: string }>;
      backgroundImage?: string;
    };
    features: Array<{ 
      title: string; 
      description: string; 
      icon?: string; 
      benefit?: string;
      image?: string; // New: Feature image
    }>;
    featuresTitle?: string;
    featuresSubtitle?: string;
    featuresBackgroundImage?: string; // New: Features section background
    // Risk Reversal Section
    guarantees?: {
      title?: string;
      subtitle?: string;
      guarantees?: Array<{ title: string; description: string; icon?: string; image?: string }>;
      backgroundImage?: string;
    };
    // FAQ Section
    faq?: {
      title?: string;
      subtitle?: string;
      questions?: Array<{ question: string; answer: string }>;
      backgroundImage?: string;
    };
    ctaTitle?: string;
    ctaSubtitle?: string;
    ctaBackgroundImage?: string; // New: CTA section background
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
}

export default function LandingPageTemplateImage({ config, pageId, previewMode = 'desktop', visibleSections }: LandingPageTemplateImageProps) {
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
    if (!visibleSections) return true;
    return visibleSections[sectionName] !== false;
  };

  // Helper function to safely get rating for testimonials
  const getSafeRating = (rating: any): number => {
    if (rating === null || rating === undefined) return 5;
    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1) return 5;
    if (numRating > 5) return 5;
    return Math.floor(numRating);
  };

  // Helper function to render sections based on sectionOrder
  const renderSection = (sectionName: string) => {
    if (!isSectionVisible(sectionName)) return null;

    switch (sectionName) {
      case 'problemSection':
        return config.problemSection ? (
          <section 
            id="problem-section"
            className="py-16 sm:py-20 lg:py-24 relative"
            style={{
              backgroundImage: config.problemSection.backgroundImage 
                ? `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${config.problemSection.backgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${themeClasses.text}`}>
                  {config.problemSection.title || "The Problem"}
                </h2>
                <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${themeClasses.textSecondary}`}>
                  {config.problemSection.subtitle || "Are you struggling with these common challenges?"}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {config.problemSection.painPoints?.map((point, index) => (
                  <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    {point.image && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={point.image} 
                          alt={point.text}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {point.icon && renderIcon(point.icon, "h-6 w-6 mr-3")}
                        <h3 className={`text-xl font-semibold ${themeClasses.text}`}>
                          {point.text}
                        </h3>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'features':
        return (
          <section 
            id="features"
            className="py-16 sm:py-20 lg:py-24 relative"
            style={{
              backgroundImage: config.featuresBackgroundImage 
                ? `linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url(${config.featuresBackgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${themeClasses.text}`}>
                  {config.featuresTitle || "Powerful Features"}
                </h2>
                <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${themeClasses.textSecondary}`}>
                  {config.featuresSubtitle || "Everything you need to succeed"}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                    {feature.image && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={feature.image} 
                          alt={feature.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {feature.icon && renderIcon(feature.icon, "h-8 w-8 mr-3")}
                        <h3 className={`text-xl font-semibold ${themeClasses.text}`}>
                          {feature.title}
                        </h3>
                      </div>
                      <p className={`mb-3 ${themeClasses.textSecondary}`}>
                        {feature.description}
                      </p>
                      {feature.benefit && (
                        <p className={`text-sm font-medium ${themeClasses.text}`} style={{ color: theme.accentColor }}>
                          {feature.benefit}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );

      case 'socialProof':
        return config.socialProof ? (
          <section 
            id="social-proof"
            className="py-16 sm:py-20 lg:py-24 relative"
            style={{
              backgroundImage: config.socialProof.backgroundImage 
                ? `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${config.socialProof.backgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${themeClasses.text}`}>
                  {config.socialProof.title || "What Our Customers Say"}
                </h2>
                <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${themeClasses.textSecondary}`}>
                  {config.socialProof.subtitle || "Join thousands of satisfied customers"}
                </p>
              </div>
              
              {/* Stats */}
              {config.socialProof.stats && config.socialProof.stats.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {config.socialProof.stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        {stat.icon && renderIcon(stat.icon, "h-8 w-8 mr-3")}
                        <span className={`text-4xl sm:text-5xl font-bold ${themeClasses.text}`} style={{ color: theme.accentColor }}>
                          {stat.number}
                        </span>
                      </div>
                      <h3 className={`text-xl font-semibold mb-2 ${themeClasses.text}`}>
                        {stat.label}
                      </h3>
                      <p className={`${themeClasses.textSecondary}`}>
                        {stat.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Testimonials */}
              {config.socialProof.testimonials && config.socialProof.testimonials.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {config.socialProof.testimonials.map((testimonial, index) => (
                    <Card key={index} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-center mb-4">
                          {testimonial.avatar && (
                            <img 
                              src={testimonial.avatar} 
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full mr-4 object-cover"
                            />
                          )}
                          <div>
                            <h4 className={`font-semibold ${themeClasses.text}`}>
                              {testimonial.name}
                            </h4>
                            <p className={`text-sm ${themeClasses.textSecondary}`}>
                              {testimonial.role} at {testimonial.company}
                            </p>
                          </div>
                        </div>
                        <div className="flex mb-3">
                          {[...Array(getSafeRating(testimonial.rating))].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className={`mb-3 ${themeClasses.textSecondary}`}>
                          "{testimonial.quote}"
                        </p>
                        {testimonial.result && (
                          <p className={`text-sm font-medium ${themeClasses.text}`} style={{ color: theme.accentColor }}>
                            {testimonial.result}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        ) : null;

      case 'guarantees':
        return config.guarantees ? (
          <section 
            id="guarantees"
            className="py-16 sm:py-20 lg:py-24 relative"
            style={{
              backgroundImage: config.guarantees.backgroundImage 
                ? `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${config.guarantees.backgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${themeClasses.text}`}>
                  {config.guarantees.title || "Our Guarantees"}
                </h2>
                <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${themeClasses.textSecondary}`}>
                  {config.guarantees.subtitle || "We've got you covered"}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {config.guarantees.guarantees?.map((guarantee, index) => (
                  <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    {guarantee.image && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={guarantee.image} 
                          alt={guarantee.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {guarantee.icon && renderIcon(guarantee.icon, "h-6 w-6 mr-3")}
                        <h3 className={`text-xl font-semibold ${themeClasses.text}`}>
                          {guarantee.title}
                        </h3>
                      </div>
                      <p className={`${themeClasses.textSecondary}`}>
                        {guarantee.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'faq':
        return config.faq ? (
          <section 
            id="faq"
            className="py-16 sm:py-20 lg:py-24 relative"
            style={{
              backgroundImage: config.faq.backgroundImage 
                ? `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(${config.faq.backgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${themeClasses.text}`}>
                  {config.faq.title || "Frequently Asked Questions"}
                </h2>
                <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${themeClasses.textSecondary}`}>
                  {config.faq.subtitle || "Everything you need to know"}
                </p>
              </div>
              <div className="space-y-6">
                {config.faq.questions?.map((faq, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-6">
                      <h3 className={`text-lg font-semibold mb-3 ${themeClasses.text}`}>
                        {faq.question}
                      </h3>
                      <p className={`${themeClasses.textSecondary}`}>
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        ) : null;

      case 'cta':
        return (
          <section 
            id="cta-section"
            className="py-16 sm:py-20 lg:py-24 relative"
            style={{
              backgroundImage: config.ctaBackgroundImage 
                ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${config.ctaBackgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${config.ctaBackgroundImage ? 'text-white' : themeClasses.text}`}>
                {config.ctaTitle || "Ready to Get Started?"}
              </h2>
              <p className={`text-lg sm:text-xl mb-8 ${config.ctaBackgroundImage ? 'text-gray-200' : themeClasses.textSecondary}`}>
                {config.ctaSubtitle || "Join thousands of satisfied customers today"}
              </p>
              <div className="flex justify-center">
                <LeadForm pageId={pageId || ''} theme={theme} ctaText={hero.cta} previewMode={previewMode} />
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${themeClasses.background}`}>
      {/* Header */}
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
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
          className={`w-full relative ${isMobilePreview ? 'min-h-[90vh] flex items-center justify-center' : 'py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32'}`}
          style={{
            backgroundImage: hero.backgroundImageEnabled && hero.backgroundImage 
              ? `linear-gradient(rgba(255, 255, 255, ${1 - (hero.backgroundImageOpacity || 30) / 100}), rgba(255, 255, 255, ${1 - (hero.backgroundImageOpacity || 30) / 100})), url(${hero.backgroundImage})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`flex flex-col ${hero.heroImage ? 'lg:flex-row lg:items-center lg:gap-12' : ''} space-y-6 sm:space-y-8 text-center lg:text-left`}>
              <div className={`flex-1 space-y-4 sm:space-y-6 ${hero.heroImage ? 'lg:pr-8' : ''}`}>
                <Badge 
                  variant="secondary" 
                  className={`mb-4 sm:mb-6 flex items-center gap-2 w-fit mx-auto lg:mx-0 px-4 py-2 ${theme.mode === 'black' ? 'text-white' : ''}`}
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
                    : 'text-base sm:text-lg md:text-xl max-w-[600px] sm:max-w-[700px] px-4 sm:px-0 lg:px-0'
                }`}>
                  {hero.subheadline}
                </p>
                <div className="w-full flex justify-center lg:justify-start items-center">
                  <div className={`flex justify-center ${isMobilePreview ? 'w-full' : 'w-full sm:w-auto min-w-[320px] max-w-[400px]'}`}>
                    <LeadForm pageId={pageId || ''} theme={theme} ctaText={hero.cta} previewMode={previewMode} />
                  </div>
                </div>
              </div>
              
              {/* Hero Image */}
              {hero.heroImage && (
                <div className="flex-1">
                  <div className="relative">
                    <img 
                      src={hero.heroImage} 
                      alt="Hero"
                      className="w-full h-auto rounded-lg shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Render sections in order */}
        {(config.sectionOrder || ['problemSection', 'features', 'socialProof', 'guarantees', 'faq', 'cta']).map(sectionName => {
          const renderedSection = renderSection(sectionName);
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