"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Menu, Github, Twitter, Linkedin, Zap, Star, Shield, Rocket, Target, TrendingUp, Award, Sparkles } from "lucide-react";
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
      heroTag?: string;
      heroTagIcon?: string;
    };
    // Problem Amplification Section
    problemSection?: {
      title?: string;
      subtitle?: string;
      painPoints?: Array<{ text: string; icon?: string }>;
    };
    // Solution Preview Section (NESB Framework)
    solutionSection?: {
      title?: string;
      subtitle?: string;
      benefits?: Array<{ 
        title: string; 
        description: string; 
        icon?: string;
        type?: "new" | "easy" | "safe" | "big";
      }>;
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

export default function LandingPageTemplate({ config, pageId, previewMode = 'desktop', visibleSections }: LandingPageTemplateProps) {
  // Debug logging
  console.log("LandingPageTemplate config:", config);
  console.log("Problem section:", config?.problemSection);
  console.log("Solution section:", config?.solutionSection);
  console.log("Social proof:", config?.socialProof);
  console.log("Guarantees:", config?.guarantees);
  console.log("FAQ:", config?.faq);
  
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
    }
  }, [pageId]);

  const scrollToCTA = () => {
    const ctaSection = document.getElementById('cta-section');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Force mobile layout when in mobile preview mode
  const isMobilePreview = previewMode === 'mobile';

  // Function to render icon based on icon name
  const renderIcon = (iconName: string, className: string = "h-4 w-4") => {
    const iconMap: { [key: string]: React.ReactNode } = {
      zap: <Zap className={className} />,
      star: <Star className={className} />,
      shield: <Shield className={className} />,
      rocket: <Rocket className={className} />,
      target: <Target className={className} />,
      trendingUp: <TrendingUp className={className} />,
      award: <Award className={className} />,
      sparkles: <Sparkles className={className} />,
    };
    return iconMap[iconName.toLowerCase()] || <Sparkles className={className} />;
  };

  const getDefaultIcon = (index: number) => {
    const defaultIcons = ['zap', 'star', 'shield', 'rocket', 'target', 'trendingUp', 'award', 'sparkles'];
    return defaultIcons[index % defaultIcons.length];
  };

  // Helper function to check if a section should be visible
  const isSectionVisible = (sectionName: string): boolean => {
    if (!visibleSections) return true; // Default to visible if no visibility config
    return visibleSections[sectionName] !== false; // Show if not explicitly hidden
  };

  return (
    <div className={`flex flex-col min-h-screen ${themeClasses.background}`}>
      {/* Header */}
      <header className={`px-4 sm:px-6 lg:px-8 h-14 flex items-center border-b ${themeClasses.border} ${themeClasses.background}`}>
        <Link className="flex items-center justify-center" href="#">
          {business?.logo ? (
            <img 
              src={business.logo} 
              alt={`${business.name || 'Business'} Logo`}
              className="h-8 w-8 rounded-md object-cover"
            />
          ) : (
            <div className={`h-8 w-8 rounded-md flex items-center justify-center font-bold text-sm ${theme.mode === 'black' ? 'bg-slate-800 text-white' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'}`}>
              {business?.name ? business.name.charAt(0).toUpperCase() : 'L'}
            </div>
          )}
          <span className={`ml-2 text-base sm:text-lg font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''}`}>
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
        <Button variant="ghost" size="sm" className="ml-auto md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center">
              <div className="space-y-4 sm:space-y-6">
                <Badge 
                  variant="secondary" 
                  className={`mb-4 sm:mb-6 flex items-center gap-2 w-fit mx-auto ${theme.mode === 'black' ? 'text-white' : ''}`}
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
              <div className="w-full flex justify-center">
                <div className={isMobilePreview ? 'w-full' : 'w-full sm:w-auto min-w-[320px] max-w-[400px]'}>
                  <LeadForm pageId={pageId || ''} theme={theme} ctaText={hero.cta} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Amplification Section */}
        {isSectionVisible('problemSection') && config.problemSection && (config.problemSection.title || config.problemSection.subtitle || (config.problemSection.painPoints && config.problemSection.painPoints.length > 0)) && (
          <section className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.background}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.problemSection.title || "The Problem"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.problemSection.subtitle || "Are you struggling with these common challenges?"}
                  </p>
                </div>
              </div>
              {config.problemSection.painPoints && config.problemSection.painPoints.length > 0 && (
                <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                  isMobilePreview 
                    ? 'grid-cols-1 max-w-sm' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
                }`}>
                  {config.problemSection.painPoints.map((painPoint, i) => (
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
                            {painPoint.icon ? renderIcon(painPoint.icon, "h-5 w-5") : renderIcon(getDefaultIcon(i), "h-5 w-5")}
                          </div>
                          <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                            isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                          }`}>{painPoint.text}</CardTitle>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Solution Preview Section (NESB Framework) */}
        {isSectionVisible('solutionSection') && config.solutionSection && (config.solutionSection.title || config.solutionSection.subtitle || (config.solutionSection.benefits && config.solutionSection.benefits.length > 0)) && (
          <section className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.muted}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.solutionSection.title || "The Solution"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.solutionSection.subtitle || "Here's how we solve your problems"}
                  </p>
                </div>
              </div>
              {config.solutionSection.benefits && config.solutionSection.benefits.length > 0 && (
                <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                  isMobilePreview 
                    ? 'grid-cols-1 max-w-sm' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
                }`}>
                  {config.solutionSection.benefits.map((benefit, i) => (
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
                            {benefit.icon ? renderIcon(benefit.icon, "h-5 w-5") : renderIcon(getDefaultIcon(i), "h-5 w-5")}
                          </div>
                          <div className="flex items-center gap-2">
                            <CardTitle className={`${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                              isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                            }`}>{benefit.title}</CardTitle>
                            {benefit.type && (
                              <Badge 
                                variant="secondary" 
                                className="text-xs"
                                style={{ 
                                  backgroundColor: getAccentColor(theme.accentColor, 0.1),
                                  color: theme.accentColor
                                }}
                              >
                                {benefit.type.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardDescription className={`${themeClasses.textSecondary} ${
                          isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                        }`}>
                          {benefit.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Social Proof Section */}
        {isSectionVisible('socialProof') && config.socialProof && (config.socialProof.title || config.socialProof.subtitle || (config.socialProof.testimonials && config.socialProof.testimonials.length > 0) || (config.socialProof.stats && config.socialProof.stats.length > 0)) && (
          <section className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.background}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.socialProof.title || "What Our Customers Say"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.socialProof.subtitle || "Join thousands of satisfied customers"}
                  </p>
                </div>
              </div>
              
              {/* Stats */}
              {config.socialProof.stats && config.socialProof.stats.length > 0 && (
                <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                  isMobilePreview 
                    ? 'grid-cols-1 max-w-sm' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
                }`}>
                  {config.socialProof.stats.map((stat, i) => (
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
              {config.socialProof.testimonials && config.socialProof.testimonials.length > 0 && (
                <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                  isMobilePreview 
                    ? 'grid-cols-1 max-w-sm' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
                }`}>
                  {config.socialProof.testimonials.map((testimonial, i) => (
                    <Card key={i} className={`h-full ${themeClasses.surface} ${themeClasses.border} transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-opacity-80`}>
                      <CardHeader className="pb-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-1">
                            {[...Array(testimonial.rating || 5)].map((_, starIndex) => (
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
        )}

        {/* Features Section */}
        {isSectionVisible('features') && (
          <section id="features" className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.muted}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
              <div className="space-y-3 sm:space-y-4">
                <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                  isMobilePreview 
                    ? 'text-xl' 
                    : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                }`}>{config.featuresTitle || "Powerful Features"}</h2>
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
              {features.map((feature, i) => (
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
        )}

        {/* Risk Reversal Section */}
        {isSectionVisible('guarantees') && config.guarantees && (config.guarantees.title || config.guarantees.subtitle || (config.guarantees.guarantees && config.guarantees.guarantees.length > 0)) && (
          <section className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.background}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.guarantees.title || "Our Guarantees"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.guarantees.subtitle || "We're confident you'll love our solution"}
                  </p>
                </div>
              </div>
              {config.guarantees.guarantees && config.guarantees.guarantees.length > 0 && (
                <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
                  isMobilePreview 
                    ? 'grid-cols-1 max-w-sm' 
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
                }`}>
                  {config.guarantees.guarantees.map((guarantee, i) => (
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
        )}

        {/* FAQ Section */}
        {isSectionVisible('faq') && config.faq && (config.faq.title || config.faq.subtitle || (config.faq.questions && config.faq.questions.length > 0)) && (
          <section className={`w-full py-8 sm:py-12 md:py-16 lg:py-24 ${themeClasses.muted}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>{config.faq.title || "Frequently Asked Questions"}</h2>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                  }`}>
                    {config.faq.subtitle || "Everything you need to know"}
                  </p>
                </div>
              </div>
              {config.faq.questions && config.faq.questions.length > 0 && (
                <div className={`mx-auto max-w-4xl py-8 sm:py-12 space-y-4 sm:space-y-6`}>
                  {config.faq.questions.map((faq, i) => (
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
        )}

        {/* CTA Section with Lead Form */}
        {isSectionVisible('cta') && pageId && (
          <section 
            id="cta-section" 
            className="w-full py-8 sm:py-12 md:py-16 lg:py-24"
            style={{ backgroundColor: getAccentColor(theme.accentColor, 0.9) }}
          >
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
                    <LeadForm pageId={pageId} theme={theme} />
                  </div>
                  <p className={`${themeClasses.textSecondary} ${
                    isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
                  }`}>Start your free trial. No credit card required.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className={`flex flex-col gap-3 sm:gap-2 py-4 sm:py-6 w-full shrink-0 items-center px-4 sm:px-6 lg:px-8 border-t ${themeClasses.border} ${themeClasses.background}`}>
        <p className={`${themeClasses.textSecondary} text-center ${
          isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
        }`}>© 2024 {business?.name || 'LaunchGen'} AI. All rights reserved.</p>
        <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:ml-auto items-center">
          <div className="flex gap-3 sm:gap-4">
            <Link className={`hover:underline underline-offset-4 ${themeClasses.textSecondary} hover:${themeClasses.text} ${
              isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
            }`} href="#">
              Terms of Service
            </Link>
            <Link className={`hover:underline underline-offset-4 ${themeClasses.textSecondary} hover:${themeClasses.text} ${
              isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
            }`} href="#">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-2">
            <Link href="#" className={`${themeClasses.textSecondary} hover:${themeClasses.text}`}>
              <Github className="h-4 w-4" />
            </Link>
            <Link href="#" className={`${themeClasses.textSecondary} hover:${themeClasses.text}`}>
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className={`${themeClasses.textSecondary} hover:${themeClasses.text}`}>
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
} 