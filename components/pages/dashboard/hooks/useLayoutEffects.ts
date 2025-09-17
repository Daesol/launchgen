"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useLayoutEffects(
  isEditPage: boolean,
  editingTitle: boolean,
  handleTitleSave: () => void,
  refetch: () => void,
  showSidebarOnHover?: () => void,
  hideSidebarOnHover?: () => void
) {
  const router = useRouter();

  // Handle page refresh events
  useEffect(() => {
    const handlePageRefresh = () => {
      refetch();
    };

    window.addEventListener('refresh-pages', handlePageRefresh);
    return () => {
      window.removeEventListener('refresh-pages', handlePageRefresh);
    };
  }, [refetch]);

  // Add/remove dashboard page class
  useEffect(() => {
    document.body.classList.add('dashboard-page');
    return () => {
      document.body.classList.remove('dashboard-page');
    };
  }, []);

  // Handle click outside to save title
  useEffect(() => {
    if (!editingTitle) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.title-input-container')) {
        handleTitleSave();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [editingTitle, handleTitleSave]);

  // Handle mouse movement for sidebar overlay on edit pages
  useEffect(() => {
    if (!isEditPage || !showSidebarOnHover) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (e.clientX <= 20) {
        // Show sidebar overlay when mouse is near left edge
        showSidebarOnHover();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isEditPage, showSidebarOnHover]);
}
