// Dashboard Domain Types

export interface DashboardPage {
  id: string;
  title: string;
  slug: string;
  content: any;
  style: any;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_published: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  page_id: string;
  created_at: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface AnalyticsEvent {
  id: string;
  landing_page_id: string;
  event_type: 'page_view' | 'form_submit' | 'cta_click';
  session_id: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
}

export interface DashboardStats {
  totalPages: number;
  totalLeads: number;
  totalViews: number;
  conversionRate: number;
}

export interface PageStats {
  pageId: string;
  pageTitle: string;
  views: number;
  leads: number;
  conversionRate: number;
  lastUpdated: string;
}

export interface DashboardLayoutProps {
  children: React.ReactNode;
}

export interface PageListProps {
  pages: DashboardPage[];
  onPageSelect: (pageId: string) => void;
  onPageDelete: (pageId: string) => void;
  loading?: boolean;
}

export interface PageCardProps {
  page: DashboardPage;
  onSelect: (pageId: string) => void;
  onDelete: (pageId: string) => void;
  stats?: PageStats;
}