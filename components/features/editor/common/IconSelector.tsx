import React from 'react';

export interface IconOption {
  value: string;
  emoji: string;
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
  { value: 'rocket', emoji: '🚀', label: 'Rocket' },
  { value: 'lightning', emoji: '⚡', label: 'Lightning' },
  { value: 'lightbulb', emoji: '💡', label: 'Lightbulb' },
  { value: 'target', emoji: '🎯', label: 'Target' },
  { value: 'fire', emoji: '🔥', label: 'Fire' },
  { value: 'star', emoji: '⭐', label: 'Star' },
  { value: 'diamond', emoji: '💎', label: 'Diamond' },
  { value: 'helicopter', emoji: '🚁', label: 'Helicopter' },
  { value: 'tools', emoji: '🔧', label: 'Tools' },
  { value: 'mobile', emoji: '📱', label: 'Mobile' },
  { value: 'computer', emoji: '💻', label: 'Computer' },
  { value: 'web', emoji: '🌐', label: 'Web' },
  { value: 'checkmark', emoji: '✅', label: 'Checkmark' },
  { value: 'shield', emoji: '🛡️', label: 'Shield' },
  { value: 'lock', emoji: '🔒', label: 'Lock' },
  { value: 'strong', emoji: '💪', label: 'Strong' },
  { value: 'alert', emoji: '🚨', label: 'Alert' },
  { value: 'warning', emoji: '⚠️', label: 'Warning' },
  { value: 'cross', emoji: '❌', label: 'Cross' },
  { value: 'broken-heart', emoji: '💔', label: 'Broken Heart' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'frustrated', emoji: '😤', label: 'Frustrated' },
  { value: 'tired', emoji: '😫', label: 'Tired' },
  { value: 'angry', emoji: '😡', label: 'Angry' },
];

export default function IconSelector({
  value,
  onChange,
  placeholder = 'Select an icon',
  className = '',
  options = defaultIconOptions,
}: IconSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.emoji} {option.label || option.value}
        </option>
      ))}
    </select>
  );
}

// Specialized icon selectors for different sections
export function HeroIconSelector({ value, onChange, className }: { value: string; onChange: (value: string) => void; className?: string }) {
  const heroIcons: IconOption[] = [
    { value: 'rocket', emoji: '🚀', label: 'Rocket' },
    { value: 'lightning', emoji: '⚡', label: 'Lightning' },
    { value: 'lightbulb', emoji: '💡', label: 'Lightbulb' },
    { value: 'target', emoji: '🎯', label: 'Target' },
    { value: 'fire', emoji: '🔥', label: 'Fire' },
    { value: 'star', emoji: '⭐', label: 'Star' },
    { value: 'diamond', emoji: '💎', label: 'Diamond' },
    { value: 'helicopter', emoji: '🚁', label: 'Helicopter' },
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
    { value: 'rocket', emoji: '🚀', label: 'Rocket' },
    { value: 'lightning', emoji: '⚡', label: 'Lightning' },
    { value: 'lightbulb', emoji: '💡', label: 'Lightbulb' },
    { value: 'target', emoji: '🎯', label: 'Target' },
    { value: 'fire', emoji: '🔥', label: 'Fire' },
    { value: 'star', emoji: '⭐', label: 'Star' },
    { value: 'diamond', emoji: '💎', label: 'Diamond' },
    { value: 'helicopter', emoji: '🚁', label: 'Helicopter' },
    { value: 'tools', emoji: '🔧', label: 'Tools' },
    { value: 'mobile', emoji: '📱', label: 'Mobile' },
    { value: 'computer', emoji: '💻', label: 'Computer' },
    { value: 'web', emoji: '🌐', label: 'Web' },
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
    { value: 'checkmark', emoji: '✅', label: 'Checkmark' },
    { value: 'shield', emoji: '🛡️', label: 'Shield' },
    { value: 'diamond', emoji: '💎', label: 'Diamond' },
    { value: 'star', emoji: '⭐', label: 'Star' },
    { value: 'lock', emoji: '🔒', label: 'Lock' },
    { value: 'target', emoji: '🎯', label: 'Target' },
    { value: 'rocket', emoji: '🚀', label: 'Rocket' },
    { value: 'strong', emoji: '💪', label: 'Strong' },
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
    { value: 'alert', emoji: '🚨', label: 'Alert' },
    { value: 'warning', emoji: '⚠️', label: 'Warning' },
    { value: 'cross', emoji: '❌', label: 'Cross' },
    { value: 'broken-heart', emoji: '💔', label: 'Broken Heart' },
    { value: 'anxious', emoji: '😰', label: 'Anxious' },
    { value: 'frustrated', emoji: '😤', label: 'Frustrated' },
    { value: 'tired', emoji: '😫', label: 'Tired' },
    { value: 'angry', emoji: '😡', label: 'Angry' },
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
