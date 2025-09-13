// Field handling utilities for the editor system

import { PageContent } from '../types/editor.types';
import { cleanupHighlights } from '@/lib/textHighlightUtils';

// Type for field change handlers
export type FieldChangeHandler = (fieldPath: string, value: any) => void;

// Type for array item change handlers
export type ArrayItemChangeHandler = (index: number, value: any) => void;

// Type for array item add/remove handlers
export type ArrayItemAddHandler = () => void;
export type ArrayItemRemoveHandler = (index: number) => void;

// Business section handlers
export const createBusinessHandlers = (
  pageContent: PageContent,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleBusinessChange: (field: string, value: string) => {
    onPageContentChange(`business.${field}`, value);
  },
});

// Hero section handlers
export const createHeroHandlers = (
  pageContent: PageContent,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleHeroChange: (field: string, value: string) => {
    onPageContentChange(`hero.${field}`, value);
    
    // If headline is changing, clean up highlights that no longer exist in the new headline
    if (field === 'headline') {
      const currentHighlights = pageContent?.hero?.headlineHighlights || [];
      const cleanedHighlights = cleanupHighlights(currentHighlights, value);
      
      // Only update if there are invalid highlights to remove
      if (cleanedHighlights.length !== currentHighlights.length) {
        onPageContentChange('hero.headlineHighlights', cleanedHighlights);
      }
    }
  },
  handleHighlightToggle: (word: string) => {
    const currentHighlights = pageContent?.hero?.headlineHighlights || [];
    const newHighlights = currentHighlights.includes(word)
      ? currentHighlights.filter((w: string) => w !== word)
      : [...currentHighlights, word];
    
    onPageContentChange('hero.headlineHighlights', newHighlights);
  },
});

// Problem section handlers
export const createProblemHandlers = (
  pageContent: any,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleProblemChange: (field: string, value: any) => {
    onPageContentChange(`problemSection.${field}`, value);
  },
  handlePainPointChange: (idx: number, field: string, value: any) => {
    const currentPainPoints = pageContent?.problemSection?.painPoints || [];
    const newPainPoints = currentPainPoints.map((point: any, i: number) => 
      i === idx ? { ...point, [field]: value } : point
    );
    onPageContentChange('problemSection.painPoints', newPainPoints);
  },
  handleAddPainPoint: () => {
    const currentPainPoints = pageContent?.problemSection?.painPoints || [];
    const newPainPoints = [...currentPainPoints, { icon: 'clock', text: '' }];
    onPageContentChange('problemSection.painPoints', newPainPoints);
  },
  handleRemovePainPoint: (idx: number) => {
    const currentPainPoints = pageContent?.problemSection?.painPoints || [];
    const newPainPoints = currentPainPoints.filter((_: any, i: number) => i !== idx);
    onPageContentChange('problemSection.painPoints', newPainPoints);
  },
});

// Features section handlers
export const createFeaturesHandlers = (
  pageContent: any,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleFeaturesChange: (field: string, value: string) => {
    onPageContentChange(`features.${field}`, value);
  },
  handleFeatureChange: (idx: number, field: string, value: string) => {
    const currentFeatures = pageContent?.features || [];
    const newFeatures = currentFeatures.map((feature: any, i: number) => 
      i === idx ? { ...feature, [field]: value } : feature
    );
    onPageContentChange('features', newFeatures);
  },
  handleAddFeature: () => {
    const currentFeatures = pageContent?.features || [];
    const newFeatures = [...currentFeatures, {
      title: '',
      description: '',
      icon: 'star',
      benefit: ''
    }];
    onPageContentChange('features', newFeatures);
  },
  handleRemoveFeature: (idx: number) => {
    const currentFeatures = pageContent?.features || [];
    const newFeatures = currentFeatures.filter((_: any, i: number) => i !== idx);
    onPageContentChange('features', newFeatures);
  },
});

// Social proof section handlers
export const createSocialProofHandlers = (
  pageContent: any,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleSocialProofChange: (field: string, value: any) => {
    onPageContentChange(`socialProof.${field}`, value);
  },
  handleTestimonialChange: (idx: number, field: string, value: any) => {
    const currentTestimonials = pageContent?.socialProof?.testimonials || [];
    const newTestimonials = currentTestimonials.map((testimonial: any, i: number) => 
      i === idx ? { ...testimonial, [field]: value } : testimonial
    );
    onPageContentChange('socialProof.testimonials', newTestimonials);
  },
  handleStatChange: (idx: number, field: string, value: any) => {
    const currentStats = pageContent?.socialProof?.stats || [];
    const newStats = currentStats.map((stat: any, i: number) => 
      i === idx ? { ...stat, [field]: value } : stat
    );
    onPageContentChange('socialProof.stats', newStats);
  },
  handleAddTestimonial: () => {
    const currentTestimonials = pageContent?.socialProof?.testimonials || [];
    const newTestimonials = [...currentTestimonials, {
      name: '', role: '', company: '', quote: '', result: '', rating: 5
    }];
    onPageContentChange('socialProof.testimonials', newTestimonials);
  },
  handleAddStat: () => {
    const currentStats = pageContent?.socialProof?.stats || [];
    const newStats = [...currentStats, { number: '', label: '', description: '' }];
    onPageContentChange('socialProof.stats', newStats);
  },
  handleRemoveTestimonial: (idx: number) => {
    const currentTestimonials = pageContent?.socialProof?.testimonials || [];
    const newTestimonials = currentTestimonials.filter((_: any, i: number) => i !== idx);
    onPageContentChange('socialProof.testimonials', newTestimonials);
  },
  handleRemoveStat: (idx: number) => {
    const currentStats = pageContent?.socialProof?.stats || [];
    const newStats = currentStats.filter((_: any, i: number) => i !== idx);
    onPageContentChange('socialProof.stats', newStats);
  },
});

// Guarantees section handlers
export const createGuaranteesHandlers = (
  pageContent: any,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleGuaranteesChange: (field: string, value: any) => {
    onPageContentChange(`guarantees.${field}`, value);
  },
  handleGuaranteeChange: (idx: number, field: string, value: any) => {
    const currentGuarantees = pageContent?.guarantees?.guarantees || [];
    const newGuarantees = currentGuarantees.map((guarantee: any, i: number) => 
      i === idx ? { ...guarantee, [field]: value } : guarantee
    );
    onPageContentChange('guarantees.guarantees', newGuarantees);
  },
  handleAddGuarantee: () => {
    const currentGuarantees = pageContent?.guarantees?.guarantees || [];
    const newGuarantees = [...currentGuarantees, { title: '', description: '', icon: 'shield' }];
    onPageContentChange('guarantees.guarantees', newGuarantees);
  },
  handleRemoveGuarantee: (idx: number) => {
    const currentGuarantees = pageContent?.guarantees?.guarantees || [];
    const newGuarantees = currentGuarantees.filter((_: any, i: number) => i !== idx);
    onPageContentChange('guarantees.guarantees', newGuarantees);
  },
});

// FAQ section handlers
export const createFAQHandlers = (
  pageContent: any,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleFAQChange: (field: string, value: any) => {
    onPageContentChange(`faq.${field}`, value);
  },
  handleQAChange: (idx: number, field: string, value: any) => {
    const currentQuestions = pageContent?.faq?.questions || [];
    const newQuestions = currentQuestions.map((question: any, i: number) => 
      i === idx ? { ...question, [field]: value } : question
    );
    onPageContentChange('faq.questions', newQuestions);
  },
  handleAddQA: () => {
    const currentQuestions = pageContent?.faq?.questions || [];
    const newQuestions = [...currentQuestions, { question: '', answer: '' }];
    onPageContentChange('faq.questions', newQuestions);
  },
  handleRemoveQA: (idx: number) => {
    const currentQuestions = pageContent?.faq?.questions || [];
    const newQuestions = currentQuestions.filter((_: any, i: number) => i !== idx);
    onPageContentChange('faq.questions', newQuestions);
  },
});

// CTA section handlers
export const createCTAHandlers = (
  pageContent: PageContent,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleCTAChange: (field: string, value: any) => {
    onPageContentChange(`cta.${field}`, value);
  },
});

// Urgency section handlers
export const createUrgencyHandlers = (
  pageContent: PageContent,
  onPageContentChange: (field: string, value: any) => void
) => ({
  handleUrgencyChange: (field: string, value: any) => {
    onPageContentChange(`urgency.${field}`, value);
  },
});

// Theme handlers
export const createThemeHandlers = (
  onPageStyleChange: (field: string, value: any) => void
) => ({
  handleThemeChange: (field: string, value: string) => {
    onPageStyleChange(`theme.${field}`, value);
  },
});
