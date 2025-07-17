"use client";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Layout, Image as ImageIcon } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  preview: string;
  features: string[];
}

interface TemplateSelectorProps {
  currentTemplate: string;
  onTemplateChange: (templateId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const templates: Template[] = [
  {
    id: "default",
    name: "Classic Template",
    description: "Clean, minimal design with focus on content and conversion",
    icon: <Layout className="h-6 w-6" />,
    preview: "Clean, professional layout with subtle backgrounds and focused content",
    features: [
      "Minimal, distraction-free design",
      "AI-generated background images",
      "Clean typography and spacing",
      "Optimized for conversion",
      "Mobile-responsive layout"
    ]
  },
  {
    id: "image-rich",
    name: "Image-Rich Template",
    description: "Visually engaging design with multiple images and visual elements",
    icon: <ImageIcon className="h-6 w-6" />,
    preview: "Rich visual experience with background images, card images, and icons",
    features: [
      "Multiple background images per section",
      "Card images for features and testimonials",
      "User avatars for testimonials",
      "Section-specific background images",
      "Enhanced visual hierarchy",
      "Public image URL support"
    ]
  }
];

export default function TemplateSelector({
  currentTemplate,
  onTemplateChange,
  isExpanded,
  onToggle
}: TemplateSelectorProps) {
  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Layout className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="font-medium text-gray-900">Template</h3>
            <p className="text-sm text-gray-500">
              {templates.find(t => t.id === currentTemplate)?.name || "Classic Template"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {templates.find(t => t.id === currentTemplate)?.name || "Classic Template"}
          </span>
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-gray-600">
            Choose a template that best fits your brand and content style.
          </p>
          
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  currentTemplate === template.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        currentTemplate === template.id 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {template.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {template.description}
                        </CardDescription>
                      </div>
                    </div>
                    {currentTemplate === template.id && (
                      <Check className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {template.preview}
                    </p>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {template.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Note:</strong> Changing templates will preserve your content but may require adjustments to images and layout elements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 