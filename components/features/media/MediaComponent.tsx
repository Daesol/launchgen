"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, Video, Youtube, Play, X, Link } from "lucide-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { getAccentColor } from "@/utils/theme";
import { Theme } from "@/types/landing-page.types";

interface MediaComponentProps {
  media?: {
    enabled: boolean;
    type: 'image' | 'video' | 'youtube' | 'vimeo';
    url?: string;
    file?: string;
    altText?: string;
    thumbnail?: string;
  };
  theme: Theme;
  previewMode?: 'desktop' | 'mobile';
  onMediaChange?: (media: any) => void;
  isEditor?: boolean;
  userId?: string; // Add userId prop for uploads
}

export default function MediaComponent({ 
  media, 
  theme, 
  previewMode = 'desktop',
  onMediaChange,
  isEditor = false,
  userId
}: MediaComponentProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [urlInput, setUrlInput] = useState(media?.url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createPagesBrowserClient();
  
  const isDark = theme.mode === 'black' || theme.mode === 'dark';
  const isMobilePreview = previewMode === 'mobile';

  // Don't render if media is disabled
  if (!media?.enabled) return null;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file size
    const maxSize = file.type.startsWith('image/') ? 10 * 1024 * 1024 : 25 * 1024 * 1024; // 10MB for images, 25MB for videos
    if (file.size > maxSize) {
      setUploadError(`File size too large. Max size: ${file.type.startsWith('image/') ? '10MB' : '25MB'}`);
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      // Use provided userId or get current user
      let currentUserId = userId;
      if (!currentUserId) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Auth error:", userError);
          throw new Error("User not authenticated. Please refresh the page and try again.");
        }
        currentUserId = user.id;
      }

      // Create file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${currentUserId}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      // Update media object
      const newMedia = {
        ...media,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        file: publicUrl,
        url: publicUrl,
        altText: media.altText || file.name.split('.')[0]
      };

      onMediaChange?.(newMedia);
    } catch (error: any) {
      setUploadError(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;

    let mediaType: 'image' | 'video' | 'youtube' | 'vimeo' = 'image';
    let processedUrl = urlInput.trim();

    // Detect media type from URL
    if (urlInput.includes('youtube.com') || urlInput.includes('youtu.be')) {
      mediaType = 'youtube';
      // Convert to embed URL
      const videoId = urlInput.includes('youtu.be') 
        ? urlInput.split('youtu.be/')[1]?.split('?')[0]
        : urlInput.split('v=')[1]?.split('&')[0];
      processedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (urlInput.includes('vimeo.com')) {
      mediaType = 'vimeo';
      const videoId = urlInput.split('vimeo.com/')[1]?.split('?')[0];
      processedUrl = `https://player.vimeo.com/video/${videoId}`;
    } else if (urlInput.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      mediaType = 'image';
    } else if (urlInput.match(/\.(mp4|webm|mov|avi)$/i)) {
      mediaType = 'video';
    }

    const newMedia = {
      ...media,
      type: mediaType,
      url: processedUrl,
      altText: media.altText || `Media from ${mediaType}`
    };

    onMediaChange?.(newMedia);
  };

  const handleAltTextChange = (altText: string) => {
    const newMedia = {
      ...media,
      altText
    };
    onMediaChange?.(newMedia);
  };

  const removeMedia = () => {
    onMediaChange?.({
      ...media,
      url: "",
      file: "",
      altText: ""
    });
  };

  const renderMediaContent = () => {
    if (!media?.url && !media?.file) {
      return (
        <div className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg ${
          isDark ? 'border-gray-600' : 'border-gray-300'
        }`}>
          <Upload className={`w-12 h-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
          <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            No media selected
          </p>
        </div>
      );
    }

    const mediaUrl = media.file || media.url;

    switch (media.type) {
      case 'image':
        return (
          <div className="relative group">
            <div 
              className="relative overflow-hidden rounded-lg shadow-lg"
              style={{
                aspectRatio: '16/9'
              }}
            >
              <img
                src={mediaUrl}
                alt={media.altText || "Hero media"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a default placeholder image if the URL is invalid
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format';
                }}
              />
              {isEditor && (
                <Button
                  onClick={removeMedia}
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  variant="destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="relative group">
            <div 
              className="relative overflow-hidden rounded-lg shadow-lg"
              style={{
                aspectRatio: '16/9'
              }}
            >
              <video
                src={mediaUrl}
                controls
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Show a placeholder message if video fails to load
                  const target = e.target as HTMLVideoElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-600">Video unavailable</div>';
                  }
                }}
              >
                Your browser does not support the video tag.
              </video>
              {isEditor && (
                <Button
                  onClick={removeMedia}
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  variant="destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        );

      case 'youtube':
      case 'vimeo':
        return (
          <div className="relative group w-full">
            <div className={`relative w-full ${
              isMobilePreview ? 'max-w-sm' : 'max-w-6xl'
            } mx-auto`}>
              <div 
                className="relative w-full rounded-lg overflow-hidden shadow-lg"
                style={{
                  aspectRatio: '16/9'
                }}
              >
                <iframe
                  src={mediaUrl}
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={media.altText || "Video"}
                />
              </div>
              {isEditor && (
                <Button
                  onClick={removeMedia}
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  variant="destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isEditor) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {media.type || 'image'}
          </Badge>
          {media.url && (
            <Badge variant="outline" className="text-xs">
              <Link className="w-3 h-3 mr-1" />
              URL
            </Badge>
          )}
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Media URL or Upload File
          </label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter image/video URL, YouTube, or Vimeo link"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} size="sm">
              <Link className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Or Upload File
          </label>
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              variant="outline"
              className="flex-1"
            >
              {isUploading ? (
                "Uploading..."
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              className="hidden"
            />
          </div>
          <p className="text-xs text-neutral-400">
            Images: max 10MB, Videos: max 25MB
          </p>
        </div>

        {/* Alt Text */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-300">
            Alt Text (for accessibility)
          </label>
          <Input
            type="text"
            placeholder="Describe the media for screen readers"
            value={media?.altText || ""}
            onChange={(e) => handleAltTextChange(e.target.value)}
          />
        </div>

        {/* Error Display */}
        {uploadError && (
          <div className="text-sm text-red-500 bg-red-500/10 p-2 rounded">
            {uploadError}
          </div>
        )}

        {/* Media Preview */}
        {media?.url || media?.file ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-300">
              Preview
            </label>
            {renderMediaContent()}
          </div>
        ) : null}
      </div>
    );
  }

  // Preview mode - just render the media
  return (
    <div className={`w-full ${isMobilePreview ? 'mt-4' : 'mt-8'}`}>
      {renderMediaContent()}
    </div>
  );
}
