"use client";
import React, { useState } from "react";
import Link from "next/link";

interface DashboardClientProps {
  pages: any[];
  leadsByPage: Record<string, any[]>;
  analyticsByPage: Record<string, { views: number; submits: number }>;
}

export default function DashboardClient({ pages, leadsByPage, analyticsByPage }: DashboardClientProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/landing-pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      window.location.reload();
    } catch (e: any) {
      setError(e.message || "Failed to delete");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="bg-white/90 rounded-2xl shadow-xl p-3 sm:p-4 md:p-8">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6">Your Landing Pages</h2>
      {pages && pages.length > 0 ? (
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-[800px] sm:min-w-full">
            <table className="w-full text-xs sm:text-sm md:text-base border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-white rounded-l-xl">Title</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-white hidden sm:table-cell">Template</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-white hidden md:table-cell">Created</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-white">Leads</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-white hidden sm:table-cell">Views</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-white hidden sm:table-cell">Submits</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-white hidden lg:table-cell">Conversion</th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-semibold text-slate-500 uppercase bg-white rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page: any) => (
                  <React.Fragment key={page.id}>
                    <tr className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 group">
                      <td className="px-2 sm:px-4 py-3 sm:py-4 font-semibold text-slate-900 rounded-l-xl whitespace-nowrap max-w-[120px] sm:max-w-[180px] truncate">
                        {page.page_content?.hero?.headline || page.title || 'Untitled'}
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-slate-600 whitespace-nowrap hidden sm:table-cell">{page.template_id || 'default'}</td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-slate-600 whitespace-nowrap hidden md:table-cell">{new Date(page.created_at).toLocaleDateString()}</td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-slate-600 text-center">{leadsByPage[page.id]?.length || 0}</td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-slate-600 text-center hidden sm:table-cell">{analyticsByPage[page.id]?.views || 0}</td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-slate-600 text-center hidden sm:table-cell">{analyticsByPage[page.id]?.submits || 0}</td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 text-slate-600 text-center hidden lg:table-cell">{analyticsByPage[page.id]?.views ? ((analyticsByPage[page.id].submits / analyticsByPage[page.id].views) * 100).toFixed(1) + '%' : '—'}</td>
                      <td className="px-2 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row gap-1 sm:gap-2 items-start sm:items-center rounded-r-xl">
                        <Link href={`/dashboard/page/${page.id}`} className="text-indigo-600 hover:underline font-medium text-xs sm:text-sm">Edit</Link>
                        <Link href={`/page/${page.slug}`} className="text-purple-600 hover:underline font-medium text-xs sm:text-sm" target="_blank">View</Link>
                        <button
                          className="text-red-600 hover:underline font-medium text-xs sm:text-sm"
                          onClick={() => setDeleteId(page.id)}
                        >Delete</button>
                      </td>
                    </tr>
                    {leadsByPage[page.id]?.length > 0 && (
                      <tr>
                        <td colSpan={8} className="bg-slate-50 px-2 sm:px-4 py-2 rounded-b-xl">
                          <div className="text-slate-700 font-semibold mb-2 text-sm">Leads:</div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {leadsByPage[page.id].map((lead: any) => (
                              <div key={lead.id} className="p-2 border rounded bg-white flex flex-col text-xs sm:text-sm">
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
        </div>
      ) : (
        <div className="text-center text-slate-400 py-8 sm:py-12">
          <div className="text-2xl sm:text-3xl mb-2">🚀</div>
          <div className="mb-2 text-sm sm:text-base">You haven&apos;t created any landing pages yet.</div>
          <Link href="/dashboard/generate" className="inline-block mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold shadow-lg hover:from-purple-700 hover:to-indigo-700 transition text-sm sm:text-lg">Create Your First Landing Page</Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-sm w-full text-center animate-fade-in-up">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-slate-900">Delete Landing Page?</h3>
            <p className="mb-6 text-slate-600 text-sm sm:text-base">Are you sure you want to delete this landing page? This action cannot be undone.</p>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                className="px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition disabled:opacity-60 text-sm sm:text-base"
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
              >{deleting ? "Deleting..." : "Delete"}</button>
              <button
                className="px-4 sm:px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold shadow hover:bg-slate-300 transition text-sm sm:text-base"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 