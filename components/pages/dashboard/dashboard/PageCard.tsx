"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShineBorder } from "@/components/magicui/shine-border";
import { 
  Edit3, 
  ExternalLink, 
  Trash2, 
  ArrowUpRight,
  Calendar,
  Eye,
  Users,
  Target
} from "lucide-react";

interface PageCardProps {
  page: {
    id: string;
    title: string;
    description: string;
    created_at: string;
    published: boolean;
    slug: string;
  };
  pageLeads: number;
  pageViews: number;
  conversionRate: number;
  onDelete: (id: string) => void;
  formatDate: (dateString: string) => string;
}

export default function PageCard({ 
  page, 
  pageLeads, 
  pageViews, 
  conversionRate, 
  onDelete, 
  formatDate 
}: PageCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/analytics/${page.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/page/${page.id}`);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/page/${page.slug}`, '_blank');
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(page.id);
  };

  return (
    <Card 
      className="cursor-pointer group relative overflow-hidden hover:border-neutral-600 transition-all duration-200"
      onClick={handleCardClick}
    >
      <ShineBorder
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        shineColor="#A07CFE"
        borderWidth={1}
        duration={3}
      />
      <CardContent className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">
              {page.title}
            </h3>
            <p className="text-neutral-400 text-sm line-clamp-2 mb-2">
              {page.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge 
                variant={page.published ? "default" : "secondary"}
                className={page.published 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : "bg-neutral-700 text-neutral-300 border-neutral-600"
                }
              >
                {page.published ? "Published" : "Draft"}
              </Badge>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-white">{pageLeads}</span>
            </div>
            <p className="text-xs text-neutral-400">Leads</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">{pageViews}</span>
            </div>
            <p className="text-xs text-neutral-400">Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-white">{conversionRate.toFixed(1)}%</span>
            </div>
            <p className="text-xs text-neutral-400">Conversion</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-neutral-500 text-xs">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(page.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-white border-[#2D2D2D] hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
              style={{ backgroundColor: '#0A0A0A' }}
              onClick={handleEditClick}
            >
              <Edit3 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-white border-[#2D2D2D] hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
              style={{ backgroundColor: '#0A0A0A' }}
              onClick={handleViewClick}
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-2 text-red-400 border-red-800 hover:bg-red-900/20 hover:text-red-300 hover:border-red-600"
              style={{ backgroundColor: '#0A0A0A' }}
              onClick={handleDeleteClick}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
