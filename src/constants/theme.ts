/**
 * Community Transit App - Theme Configuration
 * Palette: Sunrise Energy 🌅
 * Vibe: Warm, vibrant, and optimistic
 */

export const theme = {
  // Primary Colors
  colors: {
      // Main Brand Colors
      primary: '#38bdf8',      // Sky Blue - Main brand color
      secondary: '#a7f3d0',    // Mint Green - Secondary actions
  accent: '#fde047',       // Yellow - Highlights & accents
  success: '#4ade80',      // Green - Success states

      // Semantic Colors
      error: '#ef4444',        // Red - Errors & warnings
      warning: '#fbbf24',      // Soft Yellow - Warnings
      info: '#38bdf8',         // Sky Blue - Information

      // Background Colors
      background: {
        primary: '#f8fafc',    // Off white - Main background
        secondary: '#ffffff',  // Pure white - Cards
        tertiary: '#e0f2fe',   // Light blue - Subtle backgrounds
      },

      // Text Colors
      text: {
        primary: '#334155',    // Slate - Main text
        secondary: '#64748b',  // Muted slate - Secondary text
        tertiary: '#94a3b8',   // Light slate - Tertiary text
        inverse: '#ffffff',    // White - Text on dark backgrounds
      },

      // Border Colors
      border: {
        light: '#e0f2fe',      // Light blue
        medium: '#38bdf8',     // Sky blue
        dark: '#0ea5e9',       // Deep blue
      },

      // Gradient Colors (for LinearGradient)
      gradients: {
        primary: ['#38bdf8', '#0ea5e9'],           // Blue gradient
        secondary: ['#a7f3d0', '#fde047'],         // Mint/yellow gradient
        accent: ['#fde047', '#fbbf24'],            // Yellow gradient
        success: ['#4ade80', '#a7f3d0'],           // Green/mint gradient
        header: ['#38bdf8', '#a7f3d0', '#fde047'], // Header gradient
      },
  },
  
  // Typography
  typography: {
    fontSizes: {
      xs: 10,
      sm: 12,
      base: 14,
      lg: 16,
      xl: 18,
      '2xl': 20,
      '3xl': 24,
      '4xl': 32,
    },
    
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
  },
  
  // Border Radius
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    colored: {
      shadowColor: '#f97316',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  
  // Icon Sizes
  iconSizes: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
  },
} as const;

// Type exports for TypeScript
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
export type ThemeSpacing = typeof theme.spacing;
