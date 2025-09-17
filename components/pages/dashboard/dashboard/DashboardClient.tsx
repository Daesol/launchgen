"use client";
import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import MetricsOverview from "./MetricsOverview";
import PageGrid from "./PageGrid";
import DeleteModal from "./DeleteModal";

interface DashboardClientProps {
  pages: any[];
  leadsByPage: Record<string, any[]>;
  analyticsByPage: Record<string, { views: number; submits: number }>;
  user?: { email?: string; user_metadata?: { full_name?: string } } | null;
}

export default function DashboardClient({ 
  pages, 
  leadsByPage, 
  analyticsByPage, 
  user 
}: DashboardClientProps) {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
      <DashboardHeader user={user} />

      {/* Metrics Overview */}
      <MetricsOverview
        totalPages={pages.length}
        totalLeads={totalLeads}
        totalViews={totalViews}
        overallConversion={overallConversion}
      />

      {/* Your Landing Pages */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">Your Landing Pages</h2>
        <PageGrid
          pages={pages}
          leadsByPage={leadsByPage}
          analyticsByPage={analyticsByPage}
          onDelete={setDeleteId}
          formatDate={formatDate}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        deleting={deleting}
        error={error}
      />
    </div>
  );
}
