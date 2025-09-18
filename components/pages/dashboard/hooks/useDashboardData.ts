"use client";
import { useState, useEffect, useCallback } from "react";
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

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      setLoading(true);
      setError(null);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('👤 User auth result:', { user: !!user, error: userError });
      
      if (userError || !user) {
        console.log('❌ No user found, clearing data');
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
        .eq('owner_id', user.id)
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

      // Fetch analytics for all pages (batched to avoid URL length limits)
      let analyticsByPage: Record<string, { views: number; submits: number }> = {};
      if (pages && pages.length > 0) {
        const pageIds = pages.map((p: DashboardPage) => p.id);
        
        // Batch the queries to avoid URL length limits
        const batchSize = 10; // Process 10 page IDs at a time
        const batches = [];
        for (let i = 0; i < pageIds.length; i += batchSize) {
          batches.push(pageIds.slice(i, i + batchSize));
        }
        
        const allAnalytics = [];
        for (const batch of batches) {
          try {
            const { data: analytics, error } = await supabase
              .from('analytics_events')
              .select('landing_page_id, event_type')
              .in('landing_page_id', batch);
            
            if (error) {
              console.warn('Analytics fetch error for batch:', error);
              continue; // Skip this batch but continue with others
            }
            
            if (analytics) {
              allAnalytics.push(...analytics);
            }
          } catch (err) {
            console.warn('Analytics batch error:', err);
            continue; // Skip this batch but continue with others
          }
        }
        
        if (allAnalytics.length > 0) {
          analyticsByPage = allAnalytics.reduce((acc: any, event: any) => {
            if (!acc[event.landing_page_id]) {
              acc[event.landing_page_id] = { views: 0, submits: 0 };
            }
            if (event.event_type === 'page_view') {
              acc[event.landing_page_id].views++;
            } else if (event.event_type === 'form_submit') {
              acc[event.landing_page_id].submits++;
            }
            return acc;
          }, {});
        }
      }

      console.log('✅ Dashboard data fetched successfully:', { 
        pagesCount: pages?.length || 0, 
        leadsCount: Object.keys(leadsByPage).length,
        analyticsCount: Object.keys(analyticsByPage).length 
      });
      
      setData({
        pages: pages || [],
        leadsByPage,
        analyticsByPage,
        user: user
      });
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      console.log('🏁 Dashboard data fetch complete');
      setLoading(false);
    }
  }, []); // Remove supabase dependency to prevent infinite re-renders

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData
  };
}
