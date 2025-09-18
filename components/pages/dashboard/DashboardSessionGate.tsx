"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDashboardData } from "./hooks/useDashboardData";
import DashboardClient from "./dashboard/DashboardClient";

export default function DashboardSessionGate() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Use the centralized dashboard data hook - it handles auth internally
  const { data, loading: dataLoading, error } = useDashboardData();

  useEffect(() => {
    console.log('🔄 DashboardSessionGate: dataLoading changed:', dataLoading);
    // Set loading to false when data loading is complete
    if (!dataLoading) {
      console.log('✅ DashboardSessionGate: Setting loading to false');
      setLoading(false);
    }
  }, [dataLoading]);

  // Redirect to signin if no user in data (handled by useDashboardData)
  useEffect(() => {
    console.log('🔍 DashboardSessionGate: Checking user auth:', { dataLoading, hasUser: !!data.user });
    if (!dataLoading && data.user === null) {
      console.log('🚪 DashboardSessionGate: Redirecting to signin');
      router.replace("/auth/signin");
    }
  }, [dataLoading, data.user, router]);

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dataLoading && !data.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-slate-400 mb-6">You need to be signed in to access the dashboard.</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Dashboard</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardClient
      pages={data.pages}
      leadsByPage={data.leadsByPage}
      analyticsByPage={data.analyticsByPage}
      user={data.user}
    />
  );
}