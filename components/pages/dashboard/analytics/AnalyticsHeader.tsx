"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit3, ExternalLink, Trash2 } from "lucide-react";

interface AnalyticsHeaderProps {
  page: {
    id: string;
    title: string;
    slug: string;
  };
  onDelete: () => void;
}

export default function AnalyticsHeader({ page, onDelete }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white">{page.title}</h1>
        <p className="text-neutral-400 text-sm">Analytics & Performance</p>
      </div>
      
      {/* Desktop: Horizontal button layout */}
      <div className="hidden lg:flex items-center gap-3">
        <Link href={`/dashboard/page/${page.id}`}>
          <Button 
            variant="outline" 
            className="border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
            style={{ backgroundColor: '#0A0A0A' }}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Page
          </Button>
        </Link>
        <Link href={`/page/${page.slug}`} target="_blank">
          <Button 
            variant="outline" 
            className="border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
            style={{ backgroundColor: '#0A0A0A' }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-600"
          style={{ backgroundColor: '#0A0A0A' }}
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Mobile: Stacked button layout */}
      <div className="flex flex-col gap-2 lg:hidden">
        <div className="flex gap-2">
          <Link href={`/dashboard/page/${page.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
              style={{ backgroundColor: '#0A0A0A' }}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href={`/page/${page.slug}`} target="_blank" className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
              style={{ backgroundColor: '#0A0A0A' }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live
            </Button>
          </Link>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-600"
          style={{ backgroundColor: '#0A0A0A' }}
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Page
        </Button>
      </div>
    </div>
  );
}
