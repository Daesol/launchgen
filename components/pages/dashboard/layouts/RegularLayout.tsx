"use client";
import React from "react";
import Chatbot from "@/components/widgets/Chatbot";
import Sidebar from "../layout/Sidebar";
import Header from "../layout/Header";
import MobileSidebar from "../layout/MobileSidebar";

interface RegularLayoutProps {
  children: React.ReactNode;
  pages: any[];
  currentPageId: string | null;
  isEditPage: boolean;
  showSidebarOverlay: boolean;
  sidebarOpen: boolean;
  sidebarHovered?: boolean;
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
}

export default function RegularLayout({
  children,
  pages,
  currentPageId,
  isEditPage,
  showSidebarOverlay,
  sidebarOpen,
  sidebarHovered = false,
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
  onSignOut
}: RegularLayoutProps) {
  return (
    <div className="flex h-screen bg-black overflow-hidden dashboard-layout">
      {/* Sidebar */}
      <Sidebar
        pages={pages}
        currentPageId={currentPageId}
        isEditPage={isEditPage}
        showSidebarOverlay={showSidebarOverlay}
        sidebarHovered={sidebarHovered}
        onPageClick={onPageClick}
      />

      {/* Mobile sidebar overlay */}
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        onClose={onCloseSidebar}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full lg:ml-0">
        {/* Top navbar */}
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
