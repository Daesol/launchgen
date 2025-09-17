"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

interface TrafficSourcesProps {
  trafficSources: Record<string, number>;
}

export default function TrafficSources({ trafficSources }: TrafficSourcesProps) {
  return (
    <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Traffic Sources
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Where your visitors are coming from
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(trafficSources).length > 0 ? (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {Object.entries(trafficSources).map(([source, count]: [string, any]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-neutral-300 text-sm truncate mr-2" title={source}>
                  {source.length > 30 ? `${source.substring(0, 30)}...` : source}
                </span>
                <Badge variant="outline" className="border-[#2D2D2D] text-neutral-400 flex-shrink-0">
                  {count} visits
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 text-sm">No traffic data available yet</p>
        )}
      </CardContent>
    </Card>
  );
}
