"use client";
import Link from "next/link";
import { DashboardPage } from "../types/dashboard.types";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/generate", label: "Create Page", icon: "➕" },
];

interface SidebarProps {
  pages: DashboardPage[];
  currentPageId: string | null;
  isEditPage: boolean;
  showSidebarOverlay: boolean;
  sidebarHovered?: boolean;
  onPageClick: (page: DashboardPage) => void;
}

export default function Sidebar({ 
  pages, 
  currentPageId, 
  isEditPage, 
  showSidebarOverlay, 
  sidebarHovered = false,
  onPageClick 
}: SidebarProps) {
  if (isEditPage) {
    return (
      <aside
        className={`fixed left-0 top-0 z-50 w-64 bg-black shadow-2xl border-r border-[#2D2D2D] transition-all duration-300 ${
          showSidebarOverlay ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
        }`}
        style={{ top: '64px', height: 'calc(100vh - 64px)' }}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="px-4 py-6 space-y-2">
            {sidebarLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all duration-200 group"
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Pages List */}
          <div className="flex-1 px-4 py-6 border-t border-[#2D2D2D]">
            <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wider">
              Your Pages
            </h3>
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => onPageClick(page)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPageId === page.id
                      ? 'bg-blue-600 text-white'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <div className="truncate">{page.title}</div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {new Date(page.created_at).toLocaleDateString()}
                  </div>
                </button>
              ))}
              {pages.length === 0 && (
                <div className="text-center text-neutral-500 text-sm py-8">
                  No pages yet
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-[#2D2D2D]">
            <div className="text-xs text-neutral-500 text-center">
              Built with AI • Powered by LaunchGen
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="fixed z-40 inset-y-0 left-0 w-72 bg-black shadow-xl border-r border-[#2D2D2D] flex flex-col transition-transform duration-300 translate-x-0 lg:static lg:sticky lg:top-0 lg:h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#2D2D2D]">
        <div className="w-8 h-8 bg-gradient-to-r from-white to-neutral-300 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-black font-bold text-sm">🚀</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">LaunchGen</h1>
          <p className="text-xs text-neutral-400">AI Landing Pages</p>
        </div>
      </div>
      
      {/* Navigation Links */}
      <nav className="px-4 py-6 space-y-2">
        {sidebarLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all duration-200 group"
          >
            <span className="text-lg">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>

      {/* Pages List */}
      <div className="flex-1 px-4 py-6 border-t border-[#2D2D2D]">
        <h3 className="text-sm font-semibold text-neutral-400 mb-4 uppercase tracking-wider">
          Your Pages
        </h3>
        <div className="space-y-1 max-h-96 overflow-y-auto">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onPageClick(page)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                currentPageId === page.id
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              <div className="truncate">{page.title}</div>
              <div className="text-xs text-neutral-500 mt-1">
                {new Date(page.created_at).toLocaleDateString()}
              </div>
            </button>
          ))}
          {pages.length === 0 && (
            <div className="text-center text-neutral-500 text-sm py-8">
              No pages yet
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[#2D2D2D]">
        <div className="text-xs text-neutral-500 text-center">
          Built with AI • Powered by LaunchGen
        </div>
      </div>
    </aside>
  );
}
