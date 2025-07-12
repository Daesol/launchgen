"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/generate", label: "Create Page", icon: "➕" },
  { href: "/dashboard/profile", label: "Profile", icon: "👤" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/signout", { method: "POST" });
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
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-xl border-r border-slate-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 lg:static lg:w-64`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🚀</span>
          </div>
          <span className="text-xl font-bold text-slate-800">LaunchGen</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {sidebarLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 px-4">
            AI-powered landing pages
          </div>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(v => !v)}
            >
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-800">Dashboard</span>
            </div>
          </div>
          
          <div className="relative">
            <button
              className="flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
              onClick={() => setProfileOpen(v => !v)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">U</span>
              </div>
              <span className="hidden sm:inline">Profile</span>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <Link 
                  href="/dashboard/profile" 
                  className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm">👤</span>
                  Profile Settings
                </Link>
                <hr className="my-2 border-slate-100" />
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left"
                  onClick={handleSignOut}
                >
                  <span className="text-sm">🚪</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}