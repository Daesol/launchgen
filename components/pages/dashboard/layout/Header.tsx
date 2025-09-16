"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  isEditPage: boolean;
  pageTitle: string;
  editingTitle: boolean;
  onToggleSidebar: () => void;
  onStartEditingTitle: () => void;
  onStopEditingTitle: () => void;
  onUpdatePageTitle: (title: string) => void;
  onTitleSave: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent) => void;
  onSignOut: () => void;
}

export default function Header({
  isEditPage,
  pageTitle,
  editingTitle,
  onToggleSidebar,
  onStartEditingTitle,
  onStopEditingTitle,
  onUpdatePageTitle,
  onTitleSave,
  onTitleKeyDown,
  onSignOut
}: HeaderProps) {
  if (isEditPage) {
    return (
      <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - LaunchGen logo and editable page title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* LaunchGen Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">🚀</span>
              </div>
              <span className="text-lg font-bold text-white">LaunchGen</span>
            </div>
            
            {/* Separator */}
            <span className="text-neutral-400 text-lg font-medium">/</span>
            
            {/* Editable page title */}
            <div className="flex-1 min-w-0 title-input-container">
              {editingTitle ? (
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => onUpdatePageTitle(e.target.value)}
                  onBlur={onTitleSave}
                  onKeyDown={onTitleKeyDown}
                  className="w-full text-base font-medium text-white bg-transparent border-b-2 border-[#2D2D2D] focus:border-neutral-400 focus:outline-none px-1 py-1"
                  autoFocus
                />
              ) : (
                <button
                  onClick={onStartEditingTitle}
                  className="text-base font-medium text-white hover:text-neutral-300 hover:bg-neutral-800 px-2 py-1 rounded transition-colors text-left w-full truncate"
                  title="Click to edit title"
                >
                  {pageTitle || 'Untitled'}
                </button>
              )}
            </div>
          </div>

          {/* Center - Action buttons */}
          <div className="flex items-center space-x-2 mx-4">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('preview-page'))}
              className="px-3 py-1.5 text-sm border border-[#2D2D2D] text-white hover:bg-neutral-800 hover:border-neutral-600 rounded transition-colors"
              style={{ backgroundColor: '#0A0A0A' }}
              title="Preview page"
            >
              Preview
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('publish-page'))}
              className="px-3 py-1.5 text-sm bg-slate-800 text-white hover:bg-slate-700 rounded transition-colors"
              title="Publish page"
            >
              Publish
            </button>
          </div>

          {/* Right side - Profile dropdown */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 border border-[#2D2D2D] rounded-lg font-medium text-neutral-300 hover:bg-neutral-700 hover:border-[#2D2D2D] transition-all duration-200 shadow-sm">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white to-neutral-300 flex items-center justify-center">
                    <span className="text-black font-semibold text-xs">U</span>
                  </div>
                  <span className="hidden sm:inline text-sm">Profile</span>
                  <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-black border-[#2D2D2D]">
                <DropdownMenuItem
                  className="text-red-400 hover:bg-red-900/20 cursor-pointer"
                  onClick={onSignOut}
                >
                  <span className="text-sm mr-3">🚪</span>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-20 bg-black/80 backdrop-blur-sm border-b border-[#2D2D2D] flex items-center justify-between px-6 py-2">
      <div className="flex items-center gap-3">
        <button 
          className="lg:hidden p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          onClick={onToggleSidebar}
        >
          <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-base font-semibold text-white">Dashboard</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 border border-[#2D2D2D] rounded-lg font-medium text-neutral-300 hover:bg-neutral-700 hover:border-[#2D2D2D] transition-all duration-200 shadow-sm">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-white to-neutral-300 flex items-center justify-center">
                <span className="text-black font-semibold text-xs">U</span>
              </div>
              <span className="hidden sm:inline text-sm">Profile</span>
              <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black border-[#2D2D2D]">
            <DropdownMenuItem
              className="text-red-400 hover:bg-red-900/20 cursor-pointer"
              onClick={onSignOut}
            >
              <span className="text-sm mr-3">🚪</span>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
