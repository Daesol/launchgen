"use client";
import React, { memo, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import OptimizedPageCard from "./OptimizedPageCard";
import { formatDate, calculateConversionRate } from "@/lib/dashboard/utils";
import type { PageGridProps } from "@/lib/dashboard/types";

// Memoized PageGrid component for better performance
const OptimizedPageGrid = memo(function PageGrid({ 
  pages, 
  leadsByPage, 
  analyticsByPage, 
  onDelete
}: PageGridProps) {
  // Memoized formatDate function
  const memoizedFormatDate = useCallback(formatDate, []);

  // Memoized page cards data
  const pageCardsData = useMemo(() => {
    return pages.map((page: any) => {
      const pageLeads = leadsByPage[page.id]?.length || 0;
      const pageViews = analyticsByPage[page.id]?.views || 0;
      const pageSubmits = analyticsByPage[page.id]?.submits || 0;
      const conversionRate = calculateConversionRate(pageViews, pageSubmits);

      return {
        page,
        pageLeads,
        pageViews,
        conversionRate
      };
    });
  }, [pages, leadsByPage, analyticsByPage]);

  // Memoized delete handler
  const handleDelete = useCallback((id: string) => {
    const page = pages.find(p => p.id === id);
    if (page) {
      onDelete(page);
    }
  }, [onDelete, pages]);

  if (pages.length === 0) {
    return (
      <Card className="border border-[#2D2D2D]" style={{ backgroundColor: '#0A0A0A' }}>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No landing pages yet</h3>
          <p className="text-neutral-400 mb-6">Create your first landing page to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {pageCardsData.map(({ page, pageLeads, pageViews, conversionRate }) => (
        <OptimizedPageCard
          key={page.id}
          page={page}
          pageLeads={pageLeads}
          pageViews={pageViews}
          conversionRate={conversionRate}
          onDelete={handleDelete}
          formatDate={memoizedFormatDate}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.pages.length === nextProps.pages.length &&
    prevProps.pages.every((page, index) => 
      page.id === nextProps.pages[index]?.id &&
      page.title === nextProps.pages[index]?.title &&
      page.published === nextProps.pages[index]?.published
    ) &&
    JSON.stringify(prevProps.leadsByPage) === JSON.stringify(nextProps.leadsByPage) &&
    JSON.stringify(prevProps.analyticsByPage) === JSON.stringify(nextProps.analyticsByPage)
  );
});

export default OptimizedPageGrid;
