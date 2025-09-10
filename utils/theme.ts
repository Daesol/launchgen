// Theme utilities
import { Theme, ThemeColors } from '@/types/landing-page.types';

export const getThemeClasses = (theme: Theme) => {
  const isDark = theme.mode === 'black';
  
  return {
    background: isDark ? 'bg-slate-950' : 'bg-white',
    surface: isDark ? 'bg-slate-900' : 'bg-slate-50',
    muted: isDark ? 'bg-slate-800' : 'bg-slate-100',
    text: isDark ? 'text-slate-50' : 'text-slate-900',
    textSecondary: isDark ? 'text-slate-400' : 'text-slate-600',
    border: isDark ? 'border-slate-700' : 'border-slate-200',
    mutedText: isDark ? 'text-slate-400' : 'text-slate-500',
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