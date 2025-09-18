"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useDashboardData } from "./hooks/useDashboardData";
import DashboardClient from "./dashboard/DashboardClient";

export default function DashboardSessionGate() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const supabase = createPagesBrowserClient();
  
  // Use the centralized dashboard data hook
  const { data, loading: dataLoading, error } = useDashboardData();

  useEffect(() => {
    let mounted = true;
    
    // Initial auth check
    supabase.auth.getUser().then(async ({ data: { user }, error: userError }) => {
      if (mounted) {
        setLoading(false);
        if (userError || !user) {
          setSession(null);
          router.replace("/auth/signin");
        } else {
          setSession({ user });
        }
      }
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
        if (!session) {
          router.replace("/auth/signin");
        }
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [router, supabase]);

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

  if (!session) {
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