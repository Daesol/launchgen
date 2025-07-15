'use client'

import { Zap } from 'lucide-react'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

export default function Navigation() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = createPagesBrowserClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/signout", { method: "POST" });
    // Clear Supabase keys from localStorage and sessionStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        sessionStorage.removeItem(key);
      }
    });
    setTimeout(() => {
      window.location.replace("/auth/signin");
    }, 200);
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">LaunchGen</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <a href="/auth/signin" className="text-slate-300 hover:text-white transition-colors">Sign In</a>
                <a href="/auth/signin?mode=signup" className="ml-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold shadow hover:from-purple-700 hover:to-indigo-700 transition">Sign Up</a>
              </>
            ) : (
              <button
                onClick={handleSignOut}
                className="ml-2 px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white rounded-lg font-semibold shadow hover:from-slate-800 hover:to-slate-950 transition"
              >Sign Out</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 