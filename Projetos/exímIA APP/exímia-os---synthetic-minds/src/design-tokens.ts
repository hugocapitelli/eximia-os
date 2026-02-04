/**
 * Design Tokens - exímIA Design System Foundation
 *
 * Centralized color, typography, spacing, and shadow tokens
 * for consistent styling across all Library Editor Enhancement components.
 *
 * Philosophy: All styling values are strings exported from this file.
 * Components must never hardcode color values.
 */

// ============================================================
// COLOR TOKENS
// ============================================================

export const COLORS = {
  // Eximia (Gold) - Primary Brand Color
  eximia: {
    50: '#fffbf0',
    100: '#fff4d6',
    200: '#ffe6ad',
    300: '#ffd275',
    400: '#fdbf68', // PRIMARY BASE
    500: '#fb9e24',
    600: '#ed7f09',
    700: '#c55f08',
    800: '#9c490e',
    900: '#7d3c0f',
    950: '#481e04',
  },

  // Minds (Purple) - Secondary Brand Color
  minds: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6', // PRIMARY PURPLE
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },

  // Tech (Dark Theme)
  tech: {
    bg: '#050505',        // Main background
    surface: '#0a0a0a',   // Card/surface background
    border: '#1f1f22',    // Border color
  },

  // Semantic
  semantic: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  },
} as const;

// ============================================================
// TYPOGRAPHY TOKENS
// ============================================================

export const TYPOGRAPHY = {
  fontFamily: {
    sans: "'Inter', sans-serif",
    serif: "'Source Serif 4', serif",
    mono: "'JetBrains Mono', monospace",
  },

  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },

  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
} as const;

// ============================================================
// SPACING TOKENS
// ============================================================

export const SPACING = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

// ============================================================
// SHADOW & GLOW TOKENS
// ============================================================

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
} as const;

export const GLOWS = {
  goldGlow: '0 0 20px -5px rgba(253, 191, 104, 0.4)',
  purpleGlow: '0 0 20px -5px rgba(139, 92, 246, 0.5)',
} as const;

// ============================================================
// BORDER RADIUS TOKENS
// ============================================================

export const BORDER_RADIUS = {
  none: '0',
  sm: '0.125rem',     // 2px
  base: '0.25rem',    // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px
  full: '9999px',
} as const;

// ============================================================
// CATEGORY COLORS (from biblioteca.ts, using design tokens)
// ============================================================

export interface CategoryColor {
  name: string;
  label: string;
  color: string;      // Text color (from COLORS palette)
  bgColor: string;    // Background color (from COLORS palette)
}

export const BOOK_CATEGORIES: CategoryColor[] = [
  {
    name: 'produtividade',
    label: 'Produtividade',
    color: COLORS.semantic.success,
    bgColor: '#d1fae5',
  },
  {
    name: 'psicologia',
    label: 'Psicologia',
    color: '#ec4899',
    bgColor: '#fce7f3',
  },
  {
    name: 'liderança',
    label: 'Liderança',
    color: COLORS.eximia[500],
    bgColor: '#fef3c7',
  },
  {
    name: 'desenvolvimento pessoal',
    label: 'Desenvolvimento Pessoal',
    color: COLORS.minds[500],
    bgColor: '#ede9fe',
  },
  {
    name: 'hábitos',
    label: 'Hábitos',
    color: '#06b6d4',
    bgColor: '#cffafe',
  },
];

// ============================================================
// COMPOSITE TOKEN EXPORTS
// ============================================================

export const TOKENS = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  shadows: SHADOWS,
  glows: GLOWS,
  borderRadius: BORDER_RADIUS,
  categories: BOOK_CATEGORIES,
} as const;

// ============================================================
// TYPE EXPORTS FOR COMPONENT PROPS
// ============================================================

export type ColorKey = keyof typeof COLORS;
export type FontFamily = keyof typeof TYPOGRAPHY.fontFamily;
export type FontWeight = keyof typeof TYPOGRAPHY.fontWeight;
export type FontSize = keyof typeof TYPOGRAPHY.fontSize;
export type SpacingSize = keyof typeof SPACING;
export type BorderRadiusSize = keyof typeof BORDER_RADIUS;
export type ShadowSize = keyof typeof SHADOWS;

export default TOKENS;
