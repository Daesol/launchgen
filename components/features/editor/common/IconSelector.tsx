"use client";
import React from "react";
import { renderIcon } from "@/lib/iconUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export interface IconOption {
  value: string;
  label?: string;
}

interface IconSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  options?: IconOption[];
}

// Default icon options - using correct Lucide React icon names
const defaultIconOptions: IconOption[] = [
  { value: 'rocket', label: 'Rocket' },
  { value: 'zap', label: 'Lightning' },
  { value: 'lightbulb', label: 'Lightbulb' },
  { value: 'target', label: 'Target' },
  { value: 'flame', label: 'Fire' },
  { value: 'star', label: 'Star' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'helicopter', label: 'Helicopter' },
  { value: 'wrench', label: 'Tools' },
  { value: 'smartphone', label: 'Mobile' },
  { value: 'monitor', label: 'Computer' },
  { value: 'globe', label: 'Web' },
  { value: 'check', label: 'Checkmark' },
  { value: 'shield', label: 'Shield' },
  { value: 'lock', label: 'Lock' },
  { value: 'zap', label: 'Strong' },
  { value: 'alert-triangle', label: 'Alert' },
  { value: 'alert-triangle', label: 'Warning' },
  { value: 'x', label: 'Cross' },
  { value: 'heart-crack', label: 'Broken Heart' },
  { value: 'frown', label: 'Anxious' },
  { value: 'angry', label: 'Frustrated' },
  { value: 'moon', label: 'Tired' },
  { value: 'angry', label: 'Angry' },
];

export default function IconSelector({
  value,
  onChange,
  placeholder = 'Select an icon',
  className = '',
  options = defaultIconOptions,
}: IconSelectorProps) {
  const selectedOption = options.find(option => option.value === value);
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={`justify-between ${className}`}
        >
          <div className="flex items-center gap-2">
            {selectedOption ? (
              <>
                {renderIcon(selectedOption.value, "h-4 w-4")}
                <span>{selectedOption.label || selectedOption.value}</span>
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center gap-2 cursor-pointer"
          >
            {renderIcon(option.value, "h-4 w-4")}
            <span>{option.label || option.value}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Unified icon selector for all sections - much simpler and avoids duplicate key issues
export function UnifiedIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  const unifiedIcons: IconOption[] = [
    // Core icons
    { value: 'rocket', label: 'Rocket' },
    { value: 'zap', label: 'Lightning' },
    { value: 'lightbulb', label: 'Lightbulb' },
    { value: 'target', label: 'Target' },
    { value: 'flame', label: 'Fire' },
    { value: 'star', label: 'Star' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'shield', label: 'Shield' },
    { value: 'check', label: 'Checkmark' },
    { value: 'lock', label: 'Lock' },
    
    // Technology icons
    { value: 'smartphone', label: 'Mobile' },
    { value: 'monitor', label: 'Computer' },
    { value: 'globe', label: 'Web' },
    { value: 'wrench', label: 'Tools' },
    { value: 'helicopter', label: 'Helicopter' },
    
    // Problem/Alert icons
    { value: 'alert-triangle', label: 'Alert' },
    { value: 'alert-circle', label: 'Warning' },
    { value: 'x', label: 'Cross' },
    { value: 'heart-crack', label: 'Broken Heart' },
    { value: 'frown', label: 'Frown' },
    { value: 'angry', label: 'Angry' },
    { value: 'moon', label: 'Moon' },
    { value: 'sad', label: 'Sad' },
    
    // Additional icons
    { value: 'heart', label: 'Heart' },
    { value: 'trophy', label: 'Trophy' },
    { value: 'award', label: 'Award' },
    { value: 'crown', label: 'Crown' },
    { value: 'gem', label: 'Gem' },
    { value: 'medal', label: 'Medal' },
    { value: 'clock', label: 'Clock' },
    { value: 'book', label: 'Book' },
    { value: 'wallet', label: 'Wallet' },
    { value: 'users', label: 'Users' },
    { value: 'chart', label: 'Chart' },
    { value: 'brain', label: 'Brain' },
    { value: 'cart', label: 'Cart' },
    { value: 'key', label: 'Key' },
    { value: 'badge', label: 'Badge' },
  ];
  
  return (
    <IconSelector
      value={value}
      onChange={onChange}
      placeholder="Select an icon"
      className={className}
      options={unifiedIcons}
    />
  );
}

// Legacy specialized selectors for backward compatibility - now all use the same unified set
export function HeroIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  return <UnifiedIconSelector value={value} onChange={onChange} className={className} />;
}

export function FeatureIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  return <UnifiedIconSelector value={value} onChange={onChange} className={className} />;
}

export function GuaranteeIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  return <UnifiedIconSelector value={value} onChange={onChange} className={className} />;
}

export function PainPointIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  return <UnifiedIconSelector value={value} onChange={onChange} className={className} />;
}