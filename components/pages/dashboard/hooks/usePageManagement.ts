"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { DashboardPage } from "../types/dashboard.types";

export function usePageManagement() {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  const handleDelete = async (id: string) => {
    setDeleting(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Also delete associated leads and analytics
      await supabase
        .from('leads')
        .delete()
        .eq('page_id', id);

      await supabase
        .from('analytics_events')
        .delete()
        .eq('page_id', id);

      // Refresh the page to update the UI
      window.location.reload();
    } catch (err) {
      console.error('Error deleting page:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete page');
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (page: DashboardPage) => {
    router.push(`/dashboard/page/${page.id}`);
  };

  const handleView = (page: DashboardPage) => {
    router.push(`/page/${page.slug}`);
  };

  const handleAnalytics = (page: DashboardPage) => {
    router.push(`/dashboard/analytics/${page.id}`);
  };

  const handleDuplicate = async (page: DashboardPage) => {
    try {
      setError(null);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const duplicateData = {
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy-${Date.now()}`,
        template_id: page.template_id,
        page_content: page.page_content,
        page_style: page.page_style,
        owner_id: session.user.id
      };

      const { error } = await supabase
        .from('landing_pages')
        .insert([duplicateData]);

      if (error) throw error;

      // Refresh the page to show the new duplicate
      window.location.reload();
    } catch (err) {
      console.error('Error duplicating page:', err);
      setError(err instanceof Error ? err.message : 'Failed to duplicate page');
    }
  };

  return {
    deleting,
    error,
    handleDelete,
    handleEdit,
    handleView,
    handleAnalytics,
    handleDuplicate,
    clearError: () => setError(null)
  };
}
