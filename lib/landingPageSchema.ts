// Landing page schema and type
export const landingPageSchema = {
  business: {
    name: "",
    logo: ""
  },
  hero: {
    headline: "",
    headlineHighlights: [] as string[], // Array of words/phrases to highlight
    subheadline: "",
    cta: "",
    heroTag: "",
    heroTagIcon: "",
    backgroundImage: "",
    media: {
      enabled: false,
      type: "image" as "image" | "video" | "youtube" | "vimeo",
      url: "",
      file: "",
      altText: "",
      thumbnail: ""
    }
  },
  // Problem Amplification Section
  problemSection: {
    title: "",
    subtitle: "",
    painPoints: [
      { text: "", icon: "" }
    ]
  },
  // Social Proof Section
  socialProof: {
    title: "",
    subtitle: "",
    testimonials: [
      { 
        name: "", 
        role: "", 
        company: "",
        quote: "", 
        rating: 5,
        result: "" // Specific result/outcome
      }
    ],
    stats: [
      { number: "", label: "", description: "" }
    ]
  },
  features: [
    { title: "", description: "", icon: "", benefit: "" } // Added benefit field
  ],
  featuresTitle: "",
  featuresSubtitle: "",
  // Risk Reversal Section
  guarantees: {
    title: "",
    subtitle: "",
    guarantees: [
    { title: "", description: "", icon: "" }
    ]
  },
  // FAQ Section
  faq: {
    title: "",
    subtitle: "",
    questions: [
      { question: "", answer: "" }
    ]
  },
  // Pricing Section
  pricing: {
    title: "",
    description: "",
    plans: [
      {
        id: "",
        name: "",
        price: "",
        period: "",
        description: "",
        features: [""],
        popular: false,
        ctaText: "",
        ctaLink: ""
      }
    ]
  },
  ctaTitle: "",
  ctaSubtitle: "",
  // Urgency/Scarcity elements
  urgency: {
    enabled: false,
    message: "",
    deadline: ""
  },
  theme: {
    mode: "white", // "white" for light mode, "black" for dark mode
    accentColor: "#6366f1" // Single accent color for buttons, icons, etc.
  },
  // Section order for drag-and-drop functionality
  sectionOrder: [
    "problemSection",
    "features", 
    "socialProof",
    "pricing",
    "guarantees",
    "faq",
    "cta"
  ],
  analytics: {
    googleAnalyticsId: "",
    facebookPixelId: ""
  }
};

export type LandingPageConfig = typeof landingPageSchema;

export function getSchemaString() {
  return JSON.stringify(landingPageSchema, null, 2);
} 