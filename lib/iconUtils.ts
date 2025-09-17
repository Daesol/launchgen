import React from "react";
import { 
  Zap, Star, Shield, Rocket, Target, TrendingUp, Award, Sparkles,
  Heart, Check, ArrowUp, Trophy, Gem, Crown, Flame, Diamond, Medal,
  Clock, Book, Wallet, Users, BarChart3, Globe, AlertTriangle, HelpCircle, Minus, X, Info,
  Brain, ShoppingCart, Lock, Key, FileText, Badge, Lightbulb, Wrench,
  Smartphone, Monitor, HeartCrack, Frown, Angry, Moon, AlertCircle
} from "lucide-react";

// Complete icon mapping for all icons used in the editor
export const iconMap: { [key: string]: React.ComponentType<any> } = {
  // Core icons (already mapped in template)
  zap: Zap,
  star: Star,
  shield: Shield,
  rocket: Rocket,
  target: Target,
  trendingUp: TrendingUp,
  award: Award,
  sparkles: Sparkles,
  
  // Additional icons from editor components
  heart: Heart,
  check: Check,
  "arrow-up": ArrowUp,
  trophy: Trophy,
  gem: Gem,
  crown: Crown,
  fire: Flame,
  flame: Flame,
  bolt: Zap,
  diamond: Diamond,
  medal: Medal,
  lightning: Zap,
  
  // Problem section icons
  clock: Clock,
  book: Book,
  wallet: Wallet,
  users: Users,
  chart: BarChart3,
  globe: Globe,
  exclamation: AlertTriangle,
  question: HelpCircle,
  minus: Minus,
  x: X,
  alert: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
  
  // Features section icons
  brain: Brain,
  cart: ShoppingCart,
  
  // Guarantees section icons
  lock: Lock,
  key: Key,
  safety: Shield, // Using shield for safety
  guarantee: Check, // Using check for guarantee
  certificate: FileText,
  badge: Badge,
  
  // Additional icons for IconSelector
  lightbulb: Lightbulb,
  wrench: Wrench,
  smartphone: Smartphone,
  monitor: Monitor,
  'heart-crack': HeartCrack,
  frown: Frown,
  angry: Angry,
  moon: Moon,
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  sad: Frown, // Map sad to frown icon
};

// Function to render icon with fallback
export const renderIcon = (iconName: string, className: string = "h-4 w-4") => {
  if (!iconName) {
    return React.createElement(Sparkles, { className });
  }
  
  const normalizedName = iconName.toLowerCase().trim();
  const IconComponent = iconMap[normalizedName];
  
  if (IconComponent) {
    return React.createElement(IconComponent, { className });
  }
  
  // Fallback to sparkles if icon not found
  return React.createElement(Sparkles, { className });
};

// Icon preview component for editor dropdowns
export const IconPreview: React.FC<{ iconName: string; className?: string }> = ({ 
  iconName, 
  className = "h-4 w-4" 
}) => {
  return renderIcon(iconName, className);
};

// All available icon options for different sections
export const heroIconOptions = [
  "rocket", "star", "heart", "shield", "zap", "check", "arrow-up", "trophy",
  "gem", "crown", "fire", "bolt", "diamond", "medal", "target", "lightning"
];

export const problemIconOptions = [
  "clock", "book", "wallet", "users", "chart", "globe", "shield", "zap",
  "exclamation", "question", "minus", "x", "alert", "warning", "info"
];

export const featuresIconOptions = [
  "rocket", "star", "heart", "shield", "zap", "check", "arrow-up", "trophy",
  "gem", "crown", "fire", "bolt", "diamond", "medal", "target", "lightning",
  "brain", "cart", "clock", "book", "wallet", "users", "chart", "globe"
];

export const guaranteesIconOptions = [
  "shield", "star", "check", "heart", "gem", "crown", "medal", "trophy",
  "lock", "key", "safety", "guarantee", "certificate", "badge", "award"
];

// Default icons for fallback
export const getDefaultIcon = (index: number) => {
  const defaultIcons = ['zap', 'star', 'shield', 'rocket', 'target', 'trendingUp', 'award', 'sparkles'];
  return defaultIcons[index % defaultIcons.length];
}; 