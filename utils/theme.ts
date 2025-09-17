// Theme utilities
import { Theme, ThemeColors } from '@/types/landing-page.types';

export const getThemeClasses = (theme: Theme) => {
  const isDark = theme.mode === 'black';
  
  return {
    background: isDark ? 'bg-black' : 'bg-white',
    surface: isDark ? 'bg-gray-900' : 'bg-slate-50',
    muted: isDark ? 'bg-black' : 'bg-white',
    text: isDark ? 'text-gray-50' : 'text-slate-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-slate-600',
    border: isDark ? 'border-gray-600' : 'border-slate-200',
    mutedText: isDark ? 'text-gray-400' : 'text-slate-500',
  };
};

export const getAccentColor = (accentColor: string, opacity: number = 1): string => {
  // Convert hex to rgba or return the color with opacity
  if (accentColor.startsWith('#')) {
    const hex = accentColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return accentColor;
};

export const createLegacyTheme = (themeColors?: ThemeColors): Theme => {
  if (!themeColors) {
    return {
      mode: 'white',
      accentColor: '#6366f1',
    };
  }

  return {
    mode: 'white',
    accentColor: themeColors.accentColor || themeColors.primaryColor || '#6366f1',
  };
};

export const validateTheme = (theme: any): Theme => {
  if (!theme || typeof theme !== 'object') {
    return { mode: 'white', accentColor: '#6366f1' };
  }

  return {
    mode: theme.mode === 'black' ? 'black' : 'white',
    accentColor: theme.accentColor || '#6366f1',
  };
};