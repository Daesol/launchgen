"use client";
import React from "react";
import EditorSection from "./EditorSection";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  result: string;
}

interface Stat {
  number: string;
  label: string;
  description: string;
}

interface SocialProofSectionProps {
  socialProof: {
    title: string;
    subtitle: string;
    testimonials: Testimonial[];
    stats: Stat[];
  };
  onSocialProofChange: (field: string, value: any) => void;
  onTestimonialsChange: (idx: number, value: any) => void;
  onStatsChange: (idx: number, value: any) => void;
  onAddTestimonial: () => void;
  onAddStat: () => void;
  onRemoveTestimonial: (idx: number) => void;
  onRemoveStat: (idx: number) => void;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function SocialProofSection({
  socialProof,
  onSocialProofChange,
  onTestimonialsChange,
  onStatsChange,
  onAddTestimonial,
  onAddStat,
  onRemoveTestimonial,
  onRemoveStat,
  isExpanded,
  onToggle,
  isVisible,
  onToggleVisibility,
}: SocialProofSectionProps) {
  // Provide default values if socialProof is undefined
  const safeSocialProof = socialProof || {
    title: '',
    subtitle: '',
    testimonials: [],
    stats: []
  };
  return (
    <EditorSection
      title="Social Proof"
      isExpanded={isExpanded}
      onToggle={onToggle}
      isVisible={isVisible}
      onToggleVisibility={onToggleVisibility}
      showVisibilityToggle={true}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Title
          </label>
          <input
            type="text"
            value={safeSocialProof.title}
            onChange={(e) => onSocialProofChange("title", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., What Our Customers Say, Social Proof"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Section Subtitle
          </label>
          <textarea
            value={safeSocialProof.subtitle}
            onChange={(e) => onSocialProofChange("subtitle", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Describe your social proof"
          />
        </div>
        
        {/* Testimonials */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-700">Testimonials</h4>
            <button
              onClick={onAddTestimonial}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Testimonial
            </button>
          </div>
          
          {safeSocialProof.testimonials.map((testimonial, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-600">Testimonial {idx + 1}</h5>
                <button
                  onClick={() => onRemoveTestimonial(idx)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => onTestimonialsChange(idx, { ...testimonial, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={testimonial.role}
                    onChange={(e) => onTestimonialsChange(idx, { ...testimonial, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Job title"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  value={testimonial.company}
                  onChange={(e) => onTestimonialsChange(idx, { ...testimonial, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote</label>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => onTestimonialsChange(idx, { ...testimonial, quote: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  placeholder="Customer testimonial"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <select
                    value={testimonial.rating}
                    onChange={(e) => onTestimonialsChange(idx, { ...testimonial, rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
                  <input
                    type="text"
                    value={testimonial.result}
                    onChange={(e) => onTestimonialsChange(idx, { ...testimonial, result: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Increased sales by 50%"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Stats */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-medium text-gray-700">Statistics</h4>
            <button
              onClick={onAddStat}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Stat
            </button>
          </div>
          
          {safeSocialProof.stats.map((stat, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-medium text-gray-600">Stat {idx + 1}</h5>
                <button
                  onClick={() => onRemoveStat(idx)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                  <input
                    type="text"
                    value={stat.number}
                    onChange={(e) => onStatsChange(idx, { ...stat, number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10,000+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => onStatsChange(idx, { ...stat, label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Happy Customers"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={stat.description}
                  onChange={(e) => onStatsChange(idx, { ...stat, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  placeholder="Brief description of the stat"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </EditorSection>
  );
} 