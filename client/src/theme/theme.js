import { colors } from './colors.js';
import { typography } from './typography.js';
import { spacing } from './spacing.js';
import { radius } from './radius.js';
import { shadows } from './shadow.js';

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  shadow: shadows,
};

/**
 * Injects unified CSS custom properties into :root for dynamic theming
 * @param {'dark' | 'light'} mode
 */
export const injectThemeCSSVariables = (mode = 'dark') => {
  const root = document.documentElement;
  const activePalette = mode === 'dark' ? colors.dark : colors.light;

  // Primary Red & White Palette
  root.style.setProperty('--color-primary', colors.primary[600]);
  root.style.setProperty('--color-primary-hover', colors.primary[700]);
  root.style.setProperty('--color-primary-light', colors.primary[500]);
  root.style.setProperty('--color-white', colors.white);

  // Surface Tokens (100% Solid Opaque - Never washed out)
  root.style.setProperty('--color-bg', activePalette.bg);
  root.style.setProperty('--color-surface', activePalette.surface);
  root.style.setProperty('--color-surface-elevated', activePalette.surfaceElevated);
  root.style.setProperty('--color-border', activePalette.border);
  root.style.setProperty('--color-border-subtle', activePalette.borderSubtle);

  // Text Tokens
  root.style.setProperty('--color-text-primary', activePalette.textPrimary);
  root.style.setProperty('--color-text-secondary', activePalette.textSecondary);
  root.style.setProperty('--color-text-muted', activePalette.textMuted);

  // Red Accents
  root.style.setProperty('--color-accent', activePalette.accent);
  root.style.setProperty('--color-accent-hover', activePalette.accentHover);

  // Typography Tokens
  root.style.setProperty('--font-heading', typography.fonts.heading);
  root.style.setProperty('--font-body', typography.fonts.body);
  root.style.setProperty('--font-mono', typography.fonts.mono);
};

export const getColor = (path, mode = 'dark') => {
  const keys = path.split('.');
  let current = mode === 'dark' ? colors.dark : colors.light;
  for (const key of keys) {
    if (current && current[key] !== undefined) {
      current = current[key];
    } else {
      let brandCurrent = colors;
      for (const bKey of keys) {
        brandCurrent = brandCurrent?.[bKey];
      }
      return brandCurrent || path;
    }
  }
  return current;
};

export const getSpacing = (key) => spacing[key] || key;
export const getRadius = (key) => radius[key] || key;
export const getShadow = (key) => shadows[key] || key;
export const getTypography = (key) => typography[key] || key;
export const getTypographyStyle = (variant) => typography.styles?.[variant] || {};
export const createThemeStyle = (fn) => (typeof fn === 'function' ? fn(theme) : {});

export default theme;
