export interface DashboardPage {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  template_id?: string;
  page_content?: any;
  page_style?: any;
}

export interface DashboardUser {
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface SidebarState {
  sidebarOpen: boolean;
  showSidebarOverlay: boolean;
  editingTitle: boolean;
  pageTitle: string;
  currentPageId: string | null;
}

export interface PageManagementState {
  pages: DashboardPage[];
  loading: boolean;
  error: string | null;
}

export interface DashboardData {
  pages: DashboardPage[];
  leadsByPage: Record<string, any[]>;
  analyticsByPage: Record<string, { views: number; submits: number }>;
  user: DashboardUser | null;
}
