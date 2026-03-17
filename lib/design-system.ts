/**
 * Alpha High School Design System
 * Based on the Alpha logo: geometric low-poly bird with digital disintegration effect
 *
 * Core Principles:
 * - Digital Transformation: Particle effects, geometric precision
 * - Innovation & Disruption: Dynamic animations, bold contrasts
 * - Premium & Professional: Glassmorphism, clean typography, generous spacing
 * - Speed & Velocity: Fast transitions, directional motion
 */

export const colors = {
  // Primary - from Alpha logo bird
  primary: {
    50: '#E6F0F5',
    100: '#CCE1EB',
    200: '#99C3D7',
    300: '#66A5C3',
    400: '#3387AF',
    500: '#2C4F5E', // Alpha blue from logo
    600: '#234050',
    700: '#1A303C',
    800: '#122028',
    900: '#091014',
  },

  // Secondary - lighter teal for accents
  secondary: {
    50: '#E6F7FA',
    100: '#CCEFF5',
    200: '#99DFEB',
    300: '#66CFE1',
    400: '#33BFD7',
    500: '#00AFCD', // Bright teal accent
    600: '#008CA4',
    700: '#00697B',
    800: '#004652',
    900: '#002329',
  },

  // Accent - electric cyan for highlights
  accent: {
    50: '#E6FCFF',
    100: '#CCF9FF',
    200: '#99F3FF',
    300: '#66EDFF',
    400: '#33E7FF',
    500: '#00D9FF', // Electric cyan
    600: '#00AED9',
    700: '#0082A3',
    800: '#00566D',
    900: '#002B37',
  },

  // Neutral - cool grays
  neutral: {
    50: '#F8FAFB',
    100: '#F1F5F7',
    200: '#E3EBEF',
    300: '#D5E1E7',
    400: '#C7D7DF',
    500: '#B9CDD7',
    600: '#94A4AC',
    700: '#6F7B81',
    800: '#4A5256',
    900: '#25292B',
  },

  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#00D9FF',

  // Glass effect backgrounds
  glass: {
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.16)',
  },
};

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
    display: '"Plus Jakarta Sans", Inter, sans-serif',
  },

  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem',   // 128px
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  glow: '0 0 20px rgba(0, 217, 255, 0.3)',
  glowStrong: '0 0 40px rgba(0, 217, 255, 0.5)',
};

export const animations = {
  // Particle disintegration (like logo)
  particleFloat: 'particleFloat 3s ease-in-out infinite',
  particleFade: 'particleFade 2s ease-out forwards',

  // Geometric transformations
  geometricPulse: 'geometricPulse 2s ease-in-out infinite',
  geometricRotate: 'geometricRotate 20s linear infinite',

  // Glass morphism
  glassShimmer: 'glassShimmer 3s ease-in-out infinite',

  // Speed & velocity
  slideInRight: 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  slideInLeft: 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
  fadeInUp: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
};

export const gradients = {
  primary: `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.primary[900]} 100%)`,
  secondary: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[700]} 100%)`,
  accent: `linear-gradient(135deg, ${colors.accent[400]} 0%, ${colors.accent[600]} 100%)`,
  hero: `linear-gradient(135deg, ${colors.primary[900]} 0%, ${colors.primary[700]} 50%, ${colors.secondary[600]} 100%)`,
  glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
};

export const effects = {
  // Glassmorphism
  glass: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  },

  // Neumorphism (subtle, for premium feel)
  neomorphLight: {
    background: colors.neutral[50],
    boxShadow: '8px 8px 16px #d1d9e0, -8px -8px 16px #ffffff',
  },

  neomorphDark: {
    background: colors.primary[800],
    boxShadow: '8px 8px 16px rgba(0,0,0,0.3), -8px -8px 16px rgba(255,255,255,0.05)',
  },
};
