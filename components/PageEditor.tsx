"use client";
import React, { useState } from "react";
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
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Editor Panel */}
      <div className="w-full md:w-1/2 bg-white/90 rounded-xl shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Edit Landing Page</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-1">Headline</label>
            <input
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-500 text-black"
              value={pageContent.hero.headline}
              onChange={e => handleHeroChange("headline", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Subheadline</label>
            <input
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-500 text-black"
              value={pageContent.hero.subheadline}
              onChange={e => handleHeroChange("subheadline", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Call to Action</label>
            <input
              className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-purple-500 text-black"
              value={pageContent.hero.cta}
              onChange={e => handleHeroChange("cta", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">Features</label>
            {pageContent.features.map((feature: any, idx: number) => (
              <div key={idx} className="flex flex-col gap-2 mb-2 p-2 bg-slate-50 rounded">
                <input
                  className="w-full px-3 py-1 border rounded text-black"
                  placeholder="Feature Title"
                  value={feature.title}
                  onChange={e => handleFeatureChange(idx, { ...feature, title: e.target.value })}
                />
                <input
                  className="w-full px-3 py-1 border rounded text-black"
                  placeholder="Feature Description"
                  value={feature.description}
                  onChange={e => handleFeatureChange(idx, { ...feature, description: e.target.value })}
                />
                <button
                  type="button"
                  className="text-xs text-red-500 mt-1 self-end"
                  onClick={() => handleRemoveFeature(idx)}
                >Remove</button>
              </div>
            ))}
            <button
              type="button"
              className="text-xs text-purple-600 mt-2"
              onClick={handleAddFeature}
            >+ Add Feature</button>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Primary Color</label>
              <input
                type="color"
                value={pageStyle.themeColors?.primaryColor || '#6366f1'}
                onChange={e => handleThemeColorChange("primaryColor", e.target.value)}
                className="w-10 h-10 p-0 border-none bg-transparent"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Secondary Color</label>
              <input
                type="color"
                value={pageStyle.themeColors?.secondaryColor || '#f1f5f9'}
                onChange={e => handleThemeColorChange("secondaryColor", e.target.value)}
                className="w-10 h-10 p-0 border-none bg-transparent"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-medium mb-1">Accent Color</label>
              <input
                type="color"
                value={pageStyle.themeColors?.accentColor || '#a21caf'}
                onChange={e => handleThemeColorChange("accentColor", e.target.value)}
                className="w-10 h-10 p-0 border-none bg-transparent"
              />
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        {published && <div className="text-green-600 text-sm mt-4">Landing page published!</div>}
        <div className="flex gap-4 mt-8">
          <button
            className="bg-purple-600 text-white px-6 py-2 rounded font-semibold hover:bg-purple-700 transition disabled:opacity-60"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 transition disabled:opacity-60"
            onClick={handlePublish}
            disabled={saving}
          >
            {published ? "Published!" : "Publish"}
          </button>
        </div>
      </div>
      {/* Live Preview Panel */}
      <div className="w-full md:w-1/2">
        <LandingPageTemplate config={{ ...pageContent, themeColors: pageStyle.themeColors }} pageId={id} />
      </div>
    </div>
  );
} 