"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { getAccentColor } from "@/utils/theme";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  ctaText: string;
  ctaLink: string;
}

interface PricingSectionProps {
  title?: string;
  description?: string;
  plans?: PricingPlan[];
  theme: {
    mode: 'light' | 'dark' | 'black' | 'white';
    accentColor: string;
  };
  isMobilePreview?: boolean;
  onSectionSelect?: (sectionId: string) => void;
}

export default function PricingSection({ 
  title = '', 
  description = '', 
  plans = [], 
  theme, 
  isMobilePreview = false,
  onSectionSelect
}: PricingSectionProps) {
  const isDark = theme.mode === 'dark' || theme.mode === 'black';
  
  console.log('🎯 PRICING SECTION COMPONENT RENDERED:', {
    title,
    description,
    plans,
    plansLength: plans.length,
    theme,
    isMobilePreview,
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 'SSR'
  });
  
  return (
    <section 
      id="pricing" 
      className={`py-8 sm:py-12 lg:py-16 ${isMobilePreview ? 'px-2' : 'px-4 sm:px-6 lg:px-8'} scroll-mt-16 sm:scroll-mt-20`}
      onClick={() => onSectionSelect?.('pricing')}
      style={{ cursor: onSectionSelect ? 'pointer' : 'default' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className={`font-bold mb-3 sm:mb-4 ${isDark ? 'text-white' : 'text-gray-900'} ${
            isMobilePreview 
              ? 'text-xl' 
              : 'text-2xl sm:text-3xl lg:text-4xl'
          }`}>
            {title}
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mx-auto ${
            isMobilePreview 
              ? 'text-xs max-w-[280px]' 
              : 'text-base sm:text-lg max-w-2xl'
          }`}>
            {description}
          </p>
        </div>

        {/* Pricing Plans */}
        <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${isMobilePreview ? 'grid-cols-1 gap-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {plans.length > 0 ? plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-xl sm:rounded-2xl ${isMobilePreview ? 'p-4 rounded-xl' : 'p-4 sm:p-6 lg:p-8'} flex flex-col ${
                plan.popular 
                  ? 'ring-2' 
                  : isDark 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
              }`}
              style={plan.popular ? {
                '--tw-ring-color': theme.accentColor,
                backgroundColor: isDark ? getAccentColor(theme.accentColor, 0.1) : getAccentColor(theme.accentColor, 0.05)
              } as React.CSSProperties : {}}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className={`absolute left-1/2 transform -translate-x-1/2 ${isMobilePreview ? '-top-3' : '-top-3 sm:-top-4'}`}>
                  <Badge 
                    className={`text-white py-1 ${isMobilePreview ? 'px-3 text-xs' : 'px-3 sm:px-4 text-xs sm:text-sm'}`}
                    style={{ backgroundColor: theme.accentColor }}
                  >
                    <Star className={`mr-1 ${isMobilePreview ? 'w-3 h-3' : 'w-3 h-3 sm:w-4 sm:h-4'}`} />
                    Most Popular
                  </Badge>
                </div>
              )}

              {/* Plan Header */}
              <div className={`text-center ${isMobilePreview ? 'mb-6' : 'mb-6 sm:mb-8'}`}>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'} ${isMobilePreview ? 'text-lg' : 'text-lg sm:text-xl'}`}>
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} ${isMobilePreview ? 'text-3xl' : 'text-3xl sm:text-4xl'}`}>
                    {plan.price}
                  </span>
                  <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} ${isMobilePreview ? 'text-base' : 'text-base sm:text-lg'}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} ${isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className={`flex-1 ${isMobilePreview ? 'mb-6' : 'mb-6 sm:mb-8'}`}>
                <ul className={`${isMobilePreview ? 'space-y-2' : 'space-y-2 sm:space-y-3'}`}>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check 
                        className={`mt-0.5 flex-shrink-0 ${isMobilePreview ? 'w-4 h-4 mr-2' : 'w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3'}`}
                        style={{ color: theme.accentColor }}
                      />
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'} ${isMobilePreview ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full ${isMobilePreview ? 'text-sm py-2' : 'text-sm sm:text-base py-2 sm:py-3'} hover:opacity-90 ${
                  plan.popular 
                    ? 'text-white' 
                    : isDark 
                      ? 'text-black hover:bg-gray-200' 
                      : 'text-white hover:bg-gray-800'
                }`}
                style={{
                  backgroundColor: plan.popular 
                    ? theme.accentColor 
                    : isDark 
                      ? '#ffffff' 
                      : '#000000'
                }}
                onClick={() => {
                  if (plan.ctaLink) {
                    window.open(plan.ctaLink, '_blank');
                  }
                }}
              >
                {plan.ctaText}
              </Button>
            </div>
          )) : (
            // Fallback when no plans are provided
            <div className="col-span-full text-center py-8 sm:py-12">
              <div className={`text-base sm:text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Pricing plans will be displayed here
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 sm:mt-12">
          <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            All plans include 30-day money-back guarantee
          </p>
        </div>
      </div>
    </section>
  );
}
