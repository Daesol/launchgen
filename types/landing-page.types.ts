// Landing Page Domain Types
export interface Business {
  name?: string;
  logo?: string;
}

export interface Hero {
  headline: string;
  headlineHighlights?: string[];
  subheadline: string;
  cta: string;
  backgroundImage?: string;
  heroTag?: string;
  heroTagIcon?: string;
}

export interface PainPoint {
  text: string;
  icon?: string;
}

export interface ProblemSection {
  title?: string;
  subtitle?: string;
  painPoints?: PainPoint[];
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating?: number;
  result?: string;
}

export interface Stat {
  number: string;
  label: string;
  description: string;
}

export interface SocialProof {
  title?: string;
  subtitle?: string;
  testimonials?: Testimonial[];
  stats?: Stat[];
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
  benefit?: string;
}

export interface Guarantee {
  title: string;
  description: string;
  icon?: string;
}

export interface Guarantees {
  title?: string;
  subtitle?: string;
  guarantees?: Guarantee[];
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface FAQSection {
  title?: string;
  subtitle?: string;
  questions?: FAQ[];
}

export interface Urgency {
  enabled?: boolean;
  message?: string;
  deadline?: string;
}

export interface Theme {
  mode: "white" | "black";
  accentColor: string;
}

export interface ThemeColors {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface LandingPageConfig {
  business?: Business;
  hero: Hero;
  problemSection?: ProblemSection;
  socialProof?: SocialProof;
  features: Feature[];
  featuresTitle?: string;
  featuresSubtitle?: string;
  guarantees?: Guarantees;
  faq?: FAQSection;
  ctaTitle?: string;
  ctaSubtitle?: string;
  urgency?: Urgency;
  theme?: Theme;
  sectionOrder?: string[];
  // Legacy support
  themeColors?: ThemeColors;
}

export interface LandingPageTemplateProps {
  config: LandingPageConfig;
  pageId?: string;
  previewMode?: 'desktop' | 'mobile';
  visibleSections?: Record<string, boolean>;
  onSectionSelect?: (sectionId: string) => void;
}

export type SectionName = 
  | 'hero'
  | 'problemSection'
  | 'features'
  | 'socialProof'
  | 'guarantees'
  | 'faq'
  | 'cta';