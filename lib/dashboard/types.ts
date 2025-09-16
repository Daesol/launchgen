// Comprehensive Dashboard Types

// Base Types
export interface BaseEntity {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// User Types
export interface User extends BaseEntity {
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    provider?: string;
  };
}

// Page Types
export interface LandingPage extends BaseEntity {
  title: string;
  description?: string;
  slug: string;
  published: boolean;
  template_id: string;
  page_content: PageContent;
  page_style: PageStyle;
  user_id: string;
}

export interface PageContent {
  hero: HeroSection;
  problem?: ProblemSection;
  features?: FeaturesSection;
  social_proof?: SocialProofSection;
  guarantees?: GuaranteesSection;
  faq?: FAQSection;
  cta?: CTASection;
  final_cta?: FinalCTASection;
  sectionOrder: string[];
  analytics: AnalyticsConfig;
}

export interface PageStyle {
  theme: Theme;
  colors: ColorScheme;
  typography: Typography;
  spacing: Spacing;
}

// Section Types
export interface HeroSection {
  headline: string;
  headlineHighlights: string[];
  subheadline: string;
  heroTag: string;
  heroTagIcon: string;
  ctaText: string;
  ctaLink: string;
  heroImage?: string;
}

export interface ProblemSection {
  title: string;
  description: string;
  painPoints: PainPoint[];
}

export interface PainPoint {
  id: string;
  text: string;
  icon: string;
}

export interface FeaturesSection {
  title: string;
  description: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SocialProofSection {
  title: string;
  description: string;
  testimonials: Testimonial[];
  logos: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface GuaranteesSection {
  title: string;
  description: string;
  guarantees: Guarantee[];
}

export interface Guarantee {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface FAQSection {
  title: string;
  description: string;
  faqs: FAQ[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface CTASection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
}

export interface FinalCTASection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  features: string[];
}

// Style Types
export interface Theme {
  mode: 'light' | 'dark' | 'black';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
}

export interface Typography {
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Analytics Types
export interface AnalyticsConfig {
  enabled: boolean;
  trackingId?: string;
  goals: Goal[];
}

export interface Goal {
  id: string;
  name: string;
  type: 'conversion' | 'engagement' | 'custom';
  value?: number;
}

export interface AnalyticsEvent extends BaseEntity {
  page_id: string;
  event_type: 'page_view' | 'form_submit' | 'click' | 'scroll';
  event_data: Record<string, any>;
  user_agent?: string;
  ip_address?: string;
  referrer?: string;
}

export interface Lead extends BaseEntity {
  page_id: string;
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsData {
  page: LandingPage;
  leads: Lead[];
  views: number;
  submits: number;
  conversionRate: number;
  chartData: ChartDataPoint[];
  trafficSources: Record<string, number>;
  recentEvents: AnalyticsEvent[];
}

export interface ChartDataPoint {
  date: string;
  views: number;
  leads: number;
  conversions: number;
}

// Dashboard Types
export interface DashboardData {
  pages: LandingPage[];
  leadsByPage: Record<string, Lead[]>;
  analyticsByPage: Record<string, PageAnalytics>;
  user: User | null;
}

export interface PageAnalytics {
  views: number;
  submits: number;
  leads: number;
  conversionRate: number;
}

// UI State Types
export interface SidebarState {
  sidebarOpen: boolean;
  showSidebarOverlay: boolean;
  editingTitle: boolean;
  pageTitle: string;
  currentPageId: string | null;
  isEditPage: boolean;
}

export interface PreviewState {
  previewMode: 'desktop' | 'mobile';
  regenerating: boolean;
}

export interface EditorState {
  selectedSection: string;
  editPanelView: string;
  showSidePanel: boolean;
}

// API Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: any) => string | null;
  };
}

export interface FormData {
  [key: string]: any;
}

// Event Types
export interface CustomEvent<T = any> extends Event {
  detail: T;
}

export interface PageRefreshEvent extends CustomEvent {
  detail: {
    pageId?: string;
    refreshType: 'full' | 'partial';
  };
}

export interface TitleUpdateEvent extends CustomEvent {
  detail: {
    title: string;
    pageId: string;
  };
}

export interface PreviewModeChangeEvent extends CustomEvent {
  detail: 'desktop' | 'mobile';
}

// Hook Types
export interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UsePageManagementReturn {
  handleDelete: (id: string) => Promise<void>;
  handleEdit: (page: LandingPage) => void;
  handleView: (page: LandingPage) => void;
  handleAnalytics: (page: LandingPage) => void;
}

export interface UseSidebarStateReturn {
  sidebarOpen: boolean;
  showSidebarOverlay: boolean;
  editingTitle: boolean;
  pageTitle: string;
  currentPageId: string | null;
  isEditPage: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  startEditingTitle: () => void;
  stopEditingTitle: () => void;
  updatePageTitle: (title: string) => void;
}

// Component Props Types
export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface PageCardProps {
  page: LandingPage;
  pageLeads: number;
  pageViews: number;
  conversionRate: number;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export interface AnalyticsHeaderProps {
  page: LandingPage;
  onDelete: () => void;
}

export interface KeyMetricsProps {
  views: number;
  leads: number;
  conversionRate: number;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type NonNullable<T> = T extends null | undefined ? never : T;

// Page Grid Props
export interface PageGridProps {
  pages: LandingPage[];
  leadsByPage: Record<string, any[]>;
  analyticsByPage: Record<string, any>;
  onPageClick: (page: LandingPage) => void;
  onEdit: (page: LandingPage) => void;
  onView: (page: LandingPage) => void;
  onDelete: (page: LandingPage) => void;
  onAnalytics: (page: LandingPage) => void;
}
