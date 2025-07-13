"use client";
import React, { useState, useEffect, useRef } from "react";
import LandingPageTemplate from "./LandingPageTemplate";

interface PageEditorProps {
  initialConfig: any; // Should contain page_content, page_style, template_id, id (if editing)
  onSave?: (config: any) => void;
}

export default function PageEditor({ initialConfig, onSave }: PageEditorProps) {
  // Split initial config into content, style, template, id
  const {
    page_content: initialContent = {
      hero: { headline: '', subheadline: '', cta: '' },
      features: [],
    },
    page_style: initialStyle = {
      themeColors: {
        primaryColor: '#6366f1',
        secondaryColor: '#f1f5f9',
        accentColor: '#a21caf',
      },
    },
    template_id: initialTemplateId = 'default',
    id: initialId = undefined,
  } = initialConfig || {};

  const [pageContent, setPageContent] = useState<any>(initialContent);
  const [pageStyle, setPageStyle] = useState<any>(initialStyle);
  const [templateId, setTemplateId] = useState<string>(initialTemplateId);
  const [id, setId] = useState<string | undefined>(initialId);
  const [saving, setSaving] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [sidePanelCollapsed, setSidePanelCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showSidePanel, setShowSidePanel] = useState(false); // For mobile

  // Function to resize textarea to fit content
  const resizeTextarea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto';
    element.style.height = element.scrollHeight + 'px';
  };

  // Resize all textareas on initial load
  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      resizeTextarea(textarea);
    });
  }, [pageContent, pageStyle]); // Re-run when content changes

  // Inline editing handlers
  const handleHeroChange = (field: string, value: string) => {
    setPageContent((prev: any) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };
  const handleFeatureChange = (idx: number, value: any) => {
    setPageContent((prev: any) => {
      const features = [...prev.features];
      features[idx] = value;
      return { ...prev, features };
    });
  };
  const handleThemeColorChange = (field: string, value: string) => {
    setPageStyle((prev: any) => ({
      ...prev,
      themeColors: { ...prev.themeColors, [field]: value },
    }));
  };
  const handleAddFeature = () => {
    setPageContent((prev: any) => ({
      ...prev,
      features: [...prev.features, { title: "New Feature", description: "" }],
    }));
  };
  const handleRemoveFeature = (idx: number) => {
    setPageContent((prev: any) => {
      const features = prev.features.filter((_: any, i: number) => i !== idx);
      return { ...prev, features };
    });
  };

  // Save and publish handlers
  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/landing-pages", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          id,
          template_id: templateId,
          page_content: pageContent,
          page_style: pageStyle,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      if (onSave) onSave({ id: data.page.id, template_id: templateId, page_content: pageContent, page_style: pageStyle });
      setId(data.page.id); // Update id if new page
      setPublished(false);
    } catch (e: any) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };
  const handlePublish = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/landing-pages", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          id,
          template_id: templateId,
          page_content: pageContent,
          page_style: pageStyle,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish");
      setId(data.page.id);
      setPublished(true);
    } catch (e: any) {
      setError(e.message || "Failed to publish");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-full bg-slate-50 overflow-hidden">
      {/* Main Preview Area */}
      <div 
        className={`flex-1 relative transition-all duration-300`}
        style={{
          marginRight: sidePanelCollapsed ? '0px' : '320px'
        }}
      >
        {/* Preview Controls - Fixed Header */}
        <div 
          className="absolute top-0 left-0 right-0 bg-white border-b border-slate-200 px-3 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between z-20 gap-3"
          style={{
            paddingRight: sidePanelCollapsed ? '80px' : '24px'
          }}
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-base sm:text-lg font-semibold text-slate-800">Landing Page Preview</h1>
            <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                  previewMode === 'desktop' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors ${
                  previewMode === 'mobile' 
                    ? 'bg-white text-slate-800 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                Mobile
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-xs sm:text-sm"
              onClick={() => {
                // Save current state first, then open preview
                handleSave().then(() => {
                  if (id) {
                    window.open(`/page/${initialConfig.slug}`, '_blank');
                  }
                });
              }}
              disabled={saving}
            >
              Preview
            </button>
            <button
              className="bg-purple-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-60 text-xs sm:text-sm"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-60 text-xs sm:text-sm"
              onClick={handlePublish}
              disabled={saving}
            >
              {published ? "Published!" : "Publish"}
            </button>
            {/* Mobile Edit Button */}
            <button
              className="lg:hidden bg-slate-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-slate-700 transition-colors text-xs sm:text-sm"
              onClick={() => setShowSidePanel(!showSidePanel)}
            >
              Edit
            </button>
          </div>
        </div>

        {/* Preview Container - Scrollable Content */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-auto bg-slate-100 pt-20 sm:pt-20 px-3 sm:px-6 pb-6">
          <div className={`mx-auto transition-all duration-300 ${
            previewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
          }`}>
            <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${
              previewMode === 'mobile' ? 'border-8 border-slate-800 rounded-3xl' : ''
            }`}>
              <LandingPageTemplate 
                config={{ ...pageContent, themeColors: pageStyle.themeColors }} 
                pageId={id} 
                previewMode={previewMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Collapsible Side Panel - Desktop */}
      <aside className={`hidden lg:block fixed right-0 top-0 h-full bg-white shadow-xl border-l border-slate-200 flex flex-col transition-all duration-300 z-30 ${
        sidePanelCollapsed ? 'w-16' : 'w-80'
      }`} style={{ top: '64px', height: 'calc(100vh - 64px)' }}>
        {/* Panel Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">✏️</span>
          </div>
          <span className={`font-semibold text-slate-800 transition-opacity duration-300 ${sidePanelCollapsed ? 'opacity-0 w-0 overflow-hidden' : ''}`}>
            Edit Page
          </span>
          <button
            onClick={() => setSidePanelCollapsed(!sidePanelCollapsed)}
            className={`p-1.5 rounded-lg hover:bg-slate-100 transition-colors ${sidePanelCollapsed ? 'hidden' : ''}`}
            title="Collapse editor"
          >
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Panel Content */}
        <div className={`flex-1 overflow-y-auto ${sidePanelCollapsed ? 'hidden' : ''}`}>
          <div className="p-4 sm:p-6 space-y-6">
            {/* Hero Section */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Hero Section</h3>
              <div className="space-y-3">
          <div>
                  <label className="block text-slate-700 font-medium mb-1 text-xs sm:text-sm">Headline</label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm resize-none overflow-hidden"
              value={pageContent.hero.headline}
                    onChange={e => {
                      handleHeroChange("headline", e.target.value);
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onInput={e => {
                      // Auto-resize on input
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                    rows={1}
                    placeholder="Enter your headline..."
            />
          </div>
          <div>
                  <label className="block text-slate-700 font-medium mb-1 text-xs sm:text-sm">Subheadline</label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm resize-none overflow-hidden"
              value={pageContent.hero.subheadline}
                    onChange={e => {
                      handleHeroChange("subheadline", e.target.value);
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onInput={e => {
                      // Auto-resize on input
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                    rows={1}
                    placeholder="Enter your subheadline..."
            />
          </div>
          <div>
                  <label className="block text-slate-700 font-medium mb-1 text-xs sm:text-sm">Call to Action</label>
                  <textarea
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm resize-none overflow-hidden"
              value={pageContent.hero.cta}
                    onChange={e => {
                      handleHeroChange("cta", e.target.value);
                      // Auto-resize
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onInput={e => {
                      // Auto-resize on input
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                    rows={1}
                    placeholder="Enter your call to action..."
            />
          </div>
              </div>
            </div>

            {/* Features Section */}
          <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Features</h3>
              <div className="space-y-3">
            {pageContent.features.map((feature: any, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="space-y-2">
                      <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm resize-none overflow-hidden"
                  placeholder="Feature Title"
                  value={feature.title}
                        onChange={e => {
                          handleFeatureChange(idx, { ...feature, title: e.target.value });
                          // Auto-resize
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onInput={e => {
                          // Auto-resize on input
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                        rows={1}
                      />
                      <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-xs sm:text-sm resize-none overflow-hidden"
                  placeholder="Feature Description"
                  value={feature.description}
                        onChange={e => {
                          handleFeatureChange(idx, { ...feature, description: e.target.value });
                          // Auto-resize
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onInput={e => {
                          // Auto-resize on input
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                        rows={2}
                />
                <button
                  type="button"
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                  onClick={() => handleRemoveFeature(idx)}
                      >
                        Remove Feature
                      </button>
                    </div>
              </div>
            ))}
            <button
              type="button"
                  className="w-full px-3 py-2 text-xs sm:text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
              onClick={handleAddFeature}
                >
                  + Add Feature
                </button>
              </div>
          </div>

            {/* Theme Colors */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4">Theme Colors</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">Primary</label>
              <input
                type="color"
                value={pageStyle.themeColors?.primaryColor || '#6366f1'}
                onChange={e => handleThemeColorChange("primaryColor", e.target.value)}
                    className="w-full h-8 sm:h-10 p-0 border border-slate-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
                  <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">Secondary</label>
              <input
                type="color"
                value={pageStyle.themeColors?.secondaryColor || '#f1f5f9'}
                onChange={e => handleThemeColorChange("secondaryColor", e.target.value)}
                    className="w-full h-8 sm:h-10 p-0 border border-slate-300 rounded-lg cursor-pointer"
              />
            </div>
            <div>
                  <label className="block text-slate-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">Accent</label>
              <input
                type="color"
                value={pageStyle.themeColors?.accentColor || '#a21caf'}
                onChange={e => handleThemeColorChange("accentColor", e.target.value)}
                    className="w-full h-8 sm:h-10 p-0 border border-slate-300 rounded-lg cursor-pointer"
              />
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-600 text-xs sm:text-sm">{error}</div>
              </div>
            )}
            {published && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-600 text-xs sm:text-sm">Landing page published!</div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsed State Icons */}
        {sidePanelCollapsed && (
          <div className="flex-1 flex flex-col items-center py-4">
            <button
              onClick={() => setSidePanelCollapsed(false)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              title="Expand editor"
            >
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile Side Panel Overlay */}
      {showSidePanel && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowSidePanel(false)}>
          <div className="fixed right-0 top-0 h-full w-80 max-w-[90vw] bg-white shadow-xl border-l border-slate-200 flex flex-col z-50" onClick={e => e.stopPropagation()}>
            {/* Mobile Panel Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✏️</span>
                </div>
                <span className="font-semibold text-slate-800">Edit Page</span>
              </div>
              <button
                onClick={() => setShowSidePanel(false)}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Panel Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-6">
                {/* Hero Section */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Hero Section</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1 text-sm">Headline</label>
                      <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none overflow-hidden"
                        value={pageContent.hero.headline}
                        onChange={e => {
                          handleHeroChange("headline", e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onInput={e => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                        rows={1}
                        placeholder="Enter your headline..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1 text-sm">Subheadline</label>
                      <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none overflow-hidden"
                        value={pageContent.hero.subheadline}
                        onChange={e => {
                          handleHeroChange("subheadline", e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onInput={e => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                        rows={1}
                        placeholder="Enter your subheadline..."
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1 text-sm">Call to Action</label>
                      <textarea
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none overflow-hidden"
                        value={pageContent.hero.cta}
                        onChange={e => {
                          handleHeroChange("cta", e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onInput={e => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = target.scrollHeight + 'px';
                        }}
                        rows={1}
                        placeholder="Enter your call to action..."
                      />
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Features</h3>
                  <div className="space-y-3">
                    {pageContent.features.map((feature: any, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="space-y-2">
                          <textarea
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none overflow-hidden"
                            placeholder="Feature Title"
                            value={feature.title}
                            onChange={e => {
                              handleFeatureChange(idx, { ...feature, title: e.target.value });
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            onInput={e => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = target.scrollHeight + 'px';
                            }}
                            rows={1}
                          />
                          <textarea
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none overflow-hidden"
                            placeholder="Feature Description"
                            value={feature.description}
                            onChange={e => {
                              handleFeatureChange(idx, { ...feature, description: e.target.value });
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            onInput={e => {
                              const target = e.target as HTMLTextAreaElement;
                              target.style.height = 'auto';
                              target.style.height = target.scrollHeight + 'px';
                            }}
                            rows={2}
                          />
          <button
                            type="button"
                            className="text-xs text-red-500 hover:text-red-700 transition-colors"
                            onClick={() => handleRemoveFeature(idx)}
                          >
                            Remove Feature
          </button>
                        </div>
                      </div>
                    ))}
          <button
                      type="button"
                      className="w-full px-3 py-2 text-sm text-purple-600 border border-purple-300 rounded-lg hover:bg-purple-50 transition-colors"
                      onClick={handleAddFeature}
                    >
                      + Add Feature
          </button>
        </div>
      </div>

                {/* Theme Colors */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Theme Colors</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-2 text-sm">Primary</label>
                      <input
                        type="color"
                        value={pageStyle.themeColors?.primaryColor || '#6366f1'}
                        onChange={e => handleThemeColorChange("primaryColor", e.target.value)}
                        className="w-full h-10 p-0 border border-slate-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2 text-sm">Secondary</label>
                      <input
                        type="color"
                        value={pageStyle.themeColors?.secondaryColor || '#f1f5f9'}
                        onChange={e => handleThemeColorChange("secondaryColor", e.target.value)}
                        className="w-full h-10 p-0 border border-slate-300 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-2 text-sm">Accent</label>
                      <input
                        type="color"
                        value={pageStyle.themeColors?.accentColor || '#a21caf'}
                        onChange={e => handleThemeColorChange("accentColor", e.target.value)}
                        className="w-full h-10 p-0 border border-slate-300 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-red-600 text-sm">{error}</div>
                  </div>
                )}
                {published && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-green-600 text-sm">Landing page published!</div>
                  </div>
                )}
              </div>
            </div>
          </div>
      </div>
      )}
    </div>
  );
} 