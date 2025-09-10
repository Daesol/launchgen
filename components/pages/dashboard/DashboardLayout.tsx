"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import Chatbot from "@/components/widgets/Chatbot";
import ThemeToggle from "@/components/widgets/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/generate", label: "Create Page", icon: "➕" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSidebarOverlay, setShowSidebarOverlay] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createPagesBrowserClient();

  // Check if we're on an edit page
  const isEditPage = pathname?.includes('/dashboard/page/');

  // Extract page ID from pathname
  useEffect(() => {
    if (isEditPage && pathname) {
      const match = pathname.match(/\/dashboard\/page\/([^\/]+)/);
      if (match) {
        setCurrentPageId(match[1]);
      }
    }
  }, [isEditPage, pathname]);

  // Fetch user's pages
  const fetchPages = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: pages, error } = await supabase
        .from('landing_pages')
        .select('id, title, slug, created_at')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false });
      setPages(pages || []);
      
      // Set current page title if we're on an edit page
      if (currentPageId && pages) {
        const currentPage = pages.find(p => p.id === currentPageId);
        if (currentPage) {
          setPageTitle(currentPage.title || 'Untitled');
        }
      }
    }
    setLoading(false);
  };

  // Fetch current page data for title
  const fetchCurrentPage = async () => {
    if (currentPageId) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: page, error } = await supabase
            .from('landing_pages')
            .select('title')
            .eq('id', currentPageId)
            .eq('owner_id', session.user.id)
            .single();
          
          if (page && !error) {
            console.log('Setting page title from database:', page.title);
            setPageTitle(page.title || 'Untitled');
          } else {
            console.error('Error fetching page:', error);
            // Fallback: try to get title from pages list
            const fallbackPage = pages.find(p => p.id === currentPageId);
            if (fallbackPage) {
              console.log('Using fallback title from pages list:', fallbackPage.title);
              setPageTitle(fallbackPage.title || 'Untitled');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch current page:', error);
        // Fallback: try to get title from pages list
        const fallbackPage = pages.find(p => p.id === currentPageId);
        if (fallbackPage) {
          console.log('Using fallback title from pages list after error:', fallbackPage.title);
          setPageTitle(fallbackPage.title || 'Untitled');
        }
      }
    }
  };

  useEffect(() => {
    fetchPages();
  }, [supabase]);

  useEffect(() => {
    if (currentPageId) {
      console.log('Current page ID changed, fetching page data:', currentPageId);
      fetchCurrentPage();
    }
  }, [currentPageId]);

  // Listen for page refresh events
  useEffect(() => {
    const handlePageRefresh = () => {
      fetchPages();
      if (currentPageId) {
        fetchCurrentPage();
      }
    };

    window.addEventListener('refresh-pages', handlePageRefresh);
    return () => {
      window.removeEventListener('refresh-pages', handlePageRefresh);
    };
  }, [currentPageId]);

  // Listen for title update events from PageEditor
  useEffect(() => {
    const handleTitleUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.title) {
        setPageTitle(event.detail.title);
        // Also update local pages list
        setPages(prev => prev.map(p => 
          p.id === currentPageId ? { ...p, title: event.detail.title } : p
        ));
      }
    };

    const handleTitleSync = (event: CustomEvent) => {
      if (event.detail && event.detail.title) {
        console.log('Syncing title from PageEditor:', event.detail.title);
        setPageTitle(event.detail.title);
      }
    };

    window.addEventListener('update-page-title', handleTitleUpdate as EventListener);
    window.addEventListener('sync-page-title', handleTitleSync as EventListener);
    return () => {
      window.removeEventListener('update-page-title', handleTitleUpdate as EventListener);
      window.removeEventListener('sync-page-title', handleTitleSync as EventListener);
    };
  }, [currentPageId]);

  // Add body class to prevent scrolling on dashboard pages
  useEffect(() => {
    document.body.classList.add('dashboard-page');
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Handle title editing click outside
      if (editingTitle) {
        const target = event.target as Element;
        if (!target.closest('.title-input-container')) {
          handleTitleSave();
        }
      }
    };

    if (editingTitle) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [editingTitle]);

  // Handle mouse movement for sidebar overlay on edit pages
  useEffect(() => {
    if (!isEditPage) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 20) {
        setShowSidebarOverlay(true);
      } else if (e.clientX > 280) {
        setShowSidebarOverlay(false);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [isEditPage]);

  // Handle title editing
  const handleTitleEdit = () => {
    setEditingTitle(true);
  };

  const handleTitleSave = async () => {
    console.log('Saving title:', pageTitle, 'for page:', currentPageId);
    if (currentPageId && pageTitle.trim()) {
      try {
        const response = await fetch('/api/landing-pages', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: currentPageId,
            title: pageTitle.trim(),
          }),
        });

        if (response.ok) {
          const newTitle = pageTitle.trim();
          console.log('Title saved successfully:', newTitle);
          // Update local pages list
          setPages(prev => prev.map(p => 
            p.id === currentPageId ? { ...p, title: newTitle } : p
          ));
          
          // Dispatch event to notify PageEditor of title change
          window.dispatchEvent(new CustomEvent('page-title-updated', { 
            detail: { id: currentPageId, title: newTitle } 
          }));
          
          // Dispatch event to update other components
          window.dispatchEvent(new CustomEvent('update-page-title', { 
            detail: { title: newTitle } 
          }));
        } else {
          console.error('Failed to save title, response not ok:', response.status);
          // If save failed, revert to original title
          const currentPage = pages.find(p => p.id === currentPageId);
          if (currentPage) {
            setPageTitle(currentPage.title || 'Untitled');
          }
        }
      } catch (error) {
        console.error('Failed to update title:', error);
        // If save failed, revert to original title
        const currentPage = pages.find(p => p.id === currentPageId);
        if (currentPage) {
          setPageTitle(currentPage.title || 'Untitled');
        }
      }
    }
    setEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setEditingTitle(false);
      // Reset to original title
      if (currentPageId && pages) {
        const currentPage = pages.find(p => p.id === currentPageId);
        if (currentPage) {
          setPageTitle(currentPage.title || 'Untitled');
        }
      }
    }
  };

  const handleSignOut = async () => {
    await fetch("/api/signout", { method: "POST" });
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("sb-") || key.includes("supabase")) {
        localStorage.removeItem(key);
      }
    });
    setTimeout(() => {
      window.location.replace("/auth/signin");
    }, 200);
  };

  // If it's an edit page, render a minimal layout with overlay sidebar
  if (isEditPage) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden dashboard-layout">
        {/* Sidebar - Hidden on edit pages, shown as overlay */}
        {isEditPage && (
          <aside
            className={`fixed left-0 top-0 z-50 w-64 bg-white shadow-2xl border-r border-slate-200 transition-all duration-300 ${
              showSidebarOverlay ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
            }`}
            style={{ top: '64px', height: 'calc(100vh - 64px)' }}
          >
            <div className="flex flex-col h-full">
              {/* Navigation */}
              <nav className="px-4 py-4 space-y-3">
                {/* Dashboard */}
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Dashboard
                </button>
                
                {/* Create New Page */}
                <button
                  onClick={() => router.push('/dashboard/generate')}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  New Page
                </button>
                
                {/* Divider */}
                <div className="border-t border-slate-200 my-4"></div>
                
                {/* Your Pages - Scrollable */}
                <div className="flex-1 min-h-0">
                  <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Your Pages</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                    {pages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => router.push(`/dashboard/page/${page.id}`)}
                        className={`w-full flex items-center px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-left ${
                          currentPageId === page.id ? 'bg-slate-100 text-slate-800' : ''
                        }`}
                      >
                        <span className="truncate">{page.title || 'Untitled'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </aside>
        )}

        {/* Main content area - Full width for edit pages */}
        <div className="flex-1 flex flex-col h-full">
          {/* Top navbar - Enhanced with page title and action buttons */}
          <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Left side - LaunchGen logo and editable page title */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* LaunchGen Logo */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">🚀</span>
                  </div>
                  <span className="text-lg font-bold text-slate-800">LaunchGen</span>
                </div>
                
                {/* Separator */}
                <span className="text-slate-400 text-lg font-medium">/</span>
                
                {/* Editable page title */}
                <div className="flex-1 min-w-0 title-input-container">
                  {editingTitle ? (
                    <input
                      type="text"
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                      onBlur={handleTitleSave}
                      onKeyDown={handleTitleKeyDown}
                      className="w-full text-base font-medium text-slate-800 bg-transparent border-b-2 border-slate-300 focus:border-slate-600 focus:outline-none px-1 py-1"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={handleTitleEdit}
                      className="text-base font-medium text-slate-800 hover:text-slate-600 hover:bg-slate-50 px-2 py-1 rounded transition-colors text-left w-full truncate"
                      title="Click to edit title"
                    >
                      {pageTitle || 'Untitled'}
                    </button>
                  )}
                </div>
              </div>

              {/* Center - Action buttons */}
              <div className="flex items-center space-x-2 mx-4">
                {/* Theme Toggle */}
                <ThemeToggle />
                
                <div className="w-px h-6 bg-slate-300 mx-2"></div>
                
                {/* Desktop/Mobile view buttons */}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('set-preview-mode', { detail: 'desktop' }))}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                  title="Desktop view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('set-preview-mode', { detail: 'mobile' }))}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                  title="Mobile view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </button>

                <div className="w-px h-6 bg-slate-300 mx-2"></div>

                {/* Action buttons */}
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('preview-page'))}
                  className="px-3 py-1.5 text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded transition-colors"
                  title="Preview page"
                >
                  Preview
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('regenerate-page'))}
                  className="px-3 py-1.5 text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 rounded transition-colors"
                  title="Regenerate page"
                >
                  Regenerate
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('publish-page'))}
                  className="px-3 py-1.5 text-sm bg-slate-800 text-white hover:bg-slate-700 rounded transition-colors"
                  title="Publish page"
                >
                  Publish
                </button>
              </div>
              
              {/* Right side - Profile icon */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-sm"
                    title="Profile"
                  >
                    <span className="text-white font-semibold text-sm">U</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    className="text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <span className="text-sm mr-3">🚪</span>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content - Full width and height for edit pages */}
          <main className="flex-1 p-0 overflow-hidden">
            {children}
          </main>
        </div>
        
        {/* Chatbot */}
        <Chatbot webhookUrl="https://hook.us2.make.com/dr7nyyotheprkpszho9koo288wblvogc" />
      </div>
    );
  }

  // Regular dashboard layout for non-edit pages
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden dashboard-layout">
      {/* Sidebar */}
      <aside className={`fixed z-40 inset-y-0 left-0 w-64 bg-white shadow-xl border-r border-slate-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} lg:translate-x-0 lg:static lg:sticky lg:top-0 lg:h-screen`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">🚀</span>
          </div>
          <span className="text-xl font-bold text-slate-800">LaunchGen</span>
        </div>
        
        {/* Navigation Links */}
        <nav className="px-4 py-6 space-y-1">
          {sidebarLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 group"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Generated Pages Section */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="text-xs font-medium text-slate-500 px-4 mb-3">
            Your Pages
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-2 text-xs text-slate-400">Loading...</div>
            ) : pages.length === 0 ? (
              <div className="px-4 py-2 text-xs text-slate-400">No pages yet</div>
            ) : (
              pages.map(page => (
                <Link
                  key={page.id}
                  href={`/dashboard/page/${page.id}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors transition-all duration-200 group"
                  title={page.title || 'Untitled'}
                >
                  <span className="text-xs group-hover:scale-110 transition-transform duration-200">📄</span>
                  <span className="truncate">{page.title || 'Untitled'}</span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="flex-1"></div>

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
      <div className="flex-1 flex flex-col h-full lg:ml-0">
        {/* Top navbar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(v => !v)}
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-base font-semibold text-slate-800">Dashboard</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">U</span>
                </div>
                <span className="hidden sm:inline text-sm">Profile</span>
                <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 cursor-pointer"
                onClick={handleSignOut}
              >
                <span className="text-sm mr-3">🚪</span>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-1 overflow-hidden">
          {children}
        </main>
      </div>
      
      {/* Chatbot */}
      <Chatbot webhookUrl="https://hook.us2.make.com/dr7nyyotheprkpszho9koo288wblvogc" />
    </div>
  );
}