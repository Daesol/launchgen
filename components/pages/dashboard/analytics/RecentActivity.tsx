"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface RecentActivityProps {
  recentEvents: Array<{
    event_type: string;
    created_at: string;
  }>;
  formatDate: (dateString: string) => string;
}

export default function RecentActivity({ recentEvents, formatDate }: RecentActivityProps) {
  return (
    <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Latest visitor interactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {recentEvents.length > 0 ? (
          <div className="space-y-3">
            {recentEvents.slice(0, 10).map((event: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-neutral-300 text-sm">
                    {event.event_type === 'page_view' ? 'Page viewed' : 'Form submitted'}
                  </p>
                  <p className="text-neutral-500 text-xs">
                    {formatDate(event.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">No recent activity</p>
        )}
      </CardContent>
    </Card>
  );
}
