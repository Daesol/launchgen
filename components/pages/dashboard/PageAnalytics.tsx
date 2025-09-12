"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  BarChart3, 
  Eye, 
  Users, 
  MousePointer, 
  Calendar, 
  ExternalLink, 
  Edit3, 
  Trash2,
  TrendingUp,
  Activity,
  Target,
  ArrowUpRight,
  Globe,
  Clock,
  Mail,
  User
} from "lucide-react";

interface PageAnalyticsProps {
  data: {
    page: any;
    leads: any[];
    views: number;
    submits: number;
    conversionRate: number;
    chartData: any[];
    trafficSources: any;
    recentEvents: any[];
  };
}

export default function PageAnalytics({ data }: PageAnalyticsProps) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const { page, leads, views, submits, conversionRate, chartData, trafficSources, recentEvents } = data;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  async function handleDelete() {
    if (!deleteId) return;
    
    setDeleting(true);
    setError("");
    try {
      const res = await fetch("/api/landing-pages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete page");
      }

      // Redirect back to dashboard after successful deletion
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="min-h-screen bg-black p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{page.title}</h1>
            <p className="text-neutral-400 text-sm">Analytics & Performance</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/page/${page.id}`}>
            <Button variant="outline" className="border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Page
            </Button>
          </Link>
          <Link href={`/${page.slug}`} target="_blank">
            <Button variant="outline" className="border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="border-red-800 text-red-400 hover:bg-red-900/20"
            onClick={() => setDeleteId(page.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Total Views</p>
                <p className="text-2xl font-bold text-white">{views.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Total Leads</p>
                <p className="text-2xl font-bold text-white">{leads.length}</p>
              </div>
              <div className="w-10 h-10 bg-green-900/50 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-white">{conversionRate.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-400">Form Submits</p>
                <p className="text-2xl font-bold text-white">{submits}</p>
              </div>
              <div className="w-10 h-10 bg-orange-900/50 rounded-lg flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Sources */}
        <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Traffic Sources
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Where your visitors are coming from
            </CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(trafficSources).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(trafficSources).map(([source, count]: [string, any]) => (
                  <div key={source} className="flex items-center justify-between">
                    <span className="text-neutral-300 text-sm">{source}</span>
                    <Badge variant="outline" className="border-[#2D2D2D] text-neutral-400">
                      {count} visits
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">No traffic data available yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Latest visitor interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentEvents.length > 0 ? (
              <div className="space-y-3">
                {recentEvents.slice(0, 10).map((event: any, index: number) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-neutral-300 text-sm">
                        {event.event_type === 'page_view' ? 'Page viewed' : 'Form submitted'}
                      </p>
                      <p className="text-neutral-500 text-xs">
                        {formatDate(event.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Lead Collection ({leads.length})
          </CardTitle>
          <CardDescription className="text-neutral-400">
            All leads captured from this landing page
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leads.length > 0 ? (
            <div className="space-y-4">
              {leads.map((lead: any) => (
                <div key={lead.id} className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg border border-[#2D2D2D]">
                  <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{lead.name || 'Anonymous'}</p>
                    <p className="text-neutral-400 text-sm">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-neutral-500 text-sm">{formatDate(lead.created_at)}</p>
                    {lead.source && (
                      <Badge variant="outline" className="border-[#2D2D2D] text-neutral-400 text-xs mt-1">
                        {lead.source}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-500">No leads captured yet</p>
              <p className="text-neutral-600 text-sm">Leads will appear here once visitors submit your form</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance Over Time
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Views and conversions over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 mb-2">Chart visualization coming soon</p>
            <p className="text-neutral-600 text-sm">We're working on interactive charts to show your performance trends</p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
            <CardHeader>
              <CardTitle className="text-white">Delete Landing Page</CardTitle>
              <CardDescription className="text-neutral-400">
                Are you sure you want to delete "{page.title}"? This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setDeleteId(null)}
                  className="border-[#2D2D2D] text-white hover:bg-neutral-800"
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
