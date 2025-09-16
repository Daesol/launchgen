"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface PerformanceChartProps {
  chartData: any[];
}

export default function PerformanceChart({ chartData }: PerformanceChartProps) {
  return (
    <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Performance Over Time
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Views and conversions over the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500">Chart visualization coming soon</p>
            <p className="text-neutral-600 text-sm">Performance data will be displayed here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
