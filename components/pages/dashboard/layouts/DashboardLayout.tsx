"use client";
import React from "react";
import { useRouter } from "next/navigation";
import EditPageLayout from "./EditPageLayout";
import RegularLayout from "./RegularLayout";
import { useDashboardData } from "../hooks/useDashboardData";
import { usePageManagement } from "../hooks/usePageManagement";
import { useSidebarState } from "../hooks/useSidebarState";
import { useTitleManagement } from "../hooks/useTitleManagement";
import { useLayoutEffects } from "../hooks/useLayoutEffects";
import { useAuthActions } from "../hooks/useAuthActions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Custom hooks
  const { data, loading, error, refetch } = useDashboardData();
  const { 
    sidebarOpen, 
    showSidebarOverlay, 
    sidebarHovered,
    currentPageId,
    isEditPage,
    toggleSidebar,
    closeSidebar,
    showSidebarOnHover,
    hideSidebarOnHover
  } = useSidebarState();
  
  const { handleDelete, handleEdit, handleView, handleAnalytics } = usePageManagement();
  const { handleSignOut } = useAuthActions();
  
  const {
    editingTitle,
    pageTitle,
    startEditingTitle,
    stopEditingTitle,
    updatePageTitle,
    handleTitleSave,
    handleTitleKeyDown
  } = useTitleManagement(currentPageId);

  // Layout effects
  useLayoutEffects(isEditPage, editingTitle, handleTitleSave, refetch, showSidebarOnHover, hideSidebarOnHover);

  // Handle page click
  const handlePageClick = (page: any) => {
    handleEdit(page);
  };

  // If it's an edit page, render the edit layout
  if (isEditPage) {
    return (
      <EditPageLayout
        pages={data.pages}
        currentPageId={currentPageId}
        isEditPage={isEditPage}
        showSidebarOverlay={showSidebarOverlay}
        pageTitle={pageTitle}
        editingTitle={editingTitle}
        onPageClick={handlePageClick}
        onToggleSidebar={toggleSidebar}
        onStartEditingTitle={startEditingTitle}
        onStopEditingTitle={stopEditingTitle}
        onUpdatePageTitle={updatePageTitle}
        onTitleSave={handleTitleSave}
        onTitleKeyDown={handleTitleKeyDown}
        onSignOut={handleSignOut}
      >
        {children}
      </EditPageLayout>
    );
  }

  // Regular dashboard layout for non-edit pages
  return (
    <RegularLayout
      pages={data.pages}
      currentPageId={currentPageId}
      isEditPage={isEditPage}
      showSidebarOverlay={showSidebarOverlay}
      sidebarOpen={sidebarOpen}
      sidebarHovered={sidebarHovered}
      pageTitle={pageTitle}
      editingTitle={editingTitle}
      onPageClick={handlePageClick}
      onToggleSidebar={toggleSidebar}
      onCloseSidebar={closeSidebar}
      onStartEditingTitle={startEditingTitle}
      onStopEditingTitle={stopEditingTitle}
      onUpdatePageTitle={updatePageTitle}
      onTitleSave={handleTitleSave}
      onTitleKeyDown={handleTitleKeyDown}
      onSignOut={handleSignOut}
    >
      {children}
    </RegularLayout>
  );
}
