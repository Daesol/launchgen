"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarState } from "../types/dashboard.types";

export function useSidebarState() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSidebarOverlay, setShowSidebarOverlay] = useState(false);
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const pathname = usePathname();

  // Check if we're on an edit page
  const isEditPage = pathname?.includes('/dashboard/page/');

  // Extract page ID from pathname
  useEffect(() => {
    if (isEditPage && pathname) {
      const match = pathname.match(/\/dashboard\/page\/([^\/]+)/);
      if (match) {
        setCurrentPageId(match[1]);
      }
    } else {
      setCurrentPageId(null);
    }
  }, [isEditPage, pathname]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setShowSidebarOverlay(!showSidebarOverlay);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    setShowSidebarOverlay(false);
  };

  const showSidebarOnHover = () => {
    setSidebarHovered(true);
    setShowSidebarOverlay(true);
  };

  const hideSidebarOnHover = () => {
    setSidebarHovered(false);
    setShowSidebarOverlay(false);
  };

  const startEditingTitle = () => {
    setEditingTitle(true);
  };

  const stopEditingTitle = () => {
    setEditingTitle(false);
  };

  const updatePageTitle = (title: string) => {
    setPageTitle(title);
  };

  return {
    sidebarOpen,
    showSidebarOverlay,
    sidebarHovered,
    editingTitle,
    pageTitle,
    currentPageId,
    isEditPage,
    toggleSidebar,
    closeSidebar,
    showSidebarOnHover,
    hideSidebarOnHover,
    startEditingTitle,
    stopEditingTitle,
    updatePageTitle
  };
}
