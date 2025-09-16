"use client";
import React from "react";
import HeroSection from "./sections/HeroSection";
import ProblemSection from "./sections/ProblemSection";
import FeaturesSection from "./sections/FeaturesSection";
import SocialProofSection from "./sections/SocialProofSection";
import PricingSection from "./sections/PricingSection";
import GuaranteesSection from "./sections/GuaranteesSection";
import FAQSection from "./sections/FAQSection";
import CTASection from "./sections/CTASection";
import { LandingPageConfig, Theme, SectionName } from "@/types/landing-page.types";
import { PreviewMode } from "@/types/common.types";

interface SectionRendererProps {
  config: LandingPageConfig;
  theme: Theme;
  pageId?: string;
  previewMode?: PreviewMode;
  visibleSections?: Record<string, boolean>;
  onSectionSelect?: (sectionId: string) => void;
}

export default function SectionRenderer({
  config,
  theme,
  pageId,
  previewMode = 'desktop',
  visibleSections,
  onSectionSelect
}: SectionRendererProps) {
  // Helper function to check if a section should be visible
  const isSectionVisible = (sectionName: string): boolean => {
    if (!visibleSections) return true; // Default to visible if no visibility config
    return visibleSections[sectionName] !== false; // Show if not explicitly hidden
  };

  // Render sections based on sectionOrder or default order
  // Handle both old format (config.sectionOrder) and new format (config.page_content.sectionOrder)
  let sectionOrder = config.sectionOrder || (config as any).page_content?.sectionOrder || [
    'problemSection', 
    'features',
    'socialProof',
    'pricing',
    'guarantees',
    'faq',
    'cta'
  ];

  // Debug theme changes in SectionRenderer  
  React.useEffect(() => {
    console.log('SectionRenderer - Theme changed:', theme);
  }, [theme]);

  // Debug config and section order
  React.useEffect(() => {
    console.log('🔍 SectionRenderer - Full config:', config);
    console.log('🔍 SectionRenderer - Config sectionOrder:', config.sectionOrder);
    console.log('🔍 SectionRenderer - Page content sectionOrder:', (config as any).page_content?.sectionOrder);
    console.log('🔍 SectionRenderer - Final section order:', sectionOrder);
    console.log('🔍 SectionRenderer - Pricing config:', pageContent.pricing);
    console.log('🔍 SectionRenderer - Visible sections:', visibleSections);
    console.log('🔍 SectionRenderer - Is pricing visible?', isSectionVisible('pricing'));
    console.log('🔍 SectionRenderer - Pricing in section order?', sectionOrder.includes('pricing'));
  }, [config, sectionOrder, visibleSections]);

  // Get the actual page content from the config
  const pageContent = (config as any).page_content || config;
  
  // Always render hero first, then the rest of the sections in the specified order
  const finalSectionOrder = ['hero', ...sectionOrder];
  

  const renderSection = (sectionId: SectionName) => {
    switch (sectionId) {
      case 'hero':
        return (
          <div className={isSectionVisible('hero') ? 'block' : 'hidden'}>
            <HeroSection
              key="hero"
              hero={pageContent.hero}
              theme={theme}
              pageId={pageId}
              previewMode={previewMode}
              onSectionSelect={onSectionSelect}
            />
          </div>
        );

      case 'problemSection':
        return isSectionVisible('problemSection') && pageContent.problemSection ? (
          <ProblemSection
            key="problemSection"
            problemSection={pageContent.problemSection}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'features':
        return isSectionVisible('features') ? (
          <FeaturesSection
            key="features"
            features={pageContent.features}
            featuresTitle={pageContent.featuresTitle}
            featuresSubtitle={pageContent.featuresSubtitle}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'socialProof':
        return isSectionVisible('socialProof') && pageContent.socialProof ? (
          <SocialProofSection
            key="socialProof"
            socialProof={pageContent.socialProof}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'pricing':
        console.log('🔍 PRICING SECTION RENDER CHECK:', {
          sectionId: 'pricing',
          isVisible: isSectionVisible('pricing'),
          hasConfig: !!pageContent.pricing,
          configPricing: pageContent.pricing,
          title: pageContent.pricing?.title || "Simple Pricing",
          description: pageContent.pricing?.description || "Choose the plan that's right for you",
          plans: pageContent.pricing?.plans || [],
          plansLength: (pageContent.pricing?.plans || []).length,
          theme: theme
        });
        
        // Always show pricing section, even with fallback data
        const pricingElement = isSectionVisible('pricing') ? (
          <PricingSection
            key="pricing"
            title={pageContent.pricing?.title || "Simple Pricing"}
            description={pageContent.pricing?.description || "Choose the plan that's right for you"}
            plans={pageContent.pricing?.plans || []}
            theme={theme}
            isMobilePreview={previewMode === 'mobile'}
            onSectionSelect={onSectionSelect}
          />
        ) : null;
        
        console.log('🔍 PRICING SECTION RENDERED:', pricingElement ? 'YES' : 'NO');
        return pricingElement;

      case 'guarantees':
        return isSectionVisible('guarantees') && pageContent.guarantees ? (
          <GuaranteesSection
            key="guarantees"
            guarantees={pageContent.guarantees}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'faq':
        return isSectionVisible('faq') && pageContent.faq ? (
          <FAQSection
            key="faq"
            faq={pageContent.faq}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'cta':
        return isSectionVisible('cta') ? (
          <CTASection
            key="cta"
            ctaTitle={pageContent.ctaTitle}
            ctaSubtitle={pageContent.ctaSubtitle}
            theme={theme}
            pageId={pageId}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <>
      {finalSectionOrder.map((sectionId, index) => (
        <React.Fragment key={`${sectionId}-${index}`}>
          {renderSection(sectionId as SectionName)}
        </React.Fragment>
      ))}
    </>
  );
}