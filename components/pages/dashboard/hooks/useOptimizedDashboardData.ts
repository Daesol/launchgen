"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { dashboardAPI, errorHandler } from "@/lib/dashboard";
import type { DashboardData, UseDashboardDataReturn } from "@/lib/dashboard/types";

export function useOptimizedDashboardData(): UseDashboardDataReturn {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized refetch function
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const dashboardData = await dashboardAPI.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      const dashboardError = errorHandler.handleApiError(err);
      setError(dashboardError.message);
      console.error('Error fetching dashboard data:', dashboardError);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Memoized return value to prevent unnecessary re-renders
  const returnValue = useMemo(() => ({
    data,
    loading,
    error,
    refetch
  }), [data, loading, error, refetch]);

  return returnValue;
}

// Optimized hook for specific page data
export function useOptimizedPageData(pageId: string) {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPageData = useCallback(async () => {
    if (!pageId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [page, leads, analyticsEvents] = await Promise.all([
        dashboardAPI.getLandingPage(pageId),
        dashboardAPI.getLeadsByPage(pageId),
        dashboardAPI.getAnalyticsEvents(pageId)
      ]);

      // Calculate analytics
      const views = analyticsEvents.filter(e => e.event_type === 'page_view').length;
      const submits = analyticsEvents.filter(e => e.event_type === 'form_submit').length;
      const conversionRate = views > 0 ? (submits / views) * 100 : 0;

      // Group traffic sources
      const trafficSources = analyticsEvents.reduce((acc, event) => {
        const source = event.event_data?.source || 'Direct';
        acc[source] = (acc[source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setPageData({
        page,
        leads,
        views,
        submits,
        conversionRate,
        chartData: [], // Placeholder for chart data
        trafficSources,
        recentEvents: analyticsEvents.slice(0, 10)
      });
    } catch (err) {
      const dashboardError = errorHandler.handleApiError(err);
      setError(dashboardError.message);
      console.error('Error fetching page data:', dashboardError);
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPageData();
  }, [fetchPageData]);

  const refetch = useCallback(() => {
    fetchPageData();
  }, [fetchPageData]);

  return {
    data: pageData,
    loading,
    error,
    refetch
  };
}

// Optimized hook for page management operations
export function useOptimizedPageManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await dashboardAPI.deleteLandingPage(id);
      
      // Trigger refresh event
      window.dispatchEvent(new CustomEvent('refresh-pages', {
        detail: { pageId: id, refreshType: 'full' }
      }));
    } catch (err) {
      const dashboardError = errorHandler.handleApiError(err);
      setError(dashboardError.message);
      throw dashboardError;
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEdit = useCallback((page: any) => {
    // Navigate to edit page
    window.location.href = `/dashboard/page/${page.id}`;
  }, []);

  const handleView = useCallback((page: any) => {
    // Open page in new tab
    window.open(`/page/${page.slug}`, '_blank');
  }, []);

  const handleAnalytics = useCallback((page: any) => {
    // Navigate to analytics page
    window.location.href = `/dashboard/analytics/${page.id}`;
  }, []);

  return {
    handleDelete,
    handleEdit,
    handleView,
    handleAnalytics,
    loading,
    error
  };
}
