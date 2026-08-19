/**
 * NathanIndustries Centralized Border Radius Scale
 * Modern industrial geometric forms with rounded durability.
 */

export const radius = {
  // Base scale
  none: '0px',
  '2xs': '0.125rem', // 2px
  xs: '0.25rem',     // 4px
  sm: '0.375rem',    // 6px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  '2xl': '1.5rem',    // 24px
  '3xl': '2rem',      // 32px
  full: '9999px',

  // Component Semantic Radii
  components: {
    button: '0.75rem',       // 12px
    buttonSm: '0.5rem',      // 8px
    buttonLg: '1rem',        // 16px
    card: '1.25rem',         // 20px
    cardLg: '1.5rem',        // 24px
    badge: '9999px',         // Full Pill
    input: '0.75rem',        // 12px
    modal: '1.5rem',         // 24px
    imageThumbnail: '1rem',  // 16px
    tag: '0.375rem',         // 6px
  },
};

export default radius;
