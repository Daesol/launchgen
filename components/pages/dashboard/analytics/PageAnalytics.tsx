"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AnalyticsHeader from "./AnalyticsHeader";
import KeyMetrics from "./KeyMetrics";
import TrafficSources from "./TrafficSources";
import RecentActivity from "./RecentActivity";
import LeadList from "./LeadList";
import PerformanceChart from "./PerformanceChart";

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

      // Redirect to dashboard after successful deletion
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
      <AnalyticsHeader 
        page={page} 
        onDelete={() => setDeleteId(page.id)} 
      />

      {/* Key Metrics */}
      <KeyMetrics 
        views={views}
        leads={leads.length}
        conversionRate={conversionRate}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Sources */}
        <TrafficSources trafficSources={trafficSources} />

        {/* Recent Activity */}
        <RecentActivity 
          recentEvents={recentEvents} 
          formatDate={formatDate} 
        />
      </div>

      {/* Leads List */}
      <LeadList 
        leads={leads} 
        formatDate={formatDate} 
      />

      {/* Chart Placeholder */}
      <PerformanceChart chartData={chartData} />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 border border-[#2D2D2D] rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-white text-lg font-semibold mb-4">Delete Page</h3>
            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete this page? This action cannot be undone.
            </p>
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-[#2D2D2D] text-neutral-300 hover:bg-neutral-700 rounded transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#0A0A0A' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
