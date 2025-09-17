// Dashboard Constants
export const DASHBOARD_CONSTANTS = {
  // API Endpoints
  API: {
    LANDING_PAGES: '/api/landing-pages',
    ANALYTICS: '/api/analytics',
    LEADS: '/api/leads',
  },
  
  // UI Constants
  UI: {
    SIDEBAR_WIDTH: 'w-96',
    MOBILE_SIDEBAR_WIDTH: 'w-80',
    HEADER_HEIGHT: 'h-14',
    MOBILE_HEADER_HEIGHT: 'h-12',
  },
  
  // Colors
  COLORS: {
    PRIMARY: '#0A0A0A',
    SECONDARY: '#2D2D2D',
    NEUTRAL_800: '#1f2937',
    NEUTRAL_700: '#374151',
    NEUTRAL_600: '#4b5563',
    NEUTRAL_500: '#6b7280',
    NEUTRAL_400: '#9ca3af',
    NEUTRAL_300: '#d1d5db',
    WHITE: '#ffffff',
    BLACK: '#000000',
  },
  
  // Animation Durations
  ANIMATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
  },
  
  // Breakpoints
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  
  // Page Limits
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  // Chatbot
  CHATBOT: {
    WEBHOOK_URL: 'https://hook.us2.make.com/dr7nyyotheprkpszho9koo288wblvogc',
  },
  
  // Event Names
  EVENTS: {
    PAGE_REFRESH: 'refresh-pages',
    TITLE_UPDATE: 'update-page-title',
    TITLE_SYNC: 'sync-page-title',
    PREVIEW_MODE_CHANGE: 'set-preview-mode',
  },
} as const;

// Theme Constants
export const THEME_CONSTANTS = {
  MODES: {
    LIGHT: 'light',
    DARK: 'dark',
    BLACK: 'black',
  },
  
  COLORS: {
    ACCENT: '#3b82f6',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
  },
} as const;

// Analytics Constants
export const ANALYTICS_CONSTANTS = {
  METRICS: {
    VIEWS: 'views',
    LEADS: 'leads',
    CONVERSION: 'conversion',
    SUBMITS: 'submits',
  },
  
  CHART: {
    COLORS: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    DEFAULT_HEIGHT: 300,
  },
} as const;

// Editor Constants
export const EDITOR_CONSTANTS = {
  PREVIEW_MODES: {
    DESKTOP: 'desktop',
    MOBILE: 'mobile',
  },
  
  PANEL_VIEWS: {
    MAIN: 'main',
    SECTION: 'section',
    THEME: 'theme',
    LAYOUT: 'layout',
  },
  
  SECTIONS: {
    HERO: 'hero',
    PROBLEM: 'problem',
    FEATURES: 'features',
    SOCIAL_PROOF: 'social_proof',
    GUARANTEES: 'guarantees',
    FAQ: 'faq',
    CTA: 'cta',
    FINAL_CTA: 'final_cta',
  },
} as const;
