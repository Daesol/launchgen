import React from 'react';
import { createBusinessHandlers, createHeroHandlers, createProblemHandlers, createFeaturesHandlers, createSocialProofHandlers, createGuaranteesHandlers, createFAQHandlers, createCTAHandlers, createUrgencyHandlers } from '../utils/fieldHandlers';

interface SectionPanelProps {
  sectionId: string;
  pageContent: any;
  onPageContentChange: (field: string, value: any) => void;
  onBack: () => void;
}

export default function SectionPanel({ sectionId, pageContent, onPageContentChange, onBack }: SectionPanelProps) {
  // Get section display name
  const getSectionDisplayName = (sectionId: string) => {
    switch (sectionId) {
      case 'business': return 'Business Information';
      case 'hero': return 'Hero Section';
      case 'problemSection': return 'Problem Section';
      case 'features': return 'Features Section';
      case 'socialProof': return 'Social Proof Section';
      case 'guarantees': return 'Guarantees Section';
      case 'faq': return 'FAQ Section';
      case 'cta': return 'CTA Section';
      case 'urgency': return 'Urgency Section';
      default: return sectionId;
    }
  };

  // Render the appropriate section editor based on sectionId
  const renderSectionEditor = () => {
    switch (sectionId) {
      case 'business':
        return <BusinessSectionEditor business={pageContent?.business || {}} onPageContentChange={onPageContentChange} />;
      
      case 'hero':
        return <HeroSectionEditor hero={pageContent?.hero || {}} onPageContentChange={onPageContentChange} />;
      
      case 'problemSection':
        return <ProblemSectionEditor problemSection={pageContent?.problemSection || {}} onPageContentChange={onPageContentChange} />;
      
      case 'features':
        return <FeaturesSectionEditor features={pageContent?.features || {}} onPageContentChange={onPageContentChange} />;
      
      case 'socialProof':
        return <SocialProofSectionEditor socialProof={pageContent?.socialProof || {}} onPageContentChange={onPageContentChange} />;
      
      case 'guarantees':
        return <GuaranteesSectionEditor guarantees={pageContent?.guarantees || {}} onPageContentChange={onPageContentChange} />;
      
      case 'faq':
        return <FAQSectionEditor faq={pageContent?.faq || {}} onPageContentChange={onPageContentChange} />;
      
      case 'cta':
        return <CTASectionEditor cta={pageContent?.cta || {}} onPageContentChange={onPageContentChange} />;
      
      case 'urgency':
        return <UrgencySectionEditor urgency={pageContent?.urgency || {}} onPageContentChange={onPageContentChange} />;
      
      default:
        return <div className="text-xs text-slate-500">Section editor not found</div>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="p-1 text-slate-500 hover:text-slate-700 transition-colors"
          title="Back to main panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-slate-800 capitalize">
          {getSectionDisplayName(sectionId)} Editor
        </h3>
      </div>
      
      {renderSectionEditor()}
    </div>
  );
}

// Individual section editors - these will be moved to separate files later
function BusinessSectionEditor({ business, onPageContentChange }: { business: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createBusinessHandlers({ business } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">Business Information</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Business Name</label>
          <input
            type="text"
            value={business?.name || ''}
            onChange={(e) => handlers.handleBusinessChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter your business name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Logo URL</label>
          <input
            type="text"
            value={business?.logo || ''}
            onChange={(e) => handlers.handleBusinessChange("logo", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter logo URL or leave empty for default"
          />
        </div>
      </div>
    </div>
  );
}

function HeroSectionEditor({ hero, onPageContentChange }: { hero: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createHeroHandlers({ hero } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">Hero Section</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Headline</label>
          <input
            type="text"
            value={hero?.headline || ''}
            onChange={(e) => handlers.handleHeroChange("headline", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter your main headline"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Subheadline</label>
          <textarea
            value={hero?.subheadline || ''}
            onChange={(e) => handlers.handleHeroChange("subheadline", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm resize-none"
            rows={3}
            placeholder="Enter your subheadline"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">CTA Button Text</label>
          <input
            type="text"
            value={hero?.cta || ''}
            onChange={(e) => handlers.handleHeroChange("cta", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter CTA button text"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hero Tag</label>
          <input
            type="text"
            value={hero?.heroTag || ''}
            onChange={(e) => handlers.handleHeroChange("heroTag", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="e.g., AI-Powered Solution"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Hero Tag Icon</label>
          <select
            value={hero?.heroTagIcon || ''}
            onChange={(e) => handlers.handleHeroChange("heroTagIcon", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
          >
            <option value="">Select an icon</option>
            <option value="rocket">🚀</option>
            <option value="lightning">⚡</option>
            <option value="lightbulb">💡</option>
            <option value="target">🎯</option>
            <option value="fire">🔥</option>
            <option value="star">⭐</option>
            <option value="diamond">💎</option>
            <option value="helicopter">🚁</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// Placeholder for other section editors - these will be implemented in separate files
function ProblemSectionEditor({ problemSection, onPageContentChange }: { problemSection: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createProblemHandlers({ problemSection } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">Problem Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
          <input
            type="text"
            value={problemSection?.title || ''}
            onChange={(e) => handlers.handleProblemChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter problem section title"
          />

        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={problemSection?.subtitle || ''}
            onChange={(e) => handlers.handleProblemChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter problem section subtitle"
          />

        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Pain Points</label>
          <div className="space-y-3">
            {problemSection?.painPoints?.map((painPoint: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={painPoint?.text || ''}
                  onChange={(e) => handlers.handlePainPointChange(idx, "text", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Enter pain point"
                />
                <select
                  value={painPoint?.icon || ''}
                  onChange={(e) => handlers.handlePainPointChange(idx, "icon", e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                >
                  <option value="">Select icon</option>
                  <option value="warning">⚠️</option>
                  <option value="cross">❌</option>
                  <option value="exclamation">❗</option>
                  <option value="question">❓</option>
                  <option value="clock">⏰</option>
                  <option value="money">💰</option>
                  <option value="time">⏱️</option>
                  <option value="stress">😰</option>
                </select>
                <button
                  onClick={() => handlers.handleRemovePainPoint(idx)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove pain point"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={handlers.handleAddPainPoint}
              className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors text-sm"
            >
              + Add Pain Point
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesSectionEditor({ features, onPageContentChange }: { features: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createFeaturesHandlers({ features } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">Features Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Features Title</label>
          <input
            type="text"
            value={features?.title || ''}
            onChange={(e) => handlers.handleFeaturesChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter features title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Features Subtitle</label>
          <input
            type="text"
            value={features?.subtitle || ''}
            onChange={(e) => handlers.handleFeaturesChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter features subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Features</label>
          <div className="space-y-3">
            {features?.features?.map((feature: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={feature?.icon || ''}
                  onChange={(e) => handlers.handleFeatureChange(idx, "icon", e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                >
                  <option value="">Select icon</option>
                  <option value="rocket">🚀</option>
                  <option value="lightning">⚡</option>
                  <option value="lightbulb">💡</option>
                  <option value="target">🎯</option>
                  <option value="fire">🔥</option>
                  <option value="star">⭐</option>
                  <option value="diamond">💎</option>
                  <option value="shield">🛡️</option>
                  <option value="check">✅</option>
                </select>
                <input
                  type="text"
                  value={feature?.title || ''}
                  onChange={(e) => handlers.handleFeatureChange(idx, "title", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Feature title"
                />
                <input
                  type="text"
                  value={feature?.description || ''}
                  onChange={(e) => handlers.handleFeatureChange(idx, "description", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Feature description"
                />
                <button
                  onClick={() => handlers.handleRemoveFeature(idx)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove feature"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={handlers.handleAddFeature}
              className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors text-sm"
            >
              + Add Feature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialProofSectionEditor({ socialProof, onPageContentChange }: { socialProof: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createSocialProofHandlers({ socialProof } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">Social Proof Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
          <input
            type="text"
            value={socialProof?.title || ''}
            onChange={(e) => handlers.handleSocialProofChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter social proof title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={socialProof?.subtitle || ''}
            onChange={(e) => handlers.handleSocialProofChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter social proof subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Stats</label>
          <div className="space-y-3">
            {socialProof?.stats?.map((stat: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={stat?.label || ''}
                  onChange={(e) => handlers.handleStatChange(idx, "label", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Stat label"
                />
                <input
                  type="text"
                  value={stat?.value || ''}
                  onChange={(e) => handlers.handleStatChange(idx, "value", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Stat value"
                />
                <button
                  onClick={() => handlers.handleRemoveStat(idx)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove stat"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={handlers.handleAddStat}
              className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors text-sm"
            >
              + Add Stat
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Testimonials</label>
          <div className="space-y-3">
            {socialProof?.testimonials?.map((testimonial: any, idx: number) => (
              <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testimonial?.name || ''}
                    onChange={(e) => handlers.handleTestimonialChange(idx, "name", e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                    placeholder="Customer name"
                  />
                  <input
                    type="text"
                    value={testimonial?.title || ''}
                    onChange={(e) => handlers.handleTestimonialChange(idx, "title", e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                    placeholder="Customer title"
                  />
                  <button
                    onClick={() => handlers.handleRemoveTestimonial(idx)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove testimonial"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <textarea
                  value={testimonial?.text || ''}
                  onChange={(e) => handlers.handleTestimonialChange(idx, "text", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Customer testimonial"
                  rows={3}
                />
              </div>
            ))}
            <button
              onClick={handlers.handleAddTestimonial}
              className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors text-sm"
            >
              + Add Testimonial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GuaranteesSectionEditor({ guarantees, onPageContentChange }: { guarantees: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createGuaranteesHandlers({ guarantees } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">Guarantees Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
          <input
            type="text"
            value={guarantees?.title || ''}
            onChange={(e) => handlers.handleGuaranteesChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter guarantees title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={guarantees?.subtitle || ''}
            onChange={(e) => handlers.handleGuaranteesChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter guarantees subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Guarantees</label>
          <div className="space-y-3">
            {guarantees?.guarantees?.map((guarantee: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={guarantee?.icon || ''}
                  onChange={(e) => handlers.handleGuaranteeChange(idx, "icon", e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                >
                  <option value="">Select icon</option>
                  <option value="shield">🛡️</option>
                  <option value="check">✅</option>
                  <option value="star">⭐</option>
                  <option value="heart">❤️</option>
                  <option value="lock">🔒</option>
                  <option value="thumbsup">👍</option>
                  <option value="award">🏆</option>
                  <option value="certificate">📜</option>
                </select>
                <input
                  type="text"
                  value={guarantee?.title || ''}
                  onChange={(e) => handlers.handleGuaranteeChange(idx, "title", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Guarantee title"
                />
                <input
                  type="text"
                  value={guarantee?.description || ''}
                  onChange={(e) => handlers.handleGuaranteeChange(idx, "description", e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Guarantee description"
                />
                <button
                  onClick={() => handlers.handleRemoveGuarantee(idx)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove guarantee"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={handlers.handleAddGuarantee}
              className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors text-sm"
            >
              + Add Guarantee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSectionEditor({ faq, onPageContentChange }: { faq: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createFAQHandlers({ faq } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">FAQ Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
          <input
            type="text"
            value={faq?.title || ''}
            onChange={(e) => handlers.handleFAQChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter FAQ title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={faq?.subtitle || ''}
            onChange={(e) => handlers.handleFAQChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter FAQ subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Questions & Answers</label>
          <div className="space-y-3">
            {faq?.questions?.map((qa: any, idx: number) => (
              <div key={idx} className="space-y-2 p-3 border border-slate-200 rounded-md">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={qa?.question || ''}
                    onChange={(e) => handlers.handleQAChange(idx, "question", e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                    placeholder="Question"
                  />
                  <button
                    onClick={() => handlers.handleRemoveQA(idx)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove Q&A"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <textarea
                  value={qa?.answer || ''}
                  onChange={(e) => handlers.handleQAChange(idx, "answer", e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
                  placeholder="Answer"
                  rows={3}
                />
              </div>
            ))}
            <button
              onClick={handlers.handleAddQA}
              className="w-full px-3 py-2 border border-slate-300 border-dashed rounded-md text-slate-500 hover:text-slate-700 hover:border-slate-400 transition-colors text-sm"
            >
              + Add Question & Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CTASectionEditor({ cta, onPageContentChange }: { cta: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createCTAHandlers({ cta } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">CTA Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Title</label>
          <input
            type="text"
            value={cta?.title || ''}
            onChange={(e) => handlers.handleCTAChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter CTA title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={cta?.subtitle || ''}
            onChange={(e) => handlers.handleCTAChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter CTA subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Button Text</label>
          <input
            type="text"
            value={cta?.buttonText || ''}
            onChange={(e) => handlers.handleCTAChange("buttonText", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="Enter button text"
          />
        </div>
      </div>
    </div>
  );
}

function UrgencySectionEditor({ urgency, onPageContentChange }: { urgency: any; onPageContentChange: (field: string, value: any) => void }) {
  const handlers = createUrgencyHandlers({ urgency } as any, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-slate-800 mb-3">Urgency Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Enable Urgency</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={urgency?.enabled || false}
              onChange={(e) => handlers.handleUrgencyChange("enabled", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-slate-600">Show urgency message</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
          <input
            type="text"
            value={urgency?.message || ''}
            onChange={(e) => handlers.handleUrgencyChange("message", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="e.g., Limited Time Offer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Deadline</label>
          <input
            type="text"
            value={urgency?.deadline || ''}
            onChange={(e) => handlers.handleUrgencyChange("deadline", e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
            placeholder="e.g., Ends in 24 hours"
          />
        </div>
      </div>
    </div>
  );
}
