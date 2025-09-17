"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardHeaderProps {
  user?: { email?: string; user_metadata?: { full_name?: string } } | null;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome, {userName}</h1>
        <p className="text-neutral-400">Manage your landing pages and track performance</p>
      </div>
      <Link href="/dashboard/page/new">
        <Button className="bg-white hover:bg-neutral-100 text-black font-medium px-6 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Create New Page
        </Button>
      </Link>
    </div>
  );
}
