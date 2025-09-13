"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menu } from "lucide-react";
import { getThemeClasses } from "@/utils/theme";
import { LandingPageConfig, Theme } from "@/types/landing-page.types";

interface HeaderProps {
  config: LandingPageConfig;
  theme: Theme;
  themeClasses: ReturnType<typeof getThemeClasses>;
  previewMode: 'desktop' | 'mobile';
  onSectionSelect?: (section: string) => void;
}

export default function Header({ 
  config, 
  theme, 
  themeClasses, 
  previewMode, 
  onSectionSelect 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { business, hero } = config;
  const isMobilePreview = previewMode === 'mobile';

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'problemSection': return 'Why';
      case 'features': return 'How';
      case 'socialProof': return 'Testimonials';
      case 'guarantees': return 'Guarantees';
      case 'faq': return 'FAQs';
      default: return null;
    }
  };
  
  const getSectionId = (section: string) => {
    switch (section) {
      case 'problemSection': return 'problem-section';
      case 'socialProof': return 'social-proof';
      default: return section;
    }
  };

  return (
    <>
      {/* Header */}
      <header 
        className={`flex items-center border-b ${themeClasses.border} ${themeClasses.background} sticky top-0 z-40 ${
          isMobilePreview ? 'h-12 px-2' : 'h-14 px-4 sm:px-6 lg:px-8'
        }`}
        style={{
          backgroundColor: theme.mode === 'black' ? '#000000' : '#ffffff'
        }}
      >
        <div 
          className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onSectionSelect?.('business')}
          style={{ cursor: onSectionSelect ? 'pointer' : 'default' }}
          title={onSectionSelect ? 'Click to edit business info' : undefined}
        >
          {business?.logo ? (
            <img 
              src={business.logo} 
              alt={`${business.name || 'Business'} Logo`}
              className={`rounded-md object-cover ${
                isMobilePreview ? 'h-6 w-6' : 'h-8 w-8'
              }`}
            />
          ) : (
            <div className={`rounded-md flex items-center justify-center font-bold ${
              isMobilePreview ? 'h-6 w-6 text-xs' : 'h-8 w-8 text-sm'
            } text-white`}
            style={{ 
              backgroundColor: theme.mode === 'black' ? '#1e293b' : theme.accentColor
            }}>
              {business?.name ? business.name.charAt(0).toUpperCase() : 'L'}
            </div>
          )}
          <span className={`ml-2 font-semibold ${themeClasses.text} ${theme.mode === 'black' ? 'text-white' : ''} ${
            isMobilePreview ? 'text-sm' : 'text-base sm:text-lg'
          }`}>
            {business?.name || 'LaunchGen'}
          </span>
        </div>
        
        {/* Desktop Navigation */}
        <nav className={`ml-auto ${previewMode === 'mobile' ? 'hidden' : 'hidden md:flex'} items-center gap-4 lg:gap-6`}>
          {config.sectionOrder?.map((sectionName: string, index: number) => {
            const label = getSectionLabel(sectionName);
            if (!label) return null;
            
            const sectionId = getSectionId(sectionName);
            
            return (
              <button
                key={index}
                onClick={() => scrollToSection(sectionId)}
                className={`text-sm font-medium hover:underline underline-offset-4 ${themeClasses.textSecondary} hover:${themeClasses.text}`}
              >
                {label}
              </button>
            );
          })}
          <button
            onClick={() => scrollToSection('cta-section')}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md px-3 py-2"
            style={{ 
              backgroundColor: theme.accentColor,
              borderColor: theme.accentColor,
              color: 'white'
            }}
          >
            {hero.cta}
          </button>
        </nav>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className={`ml-auto ${previewMode === 'mobile' ? 'flex' : 'md:hidden'} ${theme.mode === 'black' ? 'text-white hover:text-gray-200' : 'text-gray-700 hover:text-gray-900'}`}
          onClick={toggleMobileMenu}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={`${previewMode === 'mobile' ? 'flex' : 'md:hidden'} ${previewMode === 'mobile' ? 'absolute inset-0' : 'fixed inset-0'} bg-black bg-opacity-50 z-50 animate-in fade-in duration-300`}>
          <div className={`${previewMode === 'mobile' ? 'absolute' : 'absolute'} top-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 ease-in-out animate-in slide-in-from-top-2`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-semibold text-gray-800">Menu</span>
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4 space-y-4">
              {config.sectionOrder?.map((sectionName: string, index: number) => {
                const label = getSectionLabel(sectionName);
                if (!label) return null;
                
                const sectionId = getSectionId(sectionName);
                
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(sectionId)}
                    className={`block w-full text-left py-2 px-3 rounded-lg transition-colors ${themeClasses.textSecondary} hover:${themeClasses.text} hover:bg-gray-100`}
                  >
                    {label}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  scrollToSection('cta-section');
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 px-3 rounded-lg transition-colors font-medium`}
                style={{ 
                  backgroundColor: theme.accentColor,
                  color: 'white'
                }}
              >
                {hero.cta}
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
