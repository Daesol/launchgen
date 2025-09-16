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
    <div className="flex items-center gap-6 bg-neutral-800 border border-[#2D2D2D] rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5 text-blue-400" />
        <div>
          <p className="text-neutral-400 text-xs">Views</p>
          <p className="text-lg font-bold text-white">{views.toLocaleString()}</p>
        </div>
      </div>
      
      <Separator orientation="vertical" className="h-12 bg-[#2D2D2D]" />
      
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-green-400" />
        <div>
          <p className="text-neutral-400 text-xs">Leads</p>
          <p className="text-lg font-bold text-white">{leads}</p>
        </div>
      </div>
      
      <Separator orientation="vertical" className="h-12 bg-[#2D2D2D]" />
      
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-purple-400" />
        <div>
          <p className="text-neutral-400 text-xs">Conversion</p>
          <p className="text-lg font-bold text-white">{conversionRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}
