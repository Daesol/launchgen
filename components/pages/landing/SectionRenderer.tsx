"use client";
import React from "react";
import HeroSection from "./sections/HeroSection";
import ProblemSection from "./sections/ProblemSection";
import FeaturesSection from "./sections/FeaturesSection";
import SocialProofSection from "./sections/SocialProofSection";
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
  let sectionOrder = config.sectionOrder || [
    'problemSection', 
    'features',
    'socialProof',
    'guarantees',
    'faq',
    'cta'
  ];

  // Debug theme changes in SectionRenderer  
  React.useEffect(() => {
    console.log('SectionRenderer - Theme changed:', theme);
  }, [theme]);

  // Always render hero first, then the rest of the sections in the specified order
  const finalSectionOrder = ['hero', ...sectionOrder];

  const renderSection = (sectionId: SectionName) => {
    switch (sectionId) {
      case 'hero':
        return (
          <div className={isSectionVisible('hero') ? 'block' : 'hidden'}>
            <HeroSection
              key="hero"
              hero={config.hero}
              theme={theme}
              pageId={pageId}
              previewMode={previewMode}
              onSectionSelect={onSectionSelect}
            />
          </div>
        );

      case 'problemSection':
        return isSectionVisible('problemSection') && config.problemSection ? (
          <ProblemSection
            key="problemSection"
            problemSection={config.problemSection}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'features':
        return isSectionVisible('features') ? (
          <FeaturesSection
            key="features"
            features={config.features}
            featuresTitle={config.featuresTitle}
            featuresSubtitle={config.featuresSubtitle}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'socialProof':
        return isSectionVisible('socialProof') && config.socialProof ? (
          <SocialProofSection
            key="socialProof"
            socialProof={config.socialProof}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'guarantees':
        return isSectionVisible('guarantees') && config.guarantees ? (
          <GuaranteesSection
            key="guarantees"
            guarantees={config.guarantees}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'faq':
        return isSectionVisible('faq') && config.faq ? (
          <FAQSection
            key="faq"
            faq={config.faq}
            theme={theme}
            previewMode={previewMode}
            onSectionSelect={onSectionSelect}
          />
        ) : null;

      case 'cta':
        return isSectionVisible('cta') ? (
          <CTASection
            key="cta"
            ctaTitle={config.ctaTitle}
            ctaSubtitle={config.ctaSubtitle}
            urgency={config.urgency}
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