import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react'; // Removed useState
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch landing pages for the user (new columns)
  const { data: pages, error: pagesError } = await supabase
    .from('landing_pages')
    .select('id, title, slug, created_at, template_id, page_content, page_style')
    .eq('owner_id', session.user.id)
    .order('created_at', { ascending: false });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-indigo-900 to-slate-950 p-4">
      <div className="max-w-5xl mx-auto mt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Welcome, {session.user.email}</h1>
            <p className="text-slate-300">Your AI-powered landing pages, leads, and analytics in one place.</p>
          </div>
          <Link href="/dashboard/generate" className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition text-lg">+ Create New Landing Page</Link>
        </div>
        <DashboardClient pages={pages || []} leadsByPage={leadsByPage} analyticsByPage={analyticsByPage} />
        {/* Navigation */}
        <div className="flex justify-end mt-8 gap-4">
          <Link href="/dashboard/profile" className="text-slate-400 hover:text-slate-700">Profile</Link>
          <Link href="/auth/signin?signout=true" className="text-slate-400 hover:text-slate-700">Sign Out</Link>
        </div>
      </div>
    </div>
  );
} 