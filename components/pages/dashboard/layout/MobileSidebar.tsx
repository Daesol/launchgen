"use client";
import { DashboardPage } from "../types/dashboard.types";

interface MobileSidebarProps {
  sidebarOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ sidebarOpen, onClose }: MobileSidebarProps) {
  if (!sidebarOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-30 bg-black/20 lg:hidden" 
      onClick={onClose} 
    />
  );
}
