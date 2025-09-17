"use client";
import React from "react";
import Link from "next/link";
import { DashboardPage } from "../types/dashboard.types";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/generate", label: "Create Page", icon: "➕" },
];

interface MobileSidebarProps {
  sidebarOpen: boolean;
  onClose: () => void;
  pages: DashboardPage[];
  currentPageId: string | null;
  onPageClick: (page: DashboardPage) => void;
}

export default function MobileSidebar({ 
  sidebarOpen, 
  onClose, 
  pages, 
  currentPageId, 
  onPageClick 
}: MobileSidebarProps) {
  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={onClose} 
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 w-64 bg-black shadow-2xl border-r border-[#2D2D2D] transition-all duration-300 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ height: '100vh' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-6 border-b border-[#2D2D2D]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">LaunchGen</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 py-6 space-y-2">
            {sidebarLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-neutral-300 hover:bg-neutral-800 hover:text-white transition-all duration-200 group"
                style={{ fontSize: '14px' }}
                onClick={onClose}
              >
                <span className="w-5 h-5 flex items-center justify-center text-sm">{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Pages List */}
          <div className="flex-1 px-4 py-6 border-t border-[#2D2D2D] flex flex-col min-h-0">
            <h3 className="font-semibold text-neutral-400 mb-4 uppercase tracking-wider flex-shrink-0" style={{ fontSize: '14px' }}>
              Your Pages
            </h3>
            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {pages.length === 0 ? (
                <p className="text-neutral-500 text-sm">No pages yet</p>
              ) : (
                pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => {
                      onPageClick(page);
                      onClose(); // Close sidebar when navigating to a page
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                      currentPageId === page.id
                        ? 'bg-neutral-700 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    }`}
                    style={{ fontSize: '13px' }}
                  >
                    {page.title || 'Untitled'}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
