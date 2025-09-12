"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Eye, 
  Users, 
  MousePointer, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  Plus,
  TrendingUp,
  Activity,
  Zap,
  Target,
  ArrowUpRight,
  MoreHorizontal
} from "lucide-react";

interface DashboardClientProps {
  pages: any[];
  leadsByPage: Record<string, any[]>;
  analyticsByPage: Record<string, { views: number; submits: number }>;
  user?: { email?: string; user_metadata?: { full_name?: string } } | null;
}

export default function DashboardClient({ pages, leadsByPage, analyticsByPage, user }: DashboardClientProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Calculate total metrics
  const totalLeads = Object.values(leadsByPage).reduce((sum, leads) => sum + leads.length, 0);
  const totalViews = Object.values(analyticsByPage).reduce((sum, analytics) => sum + analytics.views, 0);
  const totalSubmits = Object.values(analyticsByPage).reduce((sum, analytics) => sum + analytics.submits, 0);
  const overallConversion = totalViews > 0 ? (totalSubmits / totalViews) * 100 : 0;

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-black p-6 space-y-8">
      {/* Header Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </h1>
            <p className="text-neutral-400 text-sm mt-1">Manage your landing pages and track performance</p>
          </div>
          <Link href="/dashboard/generate">
            <Button className="bg-white hover:bg-neutral-100 text-black px-6 py-3 h-auto font-medium">
              <Plus className="w-4 h-4 mr-2" />
              Create New Page
            </Button>
          </Link>
        </div>

        {/* Compact Metrics Overview */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 bg-neutral-800 rounded-lg px-4 py-3 border border-[#2D2D2D]">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <div>
              <span className="text-neutral-400 text-xs">Pages</span>
              <span className="text-white font-semibold ml-2">{pages.length}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-800 rounded-lg px-4 py-3 border border-[#2D2D2D]">
            <Users className="w-4 h-4 text-green-400" />
            <div>
              <span className="text-neutral-400 text-xs">Leads</span>
              <span className="text-white font-semibold ml-2">{totalLeads}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-800 rounded-lg px-4 py-3 border border-[#2D2D2D]">
            <Eye className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-neutral-400 text-xs">Views</span>
              <span className="text-white font-semibold ml-2">{totalViews.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-neutral-800 rounded-lg px-4 py-3 border border-[#2D2D2D]">
            <Target className="w-4 h-4 text-orange-400" />
            <div>
              <span className="text-neutral-400 text-xs">Conversion</span>
              <span className="text-white font-semibold ml-2">{overallConversion.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Your Landing Pages</h2>
          <Badge variant="secondary" className="text-neutral-400 bg-neutral-800 border-[#2D2D2D]">
            {pages.length} {pages.length === 1 ? 'page' : 'pages'}
          </Badge>
        </div>

      {pages && pages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pages.map((page: any) => {
              const pageLeads = leadsByPage[page.id]?.length || 0;
              const pageViews = analyticsByPage[page.id]?.views || 0;
              const pageSubmits = analyticsByPage[page.id]?.submits || 0;
              const conversionRate = pageViews > 0 ? (pageSubmits / pageViews) * 100 : 0;
              const isPublished = page.published;

              return (
                <Card 
                  key={page.id} 
                  className="border border-[#2D2D2D] shadow-sm hover:shadow-md hover:bg-neutral-800 transition-all duration-200 cursor-pointer group" 
                  style={{ backgroundColor: '#0A0A0A' }}
                  onClick={() => router.push(`/dashboard/analytics/${page.id}`)}
                >
                  <CardContent className="p-6">
                    {/* Header with title and status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate mb-2">
                          {page.page_content?.hero?.headline || page.title || 'Untitled'}
                        </h3>
                        <div className="flex items-center gap-2">
                          {isPublished && (
                            <Badge variant="default" className="bg-green-900/50 text-green-400 border-green-800 text-xs">
                              Published
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-neutral-400 border-[#2D2D2D] text-xs">
                            {page.template_id || 'default'}
                          </Badge>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors" />
                    </div>
                    
                    {/* Description */}
                    <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                      {page.page_content?.hero?.subheadline || 'No description available'}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="w-4 h-4 text-green-400" />
                          <span className="text-lg font-bold text-white">{pageLeads}</span>
                        </div>
                        <p className="text-xs text-neutral-500">Leads</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <span className="text-lg font-bold text-white">{pageViews.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-neutral-500">Views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="w-4 h-4 text-purple-400" />
                          <span className="text-lg font-bold text-white">{conversionRate.toFixed(1)}%</span>
                        </div>
                        <p className="text-xs text-neutral-500">Conversion</p>
                      </div>
                    </div>

                    {/* Footer with date and action buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#2D2D2D]">
                      <div className="flex items-center gap-1 text-xs text-neutral-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(page.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link href={`/dashboard/page/${page.id}`} onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-white border-[#2D2D2D] hover:bg-neutral-800" style={{ backgroundColor: '#0A0A0A' }}>
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Link href={`/page/${page.slug}`} target="_blank" onClick={(e) => e.stopPropagation()}>
                          <Button variant="outline" size="sm" className="h-7 px-2 text-white border-[#2D2D2D] hover:bg-neutral-800" style={{ backgroundColor: '#0A0A0A' }}>
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-800"
                          style={{ backgroundColor: '#0A0A0A' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(page.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      ) : (
          <Card className="border border-[#2D2D2D] shadow-sm" style={{ backgroundColor: '#0A0A0A' }}>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-neutral-400" />
        </div>
              <h3 className="text-lg font-semibold text-white mb-2">No landing pages yet</h3>
              <p className="text-neutral-400 mb-6 max-w-md mx-auto">
                Create your first AI-powered landing page and start converting visitors into leads.
              </p>
              <Link href="/dashboard/generate">
                <Button className="bg-white hover:bg-neutral-100 text-black px-6 py-3 h-auto font-medium">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Page
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="max-w-sm w-full border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
            <CardHeader>
              <CardTitle className="text-lg text-white">Delete Landing Page?</CardTitle>
              <CardDescription className="text-neutral-400">
                Are you sure you want to delete this landing page? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-red-400 text-sm bg-red-900/20 border border-red-800 p-3 rounded-lg">
                  {error}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  variant="destructive"
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="outline"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                  className="flex-1 border-[#2D2D2D] text-white hover:bg-neutral-800"
                  style={{ backgroundColor: '#0A0A0A' }}
                >
                  Cancel
                </Button>
            </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 