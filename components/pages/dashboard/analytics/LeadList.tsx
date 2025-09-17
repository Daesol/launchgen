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
          Lead Collection
        </CardTitle>
        <CardDescription className="text-neutral-400">
          All leads captured from this landing page
        </CardDescription>
        <div className="text-sm text-neutral-500 mt-1">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'} captured
        </div>
      </CardHeader>
      <CardContent>
        {leads.length > 0 ? (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {leads.map((lead: any) => (
              <div key={lead.id} className="bg-neutral-800 rounded-lg border border-[#2D2D2D] p-3">
                {/* Desktop layout */}
                <div className="hidden lg:flex items-start gap-3">
                  <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-5 h-5 text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-neutral-500 text-xs">{formatDate(lead.created_at)}</p>
                      {lead.source && (
                        <Badge variant="outline" className="border-[#2D2D2D] text-neutral-400 text-xs">
                          {lead.source}
                        </Badge>
                      )}
                    </div>
                    <p className="text-white font-normal truncate">{lead.name || lead.email}</p>
                    {lead.name && (
                      <p className="text-neutral-400 text-sm font-normal truncate">{lead.email}</p>
                    )}
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-neutral-700 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-neutral-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-neutral-500 text-xs">{formatDate(lead.created_at)}</p>
                        {lead.source && (
                          <Badge variant="outline" className="border-[#2D2D2D] text-neutral-400 text-xs">
                            {lead.source}
                          </Badge>
                        )}
                      </div>
                      <p className="text-white font-normal truncate">{lead.name || lead.email}</p>
                      {lead.name && (
                        <p className="text-neutral-400 text-sm font-normal truncate">{lead.email}</p>
                      )}
                    </div>
                  </div>
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
