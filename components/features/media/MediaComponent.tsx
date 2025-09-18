"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, Image, Video, Youtube, Play, X, Link, FolderOpen, Trash2 } from "lucide-react";
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

interface MediaFile {
  name: string;
  url: string;
  type: 'image' | 'video';
  size: number;
  created_at: string;
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
  const [showGallery, setShowGallery] = useState(false);
  const [userFiles, setUserFiles] = useState<MediaFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createPagesBrowserClient();
  
  const isDark = theme.mode === 'black' || theme.mode === 'dark';
  const isMobilePreview = previewMode === 'mobile';

  // Don't render if media is disabled
  if (!media?.enabled) return null;

  // Load user's uploaded files
  const loadUserFiles = async () => {
    setLoadingFiles(true);
    try {
      // Get current user
      let currentUserId = userId;
      if (!currentUserId) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Auth error:", userError);
          return;
        }
        currentUserId = user.id;
      }

      // List files from user's folder
      const { data, error } = await supabase.storage
        .from('media')
        .list(currentUserId, {
          limit: 50,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) throw error;

      // Transform file data
      const files: MediaFile[] = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(`${currentUserId}/${file.name}`);

        return {
          name: file.name,
          url: publicUrl,
          type: file.metadata?.mimetype?.startsWith('image/') ? 'image' : 'video',
          size: file.metadata?.size || 0,
          created_at: file.created_at
        };
      });

      setUserFiles(files);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Load files when gallery is opened
  useEffect(() => {
    if (showGallery && userFiles.length === 0) {
      loadUserFiles();
    }
  }, [showGallery]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
    const isValidType = [...validImageTypes, ...validVideoTypes].includes(file.type);
    
    if (!isValidType) {
      setUploadError('Invalid file type. Please upload images (JPEG, PNG, GIF, WebP) or videos (MP4, WebM, MOV, AVI).');
      return;
    }

    // Validate file size with better error messages
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxVideoSize = 25 * 1024 * 1024; // 25MB
    const isImage = file.type.startsWith('image/');
    const maxSize = isImage ? maxImageSize : maxVideoSize;
    
    if (file.size > maxSize) {
      const maxSizeFormatted = formatFileSize(maxSize);
      const fileSizeFormatted = formatFileSize(file.size);
      setUploadError(`File size too large (${fileSizeFormatted}). Maximum allowed: ${maxSizeFormatted} for ${isImage ? 'images' : 'videos'}.`);
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
      
      // Refresh the gallery to show the new file
      if (showGallery) {
        loadUserFiles();
      }
    } catch (error: any) {
      setUploadError(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (file: MediaFile) => {
    const newMedia = {
      ...media,
      type: file.type,
      file: file.url,
      url: file.url,
      altText: media.altText || file.name.split('.')[0]
    };
    onMediaChange?.(newMedia);
    setShowGallery(false); // Close gallery after selection
  };

  const handleFileDelete = async (fileName: string) => {
    try {
      // Get current user
      let currentUserId = userId;
      if (!currentUserId) {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error("Auth error:", userError);
          return;
        }
        currentUserId = user.id;
      }

      // Delete file from storage
      const { error } = await supabase.storage
        .from('media')
        .remove([`${currentUserId}/${fileName}`]);

      if (error) throw error;

      // Refresh the gallery
      loadUserFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
      setUploadError('Failed to delete file');
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
            Upload New File
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
                  Upload File
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowGallery(!showGallery)}
              variant="outline"
              className="px-3"
            >
              <FolderOpen className="w-4 h-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,video/mp4,video/webm,video/mov,video/avi"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                  // Clear the input so the same file can be selected again
                  e.target.value = '';
                }
              }}
              className="hidden"
            />
          </div>
          <p className="text-xs text-neutral-400">
            Images: max 10MB (JPEG, PNG, GIF, WebP) | Videos: max 25MB (MP4, WebM, MOV, AVI)
          </p>
        </div>

        {/* Media Gallery */}
        {showGallery && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-neutral-300">
                Your Uploaded Files
              </label>
              <Button
                onClick={() => loadUserFiles()}
                size="sm"
                variant="ghost"
                disabled={loadingFiles}
              >
                {loadingFiles ? "Loading..." : "Refresh"}
              </Button>
            </div>
            <div className="max-h-60 overflow-y-auto border border-neutral-700 rounded-lg p-2 bg-neutral-900/50">
              {loadingFiles ? (
                <div className="flex items-center justify-center p-4">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : userFiles.length === 0 ? (
                <div className="text-center p-4 text-neutral-400 text-sm">
                  No files uploaded yet
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {userFiles.map((file, index) => (
                    <div
                      key={index}
                      className="relative group border border-neutral-600 rounded-lg overflow-hidden hover:border-purple-500 transition-colors"
                    >
                      <div className="aspect-video bg-neutral-800 flex items-center justify-center">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21,15 16,10 5,21"/></svg>';
                            }}
                          />
                        ) : (
                          <Video className="w-8 h-8 text-neutral-400" />
                        )}
                      </div>
                      <div className="p-2">
                        <p className="text-xs text-neutral-300 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleFileSelect(file)}
                          size="sm"
                          className="h-8 px-3"
                        >
                          Select
                        </Button>
                        <Button
                          onClick={() => handleFileDelete(file.name)}
                          size="sm"
                          variant="destructive"
                          className="h-8 px-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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
