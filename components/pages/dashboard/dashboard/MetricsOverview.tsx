"use client";
import React from "react";
import { Eye, Users, Target, MousePointer } from "lucide-react";

interface MetricsOverviewProps {
  totalPages: number;
  totalLeads: number;
  totalViews: number;
  overallConversion: number;
}

export default function MetricsOverview({ 
  totalPages, 
  totalLeads, 
  totalViews, 
  overallConversion 
}: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-neutral-800 border border-[#2D2D2D] rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-neutral-400 text-xs">Total Pages</p>
            <p className="text-lg font-bold text-white">{totalPages}</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 border border-[#2D2D2D] rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-neutral-400 text-xs">Total Leads</p>
            <p className="text-lg font-bold text-white">{totalLeads}</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 border border-[#2D2D2D] rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <MousePointer className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <p className="text-neutral-400 text-xs">Total Views</p>
            <p className="text-lg font-bold text-white">{totalViews.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-neutral-800 border border-[#2D2D2D] rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <p className="text-neutral-400 text-xs">Conversion Rate</p>
            <p className="text-lg font-bold text-white">{overallConversion.toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
