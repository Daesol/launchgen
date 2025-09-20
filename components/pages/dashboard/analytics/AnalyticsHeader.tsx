"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit3, ExternalLink, Trash2, Globe, EyeOff, Copy, Check, Edit2 } from "lucide-react";

interface AnalyticsHeaderProps {
  page: {
    id: string;
    title: string;
    slug: string;
    published: boolean;
  };
  onDelete: () => void;
  onUrlUpdate?: (newSlug: string) => void;
}

export default function AnalyticsHeader({ page, onDelete, onUrlUpdate }: AnalyticsHeaderProps) {
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [editedSlug, setEditedSlug] = useState(page.slug);
  const [isUpdatingUrl, setIsUpdatingUrl] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [copied, setCopied] = useState(false);
  const [urlValidationWarning, setUrlValidationWarning] = useState("");

  const fullUrl = `${window.location.origin}/page/${page.slug}`;

  // URL validation function
  const validateUrlSlug = (slug: string) => {
    // Check for invalid characters in URL slug
    const invalidChars = /[^a-zA-Z0-9\-_]/g;
    const matches = slug.match(invalidChars);
    
    if (matches) {
      const uniqueChars = Array.from(new Set(matches));
      return `Invalid characters: ${uniqueChars.join(', ')}. Only letters, numbers, hyphens, and underscores are allowed.`;
    }
    
    return "";
  };

  // Handle URL input changes with space-to-dash conversion and validation
  const handleSlugChange = (value: string) => {
    // Convert spaces to dashes
    const convertedValue = value.replace(/\s+/g, '-');
    
    // Update the slug
    setEditedSlug(convertedValue);
    
    // Validate and show warning
    const warning = validateUrlSlug(convertedValue);
    setUrlValidationWarning(warning);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handleUrlSave = async () => {
    if (editedSlug === page.slug) {
      setIsEditingUrl(false);
      return;
    }

    // Check for validation warnings before saving
    if (urlValidationWarning) {
      setUrlError("Please fix invalid characters before saving.");
      return;
    }

    setIsUpdatingUrl(true);
    setUrlError("");
    setUrlValidationWarning("");

    try {
      const response = await fetch('/api/landing-pages/update-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageId: page.id,
          newSlug: editedSlug
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update URL');
      }

      // Update the page slug in parent component
      onUrlUpdate?.(editedSlug);
      setIsEditingUrl(false);
    } catch (error: any) {
      setUrlError(error.message);
    } finally {
      setIsUpdatingUrl(false);
    }
  };

  const handleUrlCancel = () => {
    setEditedSlug(page.slug);
    setIsEditingUrl(false);
    setUrlError("");
    setUrlValidationWarning("");
  };
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-xl lg:text-2xl font-bold text-white">{page.title}</h1>
          {/* Published Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            page.published 
              ? 'bg-green-900/20 text-green-400 border border-green-500/30' 
              : 'bg-orange-900/20 text-orange-400 border border-orange-500/30'
          }`}>
            {page.published ? (
              <>
                <Globe className="w-3 h-3" />
                <span>Published</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" />
                <span>Draft</span>
              </>
            )}
          </div>
        </div>
        <p className="text-neutral-400 text-sm">Analytics & Performance</p>
        
        {/* Published URL Section */}
        {page.published && (
          <div className="mt-3 p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
                Published URL
              </label>
              {!isEditingUrl && (
                <Button
                  onClick={() => setIsEditingUrl(true)}
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            
            {isEditingUrl ? (
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-sm text-neutral-400 flex-shrink-0">
                    {window.location.origin}/page/
                  </span>
                  <Input
                    value={editedSlug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    className="flex-1 h-8 text-sm bg-neutral-800 border-neutral-700 text-white"
                    placeholder="your-page-url"
                    disabled={isUpdatingUrl}
                  />
                </div>
                {urlValidationWarning && (
                  <p className="text-xs text-yellow-400">{urlValidationWarning}</p>
                )}
                {urlError && (
                  <p className="text-xs text-red-400">{urlError}</p>
                )}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleUrlSave}
                    variant="outline"
                    size="sm"
                    disabled={isUpdatingUrl || !editedSlug.trim() || !!urlValidationWarning}
                    className="h-7 px-3 text-xs border-green-600 text-green-400 hover:text-green-300 hover:bg-green-900 hover:border-green-500"
                    style={{ backgroundColor: '#0C0C0C', borderColor: '#16a34a' }}
                  >
                    {isUpdatingUrl ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    onClick={handleUrlCancel}
                    variant="outline"
                    size="sm"
                    disabled={isUpdatingUrl}
                    className="h-7 px-3 text-xs border-red-800 text-red-400 hover:text-red-300 hover:bg-red-900 hover:border-red-700"
                    style={{ backgroundColor: '#0C0C0C' }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <code className="flex-1 text-sm text-green-400 bg-neutral-800/50 px-2 py-1 rounded font-mono break-all">
                  {fullUrl}
                </code>
                <Button
                  onClick={handleCopyUrl}
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-neutral-400 hover:text-white hover:bg-neutral-800 self-start sm:self-center"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Desktop: Horizontal button layout */}
      <div className="hidden lg:flex items-center gap-3">
        <Link href={`/dashboard/page/${page.id}`}>
          <Button 
            variant="outline" 
            className="border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
            style={{ backgroundColor: '#0A0A0A' }}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Page
          </Button>
        </Link>
        <Link href={`/page/${page.slug}`} target="_blank">
          <Button 
            variant="outline" 
            className="border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
            style={{ backgroundColor: '#0A0A0A' }}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Live
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-600"
          style={{ backgroundColor: '#0A0A0A' }}
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      </div>

      {/* Mobile: Stacked button layout */}
      <div className="flex flex-col gap-2 lg:hidden">
        <div className="flex gap-2">
          <Link href={`/dashboard/page/${page.id}`} className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
              style={{ backgroundColor: '#0A0A0A' }}
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Link href={`/page/${page.slug}`} target="_blank" className="flex-1">
            <Button 
              variant="outline" 
              className="w-full border-[#2D2D2D] text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-600"
              style={{ backgroundColor: '#0A0A0A' }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live
            </Button>
          </Link>
        </div>
        <Button 
          variant="outline" 
          className="w-full border-red-800 text-red-400 hover:bg-red-900/20 hover:text-red-300 hover:border-red-600"
          style={{ backgroundColor: '#0A0A0A' }}
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Page
        </Button>
      </div>
    </div>
  );
}
