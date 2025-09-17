import React from 'react';
import { createBusinessHandlers, createHeroHandlers, createProblemHandlers, createFeaturesHandlers, createSocialProofHandlers, createPricingHandlers, createGuaranteesHandlers, createFAQHandlers, createCTAHandlers, createUrgencyHandlers } from '../utils/fieldHandlers';
import IconSelector, { HeroIconSelector, FeatureIconSelector, PainPointIconSelector, GuaranteeIconSelector } from '../common/IconSelector';
import MediaComponent from '@/components/features/media/MediaComponent';

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
      case 'pricing': return 'Pricing Section';
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
        return <FeaturesSectionEditor features={pageContent?.features || {}} onPageContentChange={onPageContentChange} pageContent={pageContent} />;
      
      case 'socialProof':
        return <SocialProofSectionEditor socialProof={pageContent?.socialProof || {}} onPageContentChange={onPageContentChange} pageContent={pageContent} />;
      
      case 'pricing':
        return <PricingSectionEditor pricing={pageContent?.pricing || {}} onPageContentChange={onPageContentChange} pageContent={pageContent} />;
      
      case 'guarantees':
        return <GuaranteesSectionEditor guarantees={pageContent?.guarantees || {}} onPageContentChange={onPageContentChange} />;
      
      case 'faq':
        return <FAQSectionEditor faq={pageContent?.faq || {}} onPageContentChange={onPageContentChange} pageContent={pageContent} />;
      
      case 'cta':
        return <CTASectionEditor cta={pageContent?.cta || {}} onPageContentChange={onPageContentChange} />;
      
      case 'urgency':
        return <UrgencySectionEditor urgency={pageContent?.urgency || {}} onPageContentChange={onPageContentChange} />;
      
      default:
        return <div className="text-xs text-neutral-400">Section editor not found</div>;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBack}
          className="p-1 text-neutral-400 hover:text-white transition-colors"
          title="Back to main panel"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-sm font-semibold text-white capitalize">
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
      <h4 className="text-sm font-medium text-white mb-3">Business Information</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Business Name</label>
          <input
            type="text"
            value={business?.name || ''}
            onChange={(e) => handlers.handleBusinessChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter your business name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Logo URL</label>
          <input
            type="text"
            value={business?.logo || ''}
            onChange={(e) => handlers.handleBusinessChange("logo", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
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
      <h4 className="text-sm font-medium text-white mb-3">Hero Section</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Hero Tag</label>
          <input
            type="text"
            value={hero?.heroTag || ''}
            onChange={(e) => handlers.handleHeroChange("heroTag", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="e.g., AI-Powered Solution"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Hero Tag Icon</label>
          <HeroIconSelector
            value={hero?.heroTagIcon || ''}
            onChange={(value) => handlers.handleHeroChange("heroTagIcon", value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Headline</label>
          <input
            type="text"
            value={hero?.headline || ''}
            onChange={(e) => handlers.handleHeroChange("headline", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter your main headline"
          />
        </div>
        
        {/* Highlight Words Section */}
        <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-3">
          <label className="block text-sm font-medium text-neutral-300 mb-2">Highlight Words</label>
          <p className="text-xs text-neutral-400 mb-3">Click on words in your headline to highlight them</p>
          {hero?.headline && (
            <div className="mb-3">
              <p className="text-sm text-neutral-400 mb-2">Headline:</p>
              <div className="flex flex-wrap gap-1">
                {hero.headline.split(' ').map((word: string, index: number) => {
                  const cleanWord = word.replace(/[^\w]/g, '');
                  const isHighlighted = hero?.headlineHighlights?.includes(cleanWord) || false;
                  return (
                    <button
                      key={index}
                      onClick={() => handlers.handleHighlightToggle(cleanWord)}
                      className={`px-2 py-1 text-sm rounded transition-colors ${
                        isHighlighted
                          ? 'bg-blue-500 text-white'
                          : 'bg-neutral-900 text-neutral-300 border border-[#2D2D2D] hover:bg-neutral-800'
                      }`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {hero?.headlineHighlights && hero.headlineHighlights.length > 0 && (
            <div>
              <p className="text-sm text-neutral-400 mb-2">Highlighted words:</p>
              <div className="flex flex-wrap gap-1">
                {hero.headlineHighlights
                  .filter((word: string) => {
                    // Only show highlighted words that actually exist in the current headline
                    const headlineWords = hero.headline?.split(' ').map((w: string) => w.replace(/[^\w]/g, '')) || [];
                    return headlineWords.includes(word);
                  })
                  .map((word: string, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Subheadline</label>
          <textarea
            value={hero?.subheadline || ''}
            onChange={(e) => handlers.handleHeroChange("subheadline", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white resize-none"
            rows={3}
            placeholder="Enter your subheadline"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">CTA Button Text</label>
          <input
            type="text"
            value={hero?.cta || ''}
            onChange={(e) => handlers.handleHeroChange("cta", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter CTA button text"
          />
        </div>

        {/* Media Section */}
        <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-sm font-medium text-white">Media Content</h5>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hero?.media?.enabled || false}
                onChange={(e) => {
                  const currentMedia = hero?.media || {
                    enabled: false,
                    type: 'image',
                    url: '',
                    file: '',
                    altText: '',
                    thumbnail: ''
                  };
                  handlers.handleHeroChange("media", {
                    ...currentMedia,
                    enabled: e.target.checked
                  });
                }}
                className="w-4 h-4 text-blue-600 bg-neutral-800 border-neutral-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-neutral-300">Enable Media</span>
            </label>
          </div>
          
          {hero?.media?.enabled && (
            <MediaComponent
              media={hero.media}
              theme={{ mode: 'black', accentColor: '#6366f1' }}
              onMediaChange={(newMedia) => handlers.handleHeroChange("media", newMedia)}
              isEditor={true}
              userId={undefined} // Will use auth.getUser() as fallback
            />
          )}
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
      <h4 className="text-sm font-medium text-white mb-3">Problem Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            value={problemSection?.title || ''}
            onChange={(e) => handlers.handleProblemChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter problem section title"
          />

        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Subtitle</label>
          <input
            type="text"
            value={problemSection?.subtitle || ''}
            onChange={(e) => handlers.handleProblemChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter problem section subtitle"
          />

        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Pain Points</label>
          <div className="space-y-3">
            {problemSection?.painPoints?.map((painPoint: any, idx: number) => (
              <div key={idx} className="space-y-3 p-3 border border-[#2D2D2D] rounded-md bg-neutral-900">
                <input
                  type="text"
                  value={painPoint?.text || ''}
                  onChange={(e) => handlers.handlePainPointChange(idx, "text", e.target.value)}
                  className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                  placeholder="Enter pain point"
                />
                <PainPointIconSelector
                  value={painPoint?.icon || ''}
                  onChange={(value) => handlers.handlePainPointChange(idx, "icon", value)}
                  className="w-full"
                />
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
              className="w-full px-3 py-2 border border-[#2D2D2D] border-dashed rounded-md text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 bg-neutral-900 transition-colors text-sm"
            >
              + Add Pain Point
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturesSectionEditor({ features, onPageContentChange, pageContent }: { features: any; onPageContentChange: (field: string, value: any) => void; pageContent: any }) {
  const handlers = createFeaturesHandlers(pageContent, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white mb-3">Features Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Features Title</label>
          <input
            type="text"
            value={pageContent?.featuresTitle || ''}
            onChange={(e) => onPageContentChange("featuresTitle", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter features title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Features Subtitle</label>
          <input
            type="text"
            value={pageContent?.featuresSubtitle || ''}
            onChange={(e) => onPageContentChange("featuresSubtitle", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter features subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Features</label>
          <div className="space-y-3">
            {pageContent?.features?.map((feature: any, idx: number) => (
              <div key={idx} className="space-y-3 p-3 border border-[#2D2D2D] rounded-md bg-neutral-900">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-neutral-400">Feature {idx + 1}</label>
                  <button
                    onClick={() => handlers.handleRemoveFeature(idx)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove feature"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Icon</label>
                  <FeatureIconSelector
                    value={feature?.icon || ''}
                    onChange={(value) => handlers.handleFeatureChange(idx, "icon", value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Title</label>
                  <input
                    type="text"
                    value={feature?.title || ''}
                    onChange={(e) => handlers.handleFeatureChange(idx, "title", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="Feature title"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={feature?.description || ''}
                    onChange={(e) => handlers.handleFeatureChange(idx, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="Feature description"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Benefit</label>
                  <input
                    type="text"
                    value={feature?.benefit || ''}
                    onChange={(e) => handlers.handleFeatureChange(idx, "benefit", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="What this means for you..."
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handlers.handleAddFeature}
              className="w-full px-3 py-2 border border-[#2D2D2D] border-dashed rounded-md text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 bg-neutral-900 transition-colors text-sm"
            >
              + Add Feature
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialProofSectionEditor({ socialProof, onPageContentChange, pageContent }: { socialProof: any; onPageContentChange: (field: string, value: any) => void; pageContent: any }) {
  const handlers = createSocialProofHandlers(pageContent, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white mb-3">Social Proof Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            value={socialProof?.title || ''}
            onChange={(e) => handlers.handleSocialProofChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter social proof title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Subtitle</label>
          <input
            type="text"
            value={socialProof?.subtitle || ''}
            onChange={(e) => handlers.handleSocialProofChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter social proof subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Stats</label>
          <div className="space-y-3">
            {socialProof?.stats?.map((stat: any, idx: number) => (
              <div key={idx} className="space-y-3 p-3 border border-[#2D2D2D] rounded-md bg-neutral-900">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-neutral-400">Stat {idx + 1}</label>
                  <button
                    onClick={() => handlers.handleRemoveStat(idx)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove stat"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Number</label>
                  <input
                    type="text"
                    value={stat?.number || ''}
                    onChange={(e) => handlers.handleStatChange(idx, "number", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="e.g., 10,000+"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Label</label>
                  <input
                    type="text"
                    value={stat?.label || ''}
                    onChange={(e) => handlers.handleStatChange(idx, "label", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="e.g., Happy Customers"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Description</label>
                  <input
                    type="text"
                    value={stat?.description || ''}
                    onChange={(e) => handlers.handleStatChange(idx, "description", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="e.g., Trusted by businesses worldwide"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handlers.handleAddStat}
              className="w-full px-3 py-2 border border-[#2D2D2D] border-dashed rounded-md text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 bg-neutral-900 transition-colors text-sm"
            >
              + Add Stat
            </button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Testimonials</label>
          <div className="space-y-3">
            {socialProof?.testimonials?.map((testimonial: any, idx: number) => (
              <div key={idx} className="space-y-3 p-3 border border-[#2D2D2D] rounded-md bg-neutral-900">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-neutral-400">Testimonial {idx + 1}</label>
                  <button
                    onClick={() => handlers.handleRemoveTestimonial(idx)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove testimonial"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Name</label>
                  <input
                    type="text"
                    value={testimonial?.name || ''}
                    onChange={(e) => handlers.handleTestimonialChange(idx, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Role</label>
                  <input
                    type="text"
                    value={testimonial?.role || ''}
                    onChange={(e) => handlers.handleTestimonialChange(idx, "role", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="e.g., CEO, Marketing Director"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Company</label>
                  <input
                    type="text"
                    value={testimonial?.company || ''}
                    onChange={(e) => handlers.handleTestimonialChange(idx, "company", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Quote</label>
                  <textarea
                    value={testimonial?.quote || ''}
                    onChange={(e) => handlers.handleTestimonialChange(idx, "quote", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="Customer testimonial quote"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Result (Optional)</label>
                  <input
                    type="text"
                    value={testimonial?.result || ''}
                    onChange={(e) => handlers.handleTestimonialChange(idx, "result", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                    placeholder="e.g., 300% increase in sales"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-400 mb-1">Rating</label>
                  <IconSelector
                    value={testimonial?.rating?.toString() || '5'}
                    onChange={(value) => handlers.handleTestimonialChange(idx, "rating", parseInt(value))}
                    className="w-full"
                    options={[
                      { value: '1', label: '1 Star' },
                      { value: '2', label: '2 Stars' },
                      { value: '3', label: '3 Stars' },
                      { value: '4', label: '4 Stars' },
                      { value: '5', label: '5 Stars' }
                    ]}
                    placeholder="Select rating"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={handlers.handleAddTestimonial}
              className="w-full px-3 py-2 border border-[#2D2D2D] border-dashed rounded-md text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 bg-neutral-900 transition-colors text-sm"
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
      <h4 className="text-sm font-medium text-white mb-3">Guarantees Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            value={guarantees?.title || ''}
            onChange={(e) => handlers.handleGuaranteesChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter guarantees title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Subtitle</label>
          <input
            type="text"
            value={guarantees?.subtitle || ''}
            onChange={(e) => handlers.handleGuaranteesChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter guarantees subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Guarantees</label>
          <div className="space-y-3">
            {guarantees?.guarantees?.map((guarantee: any, idx: number) => (
              <div key={idx} className="space-y-3 p-3 border border-[#2D2D2D] rounded-md bg-neutral-900">
                <GuaranteeIconSelector
                  value={guarantee?.icon || ''}
                  onChange={(value) => handlers.handleGuaranteeChange(idx, "icon", value)}
                  className="w-full"
                />
                <input
                  type="text"
                  value={guarantee?.title || ''}
                  onChange={(e) => handlers.handleGuaranteeChange(idx, "title", e.target.value)}
                  className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                  placeholder="Guarantee title"
                />
                <input
                  type="text"
                  value={guarantee?.description || ''}
                  onChange={(e) => handlers.handleGuaranteeChange(idx, "description", e.target.value)}
                  className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
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
              className="w-full px-3 py-2 border border-[#2D2D2D] border-dashed rounded-md text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 bg-neutral-900 transition-colors text-sm"
            >
              + Add Guarantee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQSectionEditor({ faq, onPageContentChange, pageContent }: { faq: any; onPageContentChange: (field: string, value: any) => void; pageContent: any }) {
  const handlers = createFAQHandlers(pageContent, onPageContentChange);
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-white mb-3">FAQ Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            value={faq?.title || ''}
            onChange={(e) => handlers.handleFAQChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter FAQ title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Subtitle</label>
          <input
            type="text"
            value={faq?.subtitle || ''}
            onChange={(e) => handlers.handleFAQChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter FAQ subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Questions & Answers</label>
          <div className="space-y-3">
            {faq?.questions?.map((qa: any, idx: number) => (
              <div key={idx} className="space-y-2 p-3 border border-[#2D2D2D] rounded-md bg-neutral-900">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={qa?.question || ''}
                    onChange={(e) => handlers.handleQAChange(idx, "question", e.target.value)}
                    className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
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
                  className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
                  placeholder="Answer"
                  rows={3}
                />
              </div>
            ))}
            <button
              onClick={handlers.handleAddQA}
              className="w-full px-3 py-2 border border-[#2D2D2D] border-dashed rounded-md text-neutral-400 hover:text-neutral-300 hover:border-neutral-600 bg-neutral-900 transition-colors text-sm"
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
      <h4 className="text-sm font-medium text-white mb-3">CTA Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Title</label>
          <input
            type="text"
            value={cta?.title || ''}
            onChange={(e) => handlers.handleCTAChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter CTA title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Subtitle</label>
          <input
            type="text"
            value={cta?.subtitle || ''}
            onChange={(e) => handlers.handleCTAChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="Enter CTA subtitle"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Button Text</label>
          <input
            type="text"
            value={cta?.buttonText || ''}
            onChange={(e) => handlers.handleCTAChange("buttonText", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
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
      <h4 className="text-sm font-medium text-white mb-3">Urgency Section</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Enable Urgency</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={urgency?.enabled || false}
              onChange={(e) => handlers.handleUrgencyChange("enabled", e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-neutral-400">Show urgency message</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Message</label>
          <input
            type="text"
            value={urgency?.message || ''}
            onChange={(e) => handlers.handleUrgencyChange("message", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="e.g., Limited Time Offer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Deadline</label>
          <input
            type="text"
            value={urgency?.deadline || ''}
            onChange={(e) => handlers.handleUrgencyChange("deadline", e.target.value)}
            className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
            placeholder="e.g., Ends in 24 hours"
          />
        </div>
      </div>
    </div>
  );
}


// Pricing Section Editor
function PricingSectionEditor({ pricing, onPageContentChange, pageContent }: { pricing: any; onPageContentChange: (field: string, value: any) => void; pageContent: any }) {
  const handlers = createPricingHandlers(pageContent, onPageContentChange);

  return (
    <div className="space-y-6">
      {/* Section Title */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Section Title</label>
        <input
          type="text"
          value={pricing?.title || ""}
          onChange={(e) => handlers.handlePricingChange("title", e.target.value)}
          className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
          placeholder="e.g., Simple Pricing"
        />
      </div>

      {/* Section Description */}
      <div>
        <label className="block text-sm font-medium text-white mb-2">Section Description</label>
        <input
          type="text"
          value={pricing?.description || ""}
          onChange={(e) => handlers.handlePricingChange("description", e.target.value)}
          className="w-full px-3 py-2 border border-[#2D2D2D] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-neutral-800 text-white"
          placeholder="e.g., Choose the plan that is right for you"
        />
      </div>

      {/* Pricing Plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-white">Pricing Plans</label>
          <button
            onClick={handlers.handleAddPlan}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Plan
          </button>
        </div>

        <div className="space-y-6">
          {(pricing?.plans || []).map((plan: any, planIndex: number) => (
            <div key={planIndex} className="border border-[#2D2D2D] rounded-lg p-4 bg-neutral-900">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-white">Plan {planIndex + 1}</h4>
                <button
                  onClick={() => handlers.handleRemovePlan(planIndex)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plan Name */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Plan Name</label>
                  <input
                    type="text"
                    value={plan.name || ""}
                    onChange={(e) => handlers.handlePlanChange(planIndex, "name", e.target.value)}
                    className="w-full px-2 py-1 border border-[#2D2D2D] rounded text-sm bg-neutral-800 text-white"
                    placeholder="e.g., Basic"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Price</label>
                  <input
                    type="text"
                    value={plan.price || ""}
                    onChange={(e) => handlers.handlePlanChange(planIndex, "price", e.target.value)}
                    className="w-full px-2 py-1 border border-[#2D2D2D] rounded text-sm bg-neutral-800 text-white"
                    placeholder="e.g., $29"
                  />
                </div>

                {/* Period */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Period</label>
                  <select
                    value={plan.period || "month"}
                    onChange={(e) => handlers.handlePlanChange(planIndex, "period", e.target.value)}
                    className="w-full px-2 py-1 border border-[#2D2D2D] rounded text-sm bg-neutral-800 text-white"
                  >
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                    <option value="contact">Contact</option>
                  </select>
                </div>

                {/* Popular */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={plan.popular || false}
                    onChange={(e) => handlers.handlePlanChange(planIndex, "popular", e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label className="text-xs text-neutral-300">Most Popular</label>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">Description</label>
                  <input
                    type="text"
                    value={plan.description || ""}
                    onChange={(e) => handlers.handlePlanChange(planIndex, "description", e.target.value)}
                    className="w-full px-2 py-1 border border-[#2D2D2D] rounded text-sm bg-neutral-800 text-white"
                    placeholder="e.g., Perfect for small teams"
                  />
                </div>

                {/* CTA Text */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">CTA Text</label>
                  <input
                    type="text"
                    value={plan.ctaText || ""}
                    onChange={(e) => handlers.handlePlanChange(planIndex, "ctaText", e.target.value)}
                    className="w-full px-2 py-1 border border-[#2D2D2D] rounded text-sm bg-neutral-800 text-white"
                    placeholder="e.g., Get Started"
                  />
                </div>

                {/* CTA Link */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">CTA Link</label>
                  <input
                    type="text"
                    value={plan.ctaLink || ""}
                    onChange={(e) => handlers.handlePlanChange(planIndex, "ctaLink", e.target.value)}
                    className="w-full px-2 py-1 border border-[#2D2D2D] rounded text-sm bg-neutral-800 text-white"
                    placeholder="e.g., # or https://..."
                  />
                </div>
              </div>

              {/* Features */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-neutral-300">Features</label>
                  <button
                    onClick={() => handlers.handleAddFeature(planIndex)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    + Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {(plan.features || []).map((feature: string, featureIndex: number) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handlers.handleUpdateFeature(planIndex, featureIndex, e.target.value)}
                        className="flex-1 px-2 py-1 border border-[#2D2D2D] rounded text-sm bg-neutral-800 text-white"
                        placeholder="e.g., 10GB Storage"
                      />
                      <button
                        onClick={() => handlers.handleRemoveFeature(planIndex, featureIndex)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
