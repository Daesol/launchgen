// Centralized API Layer for Dashboard

import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { errorHandler, ERROR_CODES } from "./errorHandling";
import { DASHBOARD_CONSTANTS } from "./constants";
import type { 
  LandingPage, 
  Lead, 
  AnalyticsEvent, 
  DashboardData, 
  ApiResponse,
  PaginatedResponse 
} from "./types";

class DashboardAPI {
  private supabase = createPagesBrowserClient();

  // Landing Pages API
  async getLandingPages(): Promise<LandingPage[]> {
    try {
      const { data, error } = await this.supabase
        .from('landing_pages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async getLandingPage(id: string): Promise<LandingPage> {
    try {
      const { data, error } = await this.supabase
        .from('landing_pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw errorHandler.createError(ERROR_CODES.API_ERROR_404, 'Page not found');
      
      return data;
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async createLandingPage(pageData: Partial<LandingPage>): Promise<LandingPage> {
    try {
      const { data, error } = await this.supabase
        .from('landing_pages')
        .insert([pageData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async updateLandingPage(id: string, updates: Partial<LandingPage>): Promise<LandingPage> {
    try {
      const { data, error } = await this.supabase
        .from('landing_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async deleteLandingPage(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  // Leads API
  async getLeadsByPage(pageId: string): Promise<Lead[]> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .select('*')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async getAllLeads(): Promise<Lead[]> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  // Analytics API
  async getAnalyticsEvents(pageId: string): Promise<AnalyticsEvent[]> {
    try {
      const { data, error } = await this.supabase
        .from('analytics_events')
        .select('*')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async createAnalyticsEvent(eventData: Partial<AnalyticsEvent>): Promise<AnalyticsEvent> {
    try {
      const { data, error } = await this.supabase
        .from('analytics_events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  // Dashboard Data API
  async getDashboardData(): Promise<DashboardData> {
    try {
      const [pages, leads, analyticsEvents] = await Promise.all([
        this.getLandingPages(),
        this.getAllLeads(),
        this.getAllAnalyticsEvents()
      ]);

      // Group leads by page
      const leadsByPage = leads.reduce((acc, lead) => {
        if (!acc[lead.page_id]) {
          acc[lead.page_id] = [];
        }
        acc[lead.page_id].push(lead);
        return acc;
      }, {} as Record<string, Lead[]>);

      // Group analytics by page
      const analyticsByPage = analyticsEvents.reduce((acc, event) => {
        if (!acc[event.page_id]) {
          acc[event.page_id] = { views: 0, submits: 0, leads: 0, conversionRate: 0 };
        }
        
        if (event.event_type === 'page_view') {
          acc[event.page_id].views++;
        } else if (event.event_type === 'form_submit') {
          acc[event.page_id].submits++;
        }
        
        return acc;
      }, {} as Record<string, { views: number; submits: number; leads: number; conversionRate: number }>);

      // Calculate conversion rates
      Object.keys(analyticsByPage).forEach(pageId => {
        const analytics = analyticsByPage[pageId];
        analytics.leads = leadsByPage[pageId]?.length || 0;
        analytics.conversionRate = analytics.views > 0 ? (analytics.submits / analytics.views) * 100 : 0;
      });

      // Get current user
      const { data: { user } } = await this.supabase.auth.getUser();

      return {
        pages,
        leadsByPage,
        analyticsByPage,
        user
      };
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async getAllAnalyticsEvents(): Promise<AnalyticsEvent[]> {
    try {
      const { data, error } = await this.supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  // User API
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw errorHandler.handleApiError(error);
    }
  }

  // Utility methods
  async refreshData(): Promise<DashboardData> {
    return this.getDashboardData();
  }

  // Error handling wrapper
  async withErrorHandling<T>(operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
        // Already a DashboardError
        throw error;
      }
      throw errorHandler.handleApiError(error);
    }
  }
}

// Export singleton instance
export const dashboardAPI = new DashboardAPI();

// Export individual methods for convenience
export const {
  getLandingPages,
  getLandingPage,
  createLandingPage,
  updateLandingPage,
  deleteLandingPage,
  getLeadsByPage,
  getAllLeads,
  createLead,
  getAnalyticsEvents,
  createAnalyticsEvent,
  getDashboardData,
  getCurrentUser,
  signOut,
  refreshData,
  withErrorHandling
} = dashboardAPI;
