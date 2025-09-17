"use client";
import React, { useState } from 'react';
import { 
  Home, 
  Settings, 
  Palette, 
  Layout, 
  Eye, 
  EyeOff, 
  ChevronUp, 
  ChevronDown,
  X,
  Edit3
} from 'lucide-react';

interface MobileEditorProps {
  selectedSection: string;
  editPanelView: 'main' | 'section' | 'business' | 'theme' | 'layout';
  pageContent: any;
  pageStyle: any;
  sectionState: {
    expandedSections: Record<string, boolean>;
    visibleSections: Record<string, boolean>;
    sectionOrder: string[];
  };
  onPageContentChange: (path: string, value: any) => void;
  onPageStyleChange: (path: string, value: any) => void;
  onSectionSelect: (sectionId: string) => void;
  onBackToMain: () => void;
  onSectionToggle: (sectionName: string) => void;
  onSectionVisibilityToggle: (sectionName: string) => void;
  onSectionOrderUpdate: (newOrder: string[]) => void;
  onClose: () => void;
}

export default function MobileEditor({
  selectedSection,
  editPanelView,
  pageContent,
  pageStyle,
  sectionState,
  onPageContentChange,
  onPageStyleChange,
  onSectionSelect,
  onBackToMain,
  onSectionToggle,
  onSectionVisibilityToggle,
  onSectionOrderUpdate,
  onClose
}: MobileEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'theme' | 'layout'>('sections');

  // Get section display info
  const getSectionInfo = (sectionId: string) => {
    const sectionMap: Record<string, { name: string; icon: string; color: string }> = {
      'business': { name: 'Business', icon: '🏢', color: 'bg-blue-500' },
      'hero': { name: 'Hero', icon: '🎯', color: 'bg-purple-500' },
      'problemSection': { name: 'Problem', icon: '⚠️', color: 'bg-red-500' },
      'features': { name: 'Features', icon: '✨', color: 'bg-green-500' },
      'socialProof': { name: 'Social Proof', icon: '👥', color: 'bg-yellow-500' },
      'pricing': { name: 'Pricing', icon: '💰', color: 'bg-indigo-500' },
      'guarantees': { name: 'Guarantees', icon: '🛡️', color: 'bg-pink-500' },
      'faq': { name: 'FAQ', icon: '❓', color: 'bg-orange-500' },
      'cta': { name: 'CTA', icon: '📢', color: 'bg-teal-500' },
      'urgency': { name: 'Urgency', icon: '⏰', color: 'bg-rose-500' }
    };
    return sectionMap[sectionId] || { name: sectionId, icon: '📄', color: 'bg-gray-500' };
  };

  // Quick section visibility toggle
  const handleQuickToggle = (sectionId: string) => {
    onSectionVisibilityToggle(sectionId);
  };

  // Section selection with auto-expand
  const handleSectionClick = (sectionId: string) => {
    onSectionSelect(sectionId);
    setIsExpanded(true);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-[#2D2D2D]">
      {/* Main Bottom Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Section Quick Access */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">Edit</span>
            {isExpanded ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronUp className="w-4 h-4 text-white" />}
          </button>
        </div>

        {/* Center: Quick Section Toggles */}
        <div className="flex items-center space-x-1">
          {sectionState.sectionOrder.slice(0, 4).map((sectionId) => {
            const sectionInfo = getSectionInfo(sectionId);
            const isVisible = sectionState.visibleSections[sectionId];
            return (
              <button
                key={sectionId}
                onClick={() => handleQuickToggle(sectionId)}
                className={`p-2 rounded-lg transition-all ${
                  isVisible 
                    ? `${sectionInfo.color} text-white` 
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
                title={`Toggle ${sectionInfo.name} section`}
              >
                <span className="text-sm">{sectionInfo.icon}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Close Button */}
        <button
          onClick={onClose}
          className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Expanded Editor Panel */}
      {isExpanded && (
        <div className="border-t border-[#2D2D2D] bg-black max-h-96 overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-[#2D2D2D]">
            <button
              onClick={() => setActiveTab('sections')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'sections'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sections
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'theme'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Theme
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'layout'
                  ? 'text-white border-b-2 border-blue-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Layout
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-h-64 overflow-y-auto">
            {activeTab === 'sections' && (
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-semibold text-white mb-3">Page Sections</h3>
                <div className="space-y-2">
                  {sectionState.sectionOrder.map((sectionId) => {
                    const sectionInfo = getSectionInfo(sectionId);
                    const isVisible = sectionState.visibleSections[sectionId];
                    const isSelected = selectedSection === sectionId;
                    
                    return (
                      <div
                        key={sectionId}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-[#2D2D2D] bg-neutral-900 hover:bg-neutral-800'
                        }`}
                      >
                        <button
                          onClick={() => handleSectionClick(sectionId)}
                          className="flex items-center space-x-3 flex-1 text-left"
                        >
                          <span className="text-lg">{sectionInfo.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-white">{sectionInfo.name}</div>
                            <div className="text-xs text-neutral-400">
                              {isVisible ? 'Visible' : 'Hidden'}
                            </div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleQuickToggle(sectionId)}
                          className={`p-2 rounded transition-colors ${
                            isVisible
                              ? 'text-green-400 hover:text-green-300'
                              : 'text-neutral-400 hover:text-neutral-300'
                          }`}
                        >
                          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'theme' && (
              <div className="p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Theme Settings</h3>
                
                {/* Theme Mode */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Theme Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onPageStyleChange('theme.mode', 'white')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        pageStyle?.theme?.mode === 'white'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-[#2D2D2D] bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => onPageStyleChange('theme.mode', 'black')}
                      className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                        pageStyle?.theme?.mode === 'black'
                          ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                          : 'border-[#2D2D2D] bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Accent Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['#6366f1', '#f03333', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'].map((color) => (
                      <button
                        key={color}
                        onClick={() => onPageStyleChange('theme.accentColor', color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          pageStyle?.theme?.accentColor === color
                            ? 'border-white scale-110'
                            : 'border-[#2D2D2D] hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layout' && (
              <div className="p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white mb-3">Layout Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Section Order</label>
                  <div className="space-y-2">
                    {sectionState.sectionOrder.map((sectionId, index) => {
                      const sectionInfo = getSectionInfo(sectionId);
                      return (
                        <div
                          key={sectionId}
                          className="flex items-center justify-between p-2 bg-neutral-800 rounded-lg"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-neutral-400">#{index + 1}</span>
                            <span className="text-sm">{sectionInfo.icon}</span>
                            <span className="text-sm text-white">{sectionInfo.name}</span>
                          </div>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => {
                                if (index > 0) {
                                  const newOrder = [...sectionState.sectionOrder];
                                  [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
                                  onSectionOrderUpdate(newOrder);
                                }
                              }}
                              disabled={index === 0}
                              className="p-1 text-neutral-400 hover:text-white disabled:opacity-50"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => {
                                if (index < sectionState.sectionOrder.length - 1) {
                                  const newOrder = [...sectionState.sectionOrder];
                                  [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
                                  onSectionOrderUpdate(newOrder);
                                }
                              }}
                              disabled={index === sectionState.sectionOrder.length - 1}
                              className="p-1 text-neutral-400 hover:text-white disabled:opacity-50"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
