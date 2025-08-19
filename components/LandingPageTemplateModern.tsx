"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Check, 
  Menu, 
  Star, 
  Play, 
  Download, 
  Users, 
  TrendingUp, 
  Award, 
  Shield,
  ChevronDown,
  ChevronUp,
  X
} from "lucide-react";
import { renderIcon, getDefaultIcon } from "@/lib/iconUtils";
import Link from "next/link";
import LeadForm from "./LeadForm";
import { getThemeClasses, getAccentColor } from "@/lib/themeUtils";
import HighlightedText from "./HighlightedText";

interface LandingPageTemplateModernProps {
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

export default function LandingPageTemplateModern({ config, pageId, previewMode = 'desktop', visibleSections, onSectionClick }: LandingPageTemplateModernProps) {
  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(null);
  
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
  const accentColor = theme.accentColor;

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

  // Add a function to render sections based on sectionOrder
  const renderSection = (sectionName: string) => {
    console.log(`Checking section ${sectionName}:`, {
      isVisible: isSectionVisible(sectionName),
      hasConfig: !!(config as any)[sectionName],
    });

    if (!isSectionVisible(sectionName)) {
      return null;
    }

    switch (sectionName) {
      case 'problemSection':
        return config.problemSection && (
          <section 
            id="problem-section" 
            className="py-16 lg:py-24 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSectionClick?.('problemSection')}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-black mb-6">
                  {config.problemSection.title || "The Problem"}
                </h2>
                <p className="text-xl text-black/65 max-w-3xl mx-auto">
                  {config.problemSection.subtitle || "Understanding the challenges you face"}
                </p>
              </div>
              
              {config.problemSection.painPoints && config.problemSection.painPoints.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {config.problemSection.painPoints.map((point, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                            {renderIcon(point.icon || 'alert-circle', 'h-6 w-6')}
                          </div>
                          <h3 className="text-xl font-semibold text-black">Pain Point {index + 1}</h3>
                        </div>
                        <p className="text-black/65 leading-relaxed">{point.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'features':
        return (
          <section 
            id="features-section" 
            className="py-16 lg:py-24 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSectionClick?.('features')}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-black mb-6">
                  {config.featuresTitle || "Key Features"}
                </h2>
                <p className="text-xl text-black/65 max-w-3xl mx-auto">
                  {config.featuresSubtitle || "Discover what makes us different"}
                </p>
              </div>
              
              <div className="space-y-16">
                {features.map((feature, index) => (
                  <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}>
                    <div className="flex-1">
                      <div className="mb-6">
                        <div className="inline-flex items-center gap-3 mb-4">
                          <div className="p-3 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                            {renderIcon(feature.icon || 'star', 'h-6 w-6')}
                          </div>
                          <h3 className="text-3xl lg:text-4xl font-serif font-semibold text-black">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-lg text-black/65 leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        {feature.benefit && (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-800">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">{feature.benefit}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 text-2xl">📱</span>
                          </div>
                          <p className="text-gray-600 text-sm">Interactive Demo Placeholder</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'socialProof':
        return config.socialProof && (
          <section 
            id="social-proof-section" 
            className="py-16 lg:py-24 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: `${accentColor}35` }}
            onClick={() => onSectionClick?.('socialProof')}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-black mb-6">
                  {config.socialProof.title || "Social Proof"}
                </h2>
                <p className="text-xl text-black/65 max-w-3xl mx-auto">
                  {config.socialProof.subtitle || "See what others are saying"}
                </p>
              </div>
              
              {config.socialProof.stats && config.socialProof.stats.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {config.socialProof.stats.map((stat, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-white text-center">
                      <CardContent className="p-8">
                        <div className="mb-4">
                          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
                            {renderIcon('trending-up', 'h-8 w-8')}
                          </div>
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-bold text-black mb-2">{stat.number}</h3>
                        <p className="text-lg font-semibold text-black mb-2">{stat.label}</p>
                        <p className="text-black/65">{stat.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              {config.socialProof.testimonials && config.socialProof.testimonials.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {config.socialProof.testimonials.map((testimonial, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-white">
                      <CardContent className="p-8">
                        <div className="flex items-center gap-1 mb-4">
                          {[...Array(getSafeRating(testimonial.rating))].map((_, i) => (
                            <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <blockquote className="text-black/65 mb-6 italic">
                          "{testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-black">{testimonial.name}</p>
                            <p className="text-sm text-black/65">{testimonial.role} at {testimonial.company}</p>
                            {testimonial.result && (
                              <p className="text-sm font-medium text-green-600">{testimonial.result}</p>
                            )}
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

      case 'guarantees':
        return config.guarantees && (
          <section 
            id="guarantees-section" 
            className="py-16 lg:py-24 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => onSectionClick?.('guarantees')}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-black mb-6">
                  {config.guarantees.title || "Our Guarantees"}
                </h2>
                <p className="text-xl text-black/65 max-w-3xl mx-auto">
                  {config.guarantees.subtitle || "We stand behind our promises"}
                </p>
              </div>
              
              {config.guarantees.guarantees && config.guarantees.guarantees.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {config.guarantees.guarantees.map((guarantee, index) => (
                    <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-64">
                      <CardContent className="p-8 h-full flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                            {renderIcon(guarantee.icon || 'shield', 'h-6 w-6')}
                          </div>
                          <h3 className="text-2xl lg:text-3xl font-serif font-semibold text-black">
                            {guarantee.title}
                          </h3>
                        </div>
                        <p className="text-black/65 leading-relaxed flex-1">{guarantee.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'faq':
        return config.faq && (
          <section 
            id="faq-section" 
            className="py-16 lg:py-24 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSectionClick?.('faq')}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-black mb-6">
                  {config.faq.title || "Frequently Asked Questions"}
                </h2>
                <p className="text-xl text-black/65 max-w-3xl mx-auto">
                  {config.faq.subtitle || "Everything you need to know"}
                </p>
              </div>
              
              {config.faq.questions && config.faq.questions.length > 0 && (
                <div className="space-y-4">
                  {config.faq.questions.map((faq, index) => (
                    <Card key={index} className="border-0 shadow-lg bg-white">
                      <CardHeader 
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setOpenFAQIndex(openFAQIndex === index ? null : index)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-black">{faq.question}</CardTitle>
                          {openFAQIndex === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </CardHeader>
                      {openFAQIndex === index && (
                        <CardContent className="pt-0 pb-6">
                          <p className="text-black/65 leading-relaxed">{faq.answer}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'cta':
        return (
          <section 
            id="cta-section" 
            className="py-16 lg:py-24 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ backgroundColor: `${accentColor}35` }}
            onClick={() => onSectionClick?.('cta')}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl lg:text-5xl font-serif font-semibold text-black mb-6">
                {config.ctaTitle || "Ready to Get Started?"}
              </h2>
              <p className="text-xl text-black/65 mb-8 max-w-2xl mx-auto">
                {config.ctaSubtitle || "Join thousands of satisfied customers today"}
              </p>
              
              <div className="max-w-md mx-auto">
                <LeadForm pageId={pageId || ''} theme={theme} ctaText={hero.cta} previewMode={previewMode} />
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Get section order from config or use default
  const sectionOrder = config.sectionOrder || [
    'problemSection',
    'features',
    'socialProof',
    'guarantees',
    'faq',
    'cta'
  ];

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Navigation - Only show when not in dashboard preview */}
      {!pageId && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: accentColor }}>
                  {renderIcon(business?.logo || 'zap', 'h-6 w-6 text-white')}
                </div>
                <span className="text-xl font-bold text-black">
                  {business?.name || "LaunchGen"}
                </span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <button
                  onClick={() => scrollToSection('features-section')}
                  className="text-black/65 hover:text-black transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection('social-proof-section')}
                  className="text-black/65 hover:text-black transition-colors"
                >
                  Social Proof
                </button>
                <button
                  onClick={() => scrollToSection('faq-section')}
                  className="text-black/65 hover:text-black transition-colors"
                >
                  FAQ
                </button>
                <Button
                  onClick={scrollToCTA}
                  className="px-6 py-2"
                  style={{ backgroundColor: accentColor }}
                >
                  Get Started
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 bg-white">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <button
                    onClick={() => scrollToSection('features-section')}
                    className="block w-full text-left px-3 py-2 text-black/65 hover:text-black hover:bg-gray-50 rounded-md"
                  >
                    Features
                  </button>
                  <button
                    onClick={() => scrollToSection('social-proof-section')}
                    className="block w-full text-left px-3 py-2 text-black/65 hover:text-black hover:bg-gray-50 rounded-md"
                  >
                    Social Proof
                  </button>
                  <button
                    onClick={() => scrollToSection('faq-section')}
                    className="block w-full text-left px-3 py-2 text-black/65 hover:text-black hover:bg-gray-50 rounded-md"
                  >
                    FAQ
                  </button>
                  <Button
                    onClick={scrollToCTA}
                    className="w-full mt-2 px-6 py-2"
                    style={{ backgroundColor: accentColor }}
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Hero Section */}
      <section 
        className="pt-16 lg:pt-24 pb-16 lg:pb-24 relative overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => onSectionClick?.('hero')}
      >
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-10"></div>
        {hero.backgroundImage && hero.backgroundImageEnabled && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${hero.backgroundImage})`,
              opacity: hero.backgroundImageOpacity || 0.1
            }}
          />
        )}
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="text-center lg:text-left">
              {hero.heroTag && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 mb-6">
                  {renderIcon(hero.heroTagIcon || 'star', 'h-4 w-4')}
                  <span className="text-sm font-medium">{hero.heroTag}</span>
                </div>
              )}
              
              <h1 className="text-5xl lg:text-7xl font-serif font-semibold text-black mb-6 leading-tight">
                <HighlightedText 
                  text={hero.headline}
                  highlights={hero.headlineHighlights || []}
                  accentColor={accentColor}
                />
              </h1>
              
              <p className="text-xl text-black/65 mb-8 max-w-2xl lg:max-w-none">
                {hero.subheadline}
              </p>
              
              <Button
                onClick={scrollToCTA}
                size="lg"
                className="px-8 py-4 text-lg"
                style={{ backgroundColor: accentColor }}
              >
                {hero.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Media Placeholder */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-300 flex items-center justify-center">
                    <Play className="h-10 w-10 text-gray-600" />
                  </div>
                  <p className="text-gray-600">Video Demo Placeholder</p>
                  <p className="text-sm text-gray-500 mt-2">16:9 Aspect Ratio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Sections */}
      {sectionOrder.map((sectionName) => renderSection(sectionName))}

      {/* Footer */}
      <footer className="py-16" style={{ backgroundColor: `${accentColor}35` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: accentColor }}>
                  {renderIcon(business?.logo || 'zap', 'h-6 w-6 text-white')}
                </div>
                <span className="text-xl font-bold text-black">
                  {business?.name || "LaunchGen"}
                </span>
              </div>
              <p className="text-black/65 max-w-md">
                Transform your ideas into high-converting landing pages with AI-powered generation and modern design.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-black mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection('features-section')}
                    className="text-black/65 hover:text-black transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('social-proof-section')}
                    className="text-black/65 hover:text-black transition-colors"
                  >
                    Social Proof
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection('faq-section')}
                    className="text-black/65 hover:text-black transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-semibold text-black mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-black/65 hover:text-black transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black/65 hover:text-black transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-black/65 hover:text-black transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-black/10 mt-12 pt-8 text-center">
            <p className="text-black/65">
              © 2024 {business?.name || "LaunchGen"}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 