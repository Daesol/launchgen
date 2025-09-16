"use client";
import { useState, useEffect } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { DashboardData, DashboardPage } from "../types/dashboard.types";

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    pages: [],
    leadsByPage: {},
    analyticsByPage: {},
    user: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createPagesBrowserClient();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setData({
          pages: [],
          leadsByPage: {},
          analyticsByPage: {},
          user: null
        });
        setLoading(false);
        return;
      }

      // Fetch landing pages
      const { data: pages, error: pagesError } = await supabase
        .from('landing_pages')
        .select('id, title, slug, created_at, template_id, page_content, page_style')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false });

      if (pagesError) throw pagesError;

      // Fetch leads for all pages
      let leadsByPage: Record<string, any[]> = {};
      if (pages && pages.length > 0) {
        const pageIds = pages.map((p: DashboardPage) => p.id);
        const { data: leads } = await supabase
          .from('leads')
          .select('id, page_id, name, email, created_at')
          .in('page_id', pageIds);
        
        if (leads) {
          leadsByPage = leads.reduce((acc: any, lead: any) => {
            if (!acc[lead.page_id]) acc[lead.page_id] = [];
            acc[lead.page_id].push(lead);
            return acc;
          }, {});
        }
      }

      // Fetch analytics for all pages
      let analyticsByPage: Record<string, { views: number; submits: number }> = {};
      if (pages && pages.length > 0) {
        const pageIds = pages.map((p: DashboardPage) => p.id);
        const { data: analytics } = await supabase
          .from('analytics_events')
          .select('page_id, event_type')
          .in('page_id', pageIds);
        
        if (analytics) {
          analyticsByPage = analytics.reduce((acc: any, event: any) => {
            if (!acc[event.page_id]) {
              acc[event.page_id] = { views: 0, submits: 0 };
            }
            if (event.event_type === 'page_view') {
              acc[event.page_id].views++;
            } else if (event.event_type === 'form_submit') {
              acc[event.page_id].submits++;
            }
            return acc;
          }, {});
        }
      }

      setData({
        pages: pages || [],
        leadsByPage,
        analyticsByPage,
        user: session.user
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
}
