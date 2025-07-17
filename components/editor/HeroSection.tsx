"use client";
import React, { useState } from "react";
import EditorSection from "./EditorSection";
import { heroIconOptions, IconPreview } from "@/lib/iconUtils";
import { Button } from "@/components/ui/button";
import { Wand2, Image, X } from "lucide-react";

interface HeroSectionProps {
  hero: {
    headline: string;
    headlineHighlights: string[];
    subheadline: string;
    cta: string;
    heroTag: string;
    heroTagIcon: string;
    backgroundImage: string;
    backgroundImageEnabled?: boolean;
    backgroundImageOpacity?: number;
  };
  onHeroChange: (field: string, value: string | boolean | number) => void;
  onHighlightToggle: (word: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
  businessName?: string;
}

export default function HeroSection({
  hero,
  onHeroChange,
  onHighlightToggle,
  isExpanded,
  onToggle,
  businessName,
}: HeroSectionProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState("");

  // Extract words from headline for highlighting
  const headlineWords = hero.headline.split(' ').filter(word => word.length > 0);

  const generateBackgroundImage = async () => {
    if (!hero.headline.trim()) {
      setImageError("Please enter a headline first to generate a background image.");
      return;
    }

    setIsGeneratingImage(true);
    setImageError("");

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          headline: hero.headline,
          subheadline: hero.subheadline,
          businessName: businessName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      onHeroChange("backgroundImage", data.imageUrl);
      onHeroChange("backgroundImageEnabled", true);
      setImageError("");
    } catch (error: any) {
      setImageError(error.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const removeBackgroundImage = () => {
    onHeroChange("backgroundImage", "");
    onHeroChange("backgroundImageEnabled", false);
    setImageError("");
  };

  return (
    <EditorSection
      title="Hero Section"
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Tag
          </label>
          <input
            type="text"
            value={hero.heroTag}
            onChange={(e) => onHeroChange("heroTag", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., AI-Powered, New, Limited Time"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hero Tag Icon
          </label>
          <div className="grid grid-cols-4 gap-2">
            {heroIconOptions.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => onHeroChange("heroTagIcon", icon)}
                className={`p-3 border rounded-lg flex flex-col items-center gap-1 transition-colors ${
                  hero.heroTagIcon === icon
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <IconPreview iconName={icon} className="h-5 w-5" />
                <span className="text-xs text-gray-600 capitalize">
                  {icon.replace('-', ' ')}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headline
          </label>
          <textarea
            value={hero.headline}
            onChange={(e) => onHeroChange("headline", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="Enter your main headline"
          />
          {headlineWords.length > 0 && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlight Words (click to toggle):
              </label>
              <div className="flex flex-wrap gap-2">
                {headlineWords.map((word, index) => {
                  const cleanWord = word.replace(/[^\w]/g, '');
                  const isHighlighted = hero.headlineHighlights.includes(cleanWord);
                  return (
                    <button
                      key={index}
                      onClick={() => onHighlightToggle(cleanWord)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        isHighlighted
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {cleanWord}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subheadline
          </label>
          <textarea
            value={hero.subheadline}
            onChange={(e) => onHeroChange("subheadline", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={2}
            placeholder="Enter your subheadline"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CTA Button Text
          </label>
          <input
            type="text"
            value={hero.cta}
            onChange={(e) => onHeroChange("cta", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Get Started, Learn More"
          />
        </div>

        {/* Background Image Section */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Hero Background Image
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="backgroundImageEnabled"
                checked={hero.backgroundImageEnabled || false}
                onChange={(e) => onHeroChange("backgroundImageEnabled", e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="backgroundImageEnabled" className="text-sm text-gray-600">
                Enable background image
              </label>
            </div>
          </div>

          {hero.backgroundImageEnabled && (
            <div className="space-y-3">
              {/* Image Generation */}
              <div className="flex gap-2">
                <Button
                  onClick={generateBackgroundImage}
                  disabled={isGeneratingImage || !hero.headline.trim()}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Wand2 className="h-4 w-4" />
                  {isGeneratingImage ? "Generating..." : "Generate AI Image"}
                </Button>
                {hero.backgroundImage && (
                  <Button
                    onClick={removeBackgroundImage}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                )}
              </div>

              {/* Error Message */}
              {imageError && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
                  {imageError}
                </div>
              )}

              {/* Manual URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or enter image URL manually:
                </label>
                <input
                  type="text"
                  value={hero.backgroundImage}
                  onChange={(e) => onHeroChange("backgroundImage", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter background image URL"
                />
              </div>

              {/* Image Preview */}
              {hero.backgroundImage && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image Preview:
                  </label>
                  <div className="relative w-full h-32 border border-gray-300 rounded-md overflow-hidden">
                    <img
                      src={hero.backgroundImage}
                      alt="Background preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError("Failed to load image. Please check the URL.")}
                    />
                  </div>
                </div>
              )}

              {/* Opacity Control */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Opacity: {hero.backgroundImageOpacity || 30}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  value={hero.backgroundImageOpacity || 30}
                  onChange={(e) => onHeroChange("backgroundImageOpacity", parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>10%</span>
                  <span>80%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </EditorSection>
  );
} 