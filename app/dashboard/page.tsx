import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import React from 'react'; // Added missing import for React

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch landing pages for the user (new columns)
  const { data: pages, error } = await supabase
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

        {/* Landing Pages List */}
        <div className="bg-white/90 rounded-xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Landing Pages</h2>
          {pages && pages.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Template</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Created</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Leads</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pages.map((page: any) => (
                    <React.Fragment key={page.id}>
                      <tr className="hover:bg-slate-50">
                        <td className="px-4 py-2 font-semibold text-slate-900">
                          {page.page_content?.hero?.headline || page.title || 'Untitled'}
                        </td>
                        <td className="px-4 py-2 text-slate-600">{page.template_id || 'default'}</td>
                        <td className="px-4 py-2 text-slate-600">{new Date(page.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-2 text-slate-600">
                          {leadsByPage[page.id]?.length || 0}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <Link href={`/dashboard/page/${page.id}`} className="text-indigo-600 hover:underline">Edit</Link>
                          <Link href={`/page/${page.slug}`} className="text-purple-600 hover:underline" target="_blank">View</Link>
                        </td>
                      </tr>
                      {leadsByPage[page.id]?.length > 0 && (
                        <tr>
                          <td colSpan={5} className="bg-slate-50 px-4 py-2">
                            <div className="text-slate-700 font-semibold mb-2">Leads:</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {leadsByPage[page.id].map((lead: any) => (
                                <div key={lead.id} className="p-2 border rounded bg-white flex flex-col">
                                  <span><b>Name:</b> {lead.name || <span className="text-slate-400">(none)</span>}</span>
                                  <span><b>Email:</b> {lead.email}</span>
                                  <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12">
              <div className="text-3xl mb-2">🚀</div>
              <div className="mb-2">You haven&apos;t created any landing pages yet.</div>
              <Link href="/dashboard/generate" className="inline-block mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition text-lg">Create Your First Landing Page</Link>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-end mt-8 gap-4">
          <Link href="/dashboard/profile" className="text-slate-400 hover:text-slate-700">Profile</Link>
          <Link href="/auth/signin?signout=true" className="text-slate-400 hover:text-slate-700">Sign Out</Link>
        </div>
      </div>
    </div>
  );
} 