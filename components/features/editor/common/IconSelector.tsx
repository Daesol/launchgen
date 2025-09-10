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

// Default icon options - can be customized per section
const defaultIconOptions: IconOption[] = [
  { value: 'rocket', label: 'Rocket' },
  { value: 'lightning', label: 'Lightning' },
  { value: 'lightbulb', label: 'Lightbulb' },
  { value: 'target', label: 'Target' },
  { value: 'fire', label: 'Fire' },
  { value: 'star', label: 'Star' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'helicopter', label: 'Helicopter' },
  { value: 'tools', label: 'Tools' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'computer', label: 'Computer' },
  { value: 'web', label: 'Web' },
  { value: 'check', label: 'Checkmark' },
  { value: 'shield', label: 'Shield' },
  { value: 'lock', label: 'Lock' },
  { value: 'strong', label: 'Strong' },
  { value: 'alert', label: 'Alert' },
  { value: 'warning', label: 'Warning' },
  { value: 'x', label: 'Cross' },
  { value: 'broken-heart', label: 'Broken Heart' },
  { value: 'anxious', label: 'Anxious' },
  { value: 'frustrated', label: 'Frustrated' },
  { value: 'tired', label: 'Tired' },
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

// Specialized icon selectors for different sections
export function HeroIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  const heroIcons: IconOption[] = [
    { value: 'rocket', label: 'Rocket' },
    { value: 'lightning', label: 'Lightning' },
    { value: 'lightbulb', label: 'Lightbulb' },
    { value: 'target', label: 'Target' },
    { value: 'fire', label: 'Fire' },
    { value: 'star', label: 'Star' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'helicopter', label: 'Helicopter' },
  ];
  
  return (
    <IconSelector
      value={value}
      onChange={onChange}
      placeholder="Select hero icon"
      className={className}
      options={heroIcons}
    />
  );
}

export function FeatureIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  const featureIcons: IconOption[] = [
    { value: 'rocket', label: 'Rocket' },
    { value: 'lightning', label: 'Lightning' },
    { value: 'lightbulb', label: 'Lightbulb' },
    { value: 'target', label: 'Target' },
    { value: 'fire', label: 'Fire' },
    { value: 'star', label: 'Star' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'helicopter', label: 'Helicopter' },
    { value: 'tools', label: 'Tools' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'computer', label: 'Computer' },
    { value: 'web', label: 'Web' },
  ];
  
  return (
    <IconSelector
      value={value}
      onChange={onChange}
      placeholder="Select feature icon"
      className={className}
      options={featureIcons}
    />
  );
}

export function GuaranteeIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  const guaranteeIcons: IconOption[] = [
    { value: 'check', label: 'Checkmark' },
    { value: 'shield', label: 'Shield' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'star', label: 'Star' },
    { value: 'lock', label: 'Lock' },
    { value: 'target', label: 'Target' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'strong', label: 'Strong' },
  ];
  
  return (
    <IconSelector
      value={value}
      onChange={onChange}
      placeholder="Select guarantee icon"
      className={className}
      options={guaranteeIcons}
    />
  );
}

export function PainPointIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  const painPointIcons: IconOption[] = [
    { value: 'alert', label: 'Alert' },
    { value: 'warning', label: 'Warning' },
    { value: 'x', label: 'Cross' },
    { value: 'broken-heart', label: 'Broken Heart' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'frustrated', label: 'Frustrated' },
    { value: 'tired', label: 'Tired' },
    { value: 'angry', label: 'Angry' },
  ];
  
  return (
    <IconSelector
      value={value}
      onChange={onChange}
      placeholder="Select pain point icon"
      className={className}
      options={painPointIcons}
    />
  );
}