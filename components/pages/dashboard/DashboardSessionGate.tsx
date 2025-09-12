"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import DashboardClient from "./DashboardClient";

export default function DashboardSessionGate() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [leadsByPage, setLeadsByPage] = useState<Record<string, any[]>>({});
  const [analyticsByPage, setAnalyticsByPage] = useState<Record<string, { views: number; submits: number }>>({});
  const router = useRouter();
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
        if (!session) {
          router.replace("/auth/signin");
        } else {
          // Fetch landing pages for the user
          const { data: pages, error: pagesError } = await supabase
            .from('landing_pages')
            .select('id, title, slug, created_at, template_id, page_content, page_style')
            .eq('owner_id', session.user.id)
            .order('created_at', { ascending: false });
          setPages(pages || []);

          // Fetch leads for all pages
          let leadsByPage: Record<string, any[]> = {};
          if (pages && pages.length > 0) {
            const pageIds = pages.map((p: any) => p.id);
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
          setLeadsByPage(leadsByPage);

          // Fetch analytics for each page
          let analyticsByPage: Record<string, { views: number; submits: number }> = {};
          if (pages && pages.length > 0) {
            const pageIds = pages.map((p: any) => p.id);
            const { data: analytics } = await supabase
              .from('analytics_events')
              .select('landing_page_id, event_type')
              .in('landing_page_id', pageIds);
            if (analytics) {
              analyticsByPage = analytics.reduce((acc: any, event: any) => {
                if (!acc[event.landing_page_id]) acc[event.landing_page_id] = { views: 0, submits: 0 };
                if (event.event_type === 'page_view') acc[event.landing_page_id].views++;
                if (event.event_type === 'form_submit') acc[event.landing_page_id].submits++;
                return acc;
              }, {});
            }
          }
          setAnalyticsByPage(analyticsByPage);
        }
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        router.replace("/auth/signin");
      }
    });
    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  if (!session) return null;
  return (
    <DashboardClient pages={pages || []} leadsByPage={leadsByPage} analyticsByPage={analyticsByPage} user={session?.user} />
  );
} 