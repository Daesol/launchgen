/**
 * Validation and Fallback Utilities
 * 
 * Contains validation logic and fallback configurations for landing page generation.
 * These utilities ensure that generated configurations always have valid, complete data.
 */

import { LandingPageConfig } from "../landingPageSchema";

/**
 * Validates the basic structure of a landing page configuration
 * @param config - The configuration to validate
 * @throws Error if validation fails
 */
export function validateConfigStructure(config: any): void {
  if (!config.hero || typeof config.hero !== 'object') {
    throw new Error("Config missing 'hero' section");
  }
  if (!config.features || !Array.isArray(config.features) || config.features.length === 0) {
    throw new Error("Config missing 'features' array");
  }
  const theme = config.theme || config.themeColors || config.theme_colors;
  if (!theme || typeof theme !== 'object') {
    throw new Error("Config missing 'theme' or 'themeColors' section");
  }
  if (!config.hero.headline || !config.hero.subheadline || !(config.hero.cta || config.hero.ctaText)) {
    throw new Error("Config 'hero' section missing required fields");
  }
}

/**
 * Creates a fallback configuration for new generations when AI fails
 * @returns A complete fallback configuration
 */
export function createFallbackConfig(): LandingPageConfig {
  return {
    business: { name: "LaunchGen", logo: "" },
    hero: {
      headline: "AI-Powered Landing Page Generator",
      headlineHighlights: ["AI-Powered"] as string[],
      subheadline: "Create high-converting landing pages in minutes with AI.",
      cta: "Get Started",
      heroTag: "AI-Powered",
      heroTagIcon: "sparkles",
      backgroundImage: ""
    },
    problemSection: {
      title: "The Problem",
      subtitle: "Are you struggling with these common challenges?",
      painPoints: []
    },
    socialProof: {
      title: "What Our Customers Say",
      subtitle: "Join thousands of satisfied customers",
      testimonials: [],
      stats: [
        { number: "10,000+", label: "Happy Customers", description: "Trusted by businesses worldwide" },
        { number: "95%", label: "Success Rate", description: "Average customer satisfaction" },
        { number: "$50K", label: "Revenue Increase", description: "Average monthly growth" }
      ]
    },
    features: [
      { title: "AI-Powered Generation", description: "Generate landing pages with AI.", icon: "", benefit: "Save time and effort." }
    ],
    featuresTitle: "Powerful Features",
    featuresSubtitle: "Everything you need to build, deploy, and scale your applications with confidence.",
    guarantees: {
      title: "Our Guarantees",
      subtitle: "We're confident you'll love our solution",
      guarantees: []
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know",
      questions: []
    },
    ctaTitle: "Ready to Get Started?",
    ctaSubtitle: "Join thousands of users who are already building amazing things with our platform.",
    urgency: {
      enabled: false,
      message: "Limited Time Offer",
      deadline: "Ends in 24 hours"
    },
    theme: {
      mode: "white",
      accentColor: "#6366f1"
    },
    sectionOrder: [
      "problemSection",
      "features", 
      "socialProof",
      "guarantees",
      "faq",
      "cta"
    ],
    analytics: {
      googleAnalyticsId: "",
      facebookPixelId: ""
    }
  };
}

/**
 * Applies fallback values to ensure all required fields are present and valid
 * @param config - The configuration to apply fallbacks to
 * @returns The configuration with all fallbacks applied
 */
export function applyFallbacks(config: any): LandingPageConfig {
  // Business fallbacks
  if (!config.business || !config.business.name || config.business.name.trim() === "") {
    if (!config.business) config.business = {};
    config.business.name = "LaunchGen";
  }
  if (!config.business.logo) {
    config.business.logo = "";
  }

  // Hero fallbacks
  if (!config.hero.headlineHighlights || !Array.isArray(config.hero.headlineHighlights)) {
    config.hero.headlineHighlights = [];
  }
  if (!config.hero.heroTag || config.hero.heroTag.trim() === "") {
    config.hero.heroTag = "AI-Powered Solution";
  }
  const validIcons = ["zap", "star", "shield", "rocket", "target", "trendingUp", "award", "sparkles"];
  if (!config.hero.heroTagIcon || !validIcons.includes(config.hero.heroTagIcon) || config.hero.heroTagIcon.trim() === "") {
    config.hero.heroTagIcon = "sparkles";
  }
  if (!config.hero.cta && config.hero.ctaText) {
    config.hero.cta = config.hero.ctaText;
  }

  // Problem Section fallbacks
  if (!config.problemSection) {
    config.problemSection = {
      title: "The Problem",
      subtitle: "Are you struggling with these common challenges?",
      painPoints: []
    };
  }
  if (!config.problemSection.painPoints || !Array.isArray(config.problemSection.painPoints)) {
    config.problemSection.painPoints = [];
  }

  // Social Proof fallbacks
  if (!config.socialProof) {
    config.socialProof = {
      title: "What Our Customers Say",
      subtitle: "Join thousands of satisfied customers",
      testimonials: [],
      stats: [
        { number: "10,000+", label: "Happy Customers", description: "Trusted by businesses worldwide" },
        { number: "95%", label: "Success Rate", description: "Average customer satisfaction" },
        { number: "$50K", label: "Revenue Increase", description: "Average monthly growth" }
      ]
    };
  }
  if (!config.socialProof.testimonials || !Array.isArray(config.socialProof.testimonials)) {
    config.socialProof.testimonials = [];
  }
  if (!config.socialProof.stats || !Array.isArray(config.socialProof.stats) || config.socialProof.stats.length === 0) {
    config.socialProof.stats = [
      { number: "10,000+", label: "Happy Customers", description: "Trusted by businesses worldwide" },
      { number: "95%", label: "Success Rate", description: "Average customer satisfaction" },
      { number: "$50K", label: "Revenue Increase", description: "Average monthly growth" }
    ];
  }

  // Features fallbacks
  if (!config.featuresTitle || config.featuresTitle.trim() === "") {
    config.featuresTitle = "Powerful Features";
  }
  if (!config.featuresSubtitle || config.featuresSubtitle.trim() === "") {
    config.featuresSubtitle = "Everything you need to build, deploy, and scale your applications with confidence.";
  }
  if (!config.features || !Array.isArray(config.features)) {
    config.features = [];
  }

  // Guarantees fallbacks
  if (!config.guarantees) {
    config.guarantees = {
      title: "Our Guarantees",
      subtitle: "We're confident you'll love our solution",
      guarantees: []
    };
  }
  if (!config.guarantees.guarantees || !Array.isArray(config.guarantees.guarantees)) {
    config.guarantees.guarantees = [];
  }

  // FAQ fallbacks
  if (!config.faq) {
    config.faq = {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know",
      questions: []
    };
  }
  if (!config.faq.questions || !Array.isArray(config.faq.questions)) {
    config.faq.questions = [];
  }

  // CTA fallbacks
  if (!config.ctaTitle || config.ctaTitle.trim() === "") {
    config.ctaTitle = "Ready to Get Started?";
  }
  if (!config.ctaSubtitle || config.ctaSubtitle.trim() === "") {
    config.ctaSubtitle = "Join thousands of users who are already building amazing things with our platform.";
  }

  // Urgency fallbacks
  if (!config.urgency) {
    config.urgency = {
      enabled: false,
      message: "Limited Time Offer",
      deadline: "Ends in 24 hours"
    };
  }

  // Theme fallbacks
  if (!config.theme) {
    config.theme = {
      mode: "white",
      accentColor: "#6366f1"
    };
  }
  if (!config.theme.mode || config.theme.mode.trim() === "") {
    config.theme.mode = "white";
  }
  if (!config.theme.accentColor || config.theme.accentColor.trim() === "") {
    config.theme.accentColor = "#6366f1";
  }

  return config;
}
