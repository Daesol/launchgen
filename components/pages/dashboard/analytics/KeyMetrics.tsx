"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Eye, Users, Target } from "lucide-react";

interface KeyMetricsProps {
  views: number;
  leads: number;
  conversionRate: number;
}

export default function KeyMetrics({ views, leads, conversionRate }: KeyMetricsProps) {
  return (
    <div className="bg-neutral-800 border border-[#2D2D2D] rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-neutral-400 text-xs">Views</p>
            <p className="text-sm font-medium text-white">{views.toLocaleString()}</p>
          </div>
        </div>
        
        <Separator orientation="vertical" className="h-8 bg-[#2D2D2D]" />
        
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-green-400" />
          <div>
            <p className="text-neutral-400 text-xs">Leads</p>
            <p className="text-sm font-medium text-white">{leads}</p>
          </div>
        </div>
        
        <Separator orientation="vertical" className="h-8 bg-[#2D2D2D]" />
        
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-purple-400" />
          <div>
            <p className="text-neutral-400 text-xs">Conversion</p>
            <p className="text-sm font-medium text-white">{conversionRate.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
