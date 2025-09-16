"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, User } from "lucide-react";

interface LeadListProps {
  leads: Array<{
    id: string;
    name?: string;
    email: string;
    created_at: string;
    source?: string;
  }>;
  formatDate: (dateString: string) => string;
}

export default function LeadList({ leads, formatDate }: LeadListProps) {
  return (
    <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Lead Collection ({leads.length})
        </CardTitle>
        <CardDescription className="text-neutral-400">
          All leads captured from this landing page
        </CardDescription>
      </CardHeader>
      <CardContent>
        {leads.length > 0 ? (
          <div className="space-y-4">
            {leads.map((lead: any) => (
              <div key={lead.id} className="flex items-center gap-4 p-4 bg-neutral-800 rounded-lg border border-[#2D2D2D]">
                <div className="w-10 h-10 bg-neutral-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-neutral-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{lead.name || 'Anonymous'}</p>
                  <p className="text-neutral-400 text-sm">{lead.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-neutral-500 text-sm">{formatDate(lead.created_at)}</p>
                  {lead.source && (
                    <Badge variant="outline" className="border-[#2D2D2D] text-neutral-400 text-xs mt-1">
                      {lead.source}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Mail className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500">No leads captured yet</p>
            <p className="text-neutral-600 text-sm">Leads will appear here once visitors submit your form</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
