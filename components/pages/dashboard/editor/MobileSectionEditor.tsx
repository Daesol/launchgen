"use client";
import React from 'react';
import { X, ChevronLeft } from 'lucide-react';
import SectionPanel from '../../../features/editor/panels/SectionPanel';

interface MobileSectionEditorProps {
  selectedSection: string;
  pageContent: any;
  onPageContentChange: (field: string, value: any) => void;
  onBack: () => void;
  onClose: () => void;
}

export default function MobileSectionEditor({
  selectedSection,
  pageContent,
  onPageContentChange,
  onBack,
  onClose
}: MobileSectionEditorProps) {
  // Get section display name
  const getSectionDisplayName = (sectionId: string) => {
    switch (sectionId) {
      case 'business': return 'Business Information';
      case 'hero': return 'Hero Section';
      case 'problemSection': return 'Problem Section';
      case 'features': return 'Features Section';
      case 'socialProof': return 'Social Proof Section';
      case 'pricing': return 'Pricing Section';
      case 'guarantees': return 'Guarantees Section';
      case 'faq': return 'FAQ Section';
      case 'cta': return 'CTA Section';
      case 'urgency': return 'Urgency Section';
      default: return sectionId;
    }
  };

  return (
    <div className="lg:hidden fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#2D2D2D] bg-black">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold text-white">
            {getSectionDisplayName(selectedSection)}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="h-full overflow-y-auto bg-black">
        <div className="p-4">
          <SectionPanel
            sectionId={selectedSection}
            pageContent={pageContent}
            onPageContentChange={onPageContentChange}
            onBack={onBack}
          />
        </div>
      </div>
    </div>
  );
}
