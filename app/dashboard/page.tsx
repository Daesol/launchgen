import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch landing pages for the user
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome back! 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Manage your AI-powered landing pages and track performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link 
            href="/dashboard/generate" 
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-md"
          >
            <span className="text-lg">➕</span>
            Create New Page
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Pages</p>
              <p className="text-2xl font-bold text-slate-900">{pages?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Views</p>
              <p className="text-2xl font-bold text-slate-900">
                {Object.values(analyticsByPage).reduce((sum, analytics) => sum + analytics.views, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👁️</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Leads</p>
              <p className="text-2xl font-bold text-slate-900">
                {Object.values(leadsByPage).reduce((sum, leads) => sum + leads.length, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Conversions</p>
              <p className="text-2xl font-bold text-slate-900">
                {Object.values(analyticsByPage).reduce((sum, analytics) => sum + analytics.submits, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Client Component */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <DashboardClient 
          pages={pages || []} 
          leadsByPage={leadsByPage} 
          analyticsByPage={analyticsByPage} 
        />
      </div>
    </div>
  );
}