"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, Menu, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import LeadForm from "./LeadForm";

interface LandingPageTemplateProps {
  config: {
    hero: {
      headline: string;
      subheadline: string;
      cta: string;
      backgroundImage?: string;
    };
    features: Array<{ title: string; description: string; icon?: string }>;
    themeColors: {
      primaryColor: string;
      secondaryColor: string;
      accentColor: string;
    };
  };
  pageId?: string;
  previewMode?: 'desktop' | 'mobile';
}

export default function LandingPageTemplate({ config, pageId, previewMode = 'desktop' }: LandingPageTemplateProps) {
  if (!config || !config.hero || !config.features || !config.themeColors) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg font-semibold">
        Invalid or incomplete config. Please try again.
      </div>
    );
  }
  
  const { hero, features, themeColors } = config;

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 sm:px-6 lg:px-8 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="#">
          <div 
            className="h-8 w-8 rounded-md flex items-center justify-center"
            style={{ background: themeColors.primaryColor }}
          >
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="ml-2 text-base sm:text-lg font-semibold">LaunchGen</span>
        </Link>
        <nav className="ml-auto hidden md:flex gap-4 lg:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#contact">
            Contact
          </Link>
        </nav>
        <Button variant="ghost" size="sm" className="ml-4 md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 lg:py-24 xl:py-32">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center space-y-6 sm:space-y-8 text-center">
              <div className="space-y-4 sm:space-y-6">
                <Badge variant="secondary" className="mb-4 sm:mb-6">
                  AI-Powered Solution
                </Badge>
                <h1 className={`font-bold tracking-tighter leading-tight ${
                  isMobilePreview 
                    ? 'text-2xl' 
                    : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl'
                }`}>
                  {hero.headline}
                </h1>
                <p className={`mx-auto text-muted-foreground ${
                  isMobilePreview 
                    ? 'text-sm max-w-[300px]' 
                    : 'text-base sm:text-lg md:text-xl max-w-[600px] sm:max-w-[700px] px-4 sm:px-0'
                }`}>
                  {hero.subheadline}
                </p>
              </div>
              <Button 
                size="lg" 
                onClick={scrollToCTA} 
                className={`${
                  isMobilePreview 
                    ? 'w-full px-4 py-2 text-sm' 
                    : 'w-full sm:w-auto px-8 py-3 text-base sm:text-lg'
                }`}
              >
                {hero.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-muted">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6 text-center">
              <div className="space-y-3 sm:space-y-4">
                <h2 className={`font-bold tracking-tighter ${
                  isMobilePreview 
                    ? 'text-xl' 
                    : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                }`}>Powerful Features</h2>
                <p className={`text-muted-foreground ${
                  isMobilePreview 
                    ? 'text-xs max-w-[280px]' 
                    : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[800px] sm:max-w-[900px] px-4 sm:px-0'
                }`}>
                  Everything you need to build, deploy, and scale your applications with confidence.
                </p>
              </div>
            </div>
            <div className={`mx-auto grid items-center gap-4 sm:gap-6 lg:gap-8 py-8 sm:py-12 ${
              isMobilePreview 
                ? 'grid-cols-1 max-w-sm' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl'
            }`}>
              {features.map((feature, i) => (
                <Card key={i} className="h-full">
                  <CardHeader className="pb-4">
                    <CardTitle className={`${
                      isMobilePreview ? 'text-base' : 'text-lg sm:text-xl'
                    }`}>{feature.title}</CardTitle>
                    <CardDescription className={`${
                      isMobilePreview ? 'text-xs' : 'text-sm sm:text-base'
                    }`}>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className={`${
                        isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
                      }`}>Feature included</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section with Lead Form */}
        {pageId && (
          <section id="cta-section" className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-primary">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8 text-center">
                <div className="space-y-3 sm:space-y-4">
                  <h2 className={`font-bold tracking-tighter text-primary-foreground ${
                    isMobilePreview 
                      ? 'text-xl' 
                      : 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl'
                  }`}>
                    Ready to Get Started?
                  </h2>
                  <p className={`mx-auto text-primary-foreground/80 ${
                    isMobilePreview 
                      ? 'text-xs max-w-[280px]' 
                      : 'text-sm sm:text-base md:text-lg lg:text-xl max-w-[500px] sm:max-w-[600px] px-4 sm:px-0'
                  }`}>
                    Join thousands of users who are already building amazing things with our platform.
                  </p>
                </div>
                <div className={`w-full space-y-3 sm:space-y-4 ${
                  isMobilePreview ? 'max-w-xs' : 'max-w-sm sm:max-w-md'
                }`}>
                  <div className="bg-white rounded-lg p-4 sm:p-6">
                    <LeadForm pageId={pageId} />
                  </div>
                  <p className={`text-primary-foreground/60 ${
                    isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
                  }`}>Start your free trial. No credit card required.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-3 sm:gap-2 py-4 sm:py-6 w-full shrink-0 items-center px-4 sm:px-6 lg:px-8 border-t">
        <p className={`text-muted-foreground text-center ${
          isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
        }`}>© 2024 LaunchGen AI. All rights reserved.</p>
        <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:ml-auto items-center">
          <div className="flex gap-3 sm:gap-4">
            <Link className={`hover:underline underline-offset-4 ${
              isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
            }`} href="#">
              Terms of Service
            </Link>
            <Link className={`hover:underline underline-offset-4 ${
              isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'
            }`} href="#">
              Privacy Policy
            </Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-2">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </footer>
    </div>
  );
} 