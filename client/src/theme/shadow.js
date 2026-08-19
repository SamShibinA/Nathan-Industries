/**
 * NathanIndustries Centralized Shadow System
 * High-depth industrial elevations and red safety accents.
 */

export const shadow = {
  // Base Elevation Scale
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.15), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -4px rgba(0, 0, 0, 0.15)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.35), 0 8px 10px -6px rgba(0, 0, 0, 0.25)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.7)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.2)',

  // Specialized Industrial Shadows
  'industrial-card': '0 12px 32px -8px rgba(3, 8, 15, 0.5), 0 1px 2px 0 rgba(255, 255, 255, 0.05) inset',
  'industrial-card-hover': '0 24px 48px -12px rgba(0, 0, 0, 0.8), 0 0 20px -2px rgba(220, 38, 38, 0.25)',
  'industrial-dark': '0 30px 60px -12px rgba(0, 0, 0, 0.9)',
  
  // Red Glow Accents
  'red-glow-sm': '0 0 15px rgba(220, 38, 38, 0.35)',
  'red-glow-md': '0 0 30px rgba(220, 38, 38, 0.5)',
  'red-glow-lg': '0 0 50px rgba(220, 38, 38, 0.7)',
  
  // Amber Warning Glow
  'amber-glow-sm': '0 0 15px rgba(245, 158, 11, 0.35)',
  'amber-glow-md': '0 0 30px rgba(245, 158, 11, 0.5)',
};

export const shadows = shadow;
export default shadow;
