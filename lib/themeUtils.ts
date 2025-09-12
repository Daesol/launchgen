// Theme utility functions for light/dark mode and accent color management

export interface ThemeConfig {
  mode: "white" | "black";
  accentColor: string;
}

// Default color schemes for light and dark modes
export const themeDefaults = {
  white: {
    background: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    muted: "#f1f5f9",
    mutedForeground: "#64748b",
  },
  black: {
    background: "#000000",
    surface: "#1e293b",
    text: "#f8fafc",
    textSecondary: "#cbd5e1",
    border: "#334155",
    muted: "#1e293b",
    mutedForeground: "#94a3b8",
  }
};

// Generate CSS variables for the theme
export function generateThemeCSS(theme: ThemeConfig): string {
  const baseColors = themeDefaults[theme.mode];
  const accentColor = theme.accentColor;
  
  return `
    --background: ${baseColors.background};
    --surface: ${baseColors.surface};
    --text: ${baseColors.text};
    --text-secondary: ${baseColors.textSecondary};
    --border: ${baseColors.border};
    --muted: ${baseColors.muted};
    --muted-foreground: ${baseColors.mutedForeground};
    --accent: ${accentColor};
    --accent-foreground: ${theme.mode === 'white' ? '#ffffff' : '#000000'};
    --accent-10: ${accentColor}1a;
    --accent-20: ${accentColor}33;
    --accent-30: ${accentColor}4d;
    --accent-40: ${accentColor}66;
    --accent-50: ${accentColor}80;
  `;
}

// Apply theme to a DOM element
export function applyTheme(element: HTMLElement, theme: ThemeConfig) {
  const cssVars = generateThemeCSS(theme);
  element.style.cssText = cssVars;
}

// Get theme-aware class names
export function getThemeClasses(theme: ThemeConfig) {
  return {
    background: theme.mode === 'white' ? 'bg-white' : 'bg-black',
    surface: theme.mode === 'white' ? 'bg-slate-50' : 'bg-slate-900',
    text: theme.mode === 'white' ? 'text-slate-900' : 'text-slate-50',
    textSecondary: theme.mode === 'white' ? 'text-slate-600' : 'text-slate-400',
    border: theme.mode === 'white' ? 'border-slate-200' : 'border-slate-700',
    muted: theme.mode === 'white' ? 'bg-slate-100' : 'bg-slate-800',
    mutedText: theme.mode === 'white' ? 'text-slate-500' : 'text-slate-400',
  };
}

// Get accent color with opacity
export function getAccentColor(color: string, opacity: number = 1): string {
  if (opacity === 1) return color;
  
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
} 