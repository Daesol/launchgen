"use client";
import React from "react";
import Chatbot from "@/components/widgets/Chatbot";
import Sidebar from "../layout/Sidebar";
import MobileSidebar from "../layout/MobileSidebar";
import Header from "../layout/Header";

interface EditPageLayoutProps {
  children: React.ReactNode;
  pages: any[];
  currentPageId: string | null;
  isEditPage: boolean;
  showSidebarOverlay: boolean;
  sidebarOpen: boolean;
  pageTitle: string;
  editingTitle: boolean;
  onPageClick: (page: any) => void;
  onToggleSidebar: () => void;
  onCloseSidebar: () => void;
  onStartEditingTitle: () => void;
  onStopEditingTitle: () => void;
  onUpdatePageTitle: (title: string) => void;
  onTitleSave: () => void;
  onTitleKeyDown: (e: React.KeyboardEvent) => void;
  onSignOut: () => void;
  onSidebarMouseLeave?: () => void;
}

export default function EditPageLayout({
  children,
  pages,
  currentPageId,
  isEditPage,
  showSidebarOverlay,
  sidebarOpen,
  pageTitle,
  editingTitle,
  onPageClick,
  onToggleSidebar,
  onCloseSidebar,
  onStartEditingTitle,
  onStopEditingTitle,
  onUpdatePageTitle,
  onTitleSave,
  onTitleKeyDown,
  onSignOut,
  onSidebarMouseLeave
}: EditPageLayoutProps) {
  return (
    <div className="flex h-screen bg-black overflow-hidden dashboard-layout">
      {/* Desktop Sidebar - Hidden on mobile, shown as overlay on edit pages */}
      <div className="hidden lg:block">
        <Sidebar
          pages={pages}
          currentPageId={currentPageId}
          isEditPage={isEditPage}
          showSidebarOverlay={showSidebarOverlay}
          onPageClick={onPageClick}
          onSidebarMouseLeave={onSidebarMouseLeave}
        />
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        onClose={onCloseSidebar}
        pages={pages}
        currentPageId={currentPageId}
        onPageClick={onPageClick}
      />

      {/* Main content area - Full width for edit pages */}
      <div className="flex-1 flex flex-col h-full">
        {/* Top navbar - Enhanced with page title and action buttons */}
        <Header
          isEditPage={isEditPage}
          pageTitle={pageTitle}
          editingTitle={editingTitle}
          onToggleSidebar={onToggleSidebar}
          onStartEditingTitle={onStartEditingTitle}
          onStopEditingTitle={onStopEditingTitle}
          onUpdatePageTitle={onUpdatePageTitle}
          onTitleSave={onTitleSave}
          onTitleKeyDown={onTitleKeyDown}
          onSignOut={onSignOut}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto dashboard-scroll">
          {children}
        </main>
      </div>
      
      {/* Chatbot */}
      <Chatbot webhookUrl="https://hook.us2.make.com/dr7nyyotheprkpszho9koo288wblvogc" />
    </div>
  );
}
