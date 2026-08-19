import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  theme, 
  injectThemeCSSVariables, 
  getColor, 
  getSpacing, 
  getRadius, 
  getShadow, 
  getTypographyStyle,
  createThemeStyle 
} from '../theme/theme.js';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Default to clean, modern 'light' theme
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('nathan_theme_mode') || 'light';
  });

  useEffect(() => {
    // Inject and update CSS variables on root document
    injectThemeCSSVariables(mode);
    localStorage.setItem('nathan_theme_mode', mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = mode === 'dark';

  const contextValue = useMemo(() => ({
    theme,
    mode,
    isDark,
    setMode,
    toggleMode,
    colors: theme.colors,
    typography: theme.typography,
    spacing: theme.spacing,
    radius: theme.radius,
    shadow: theme.shadow,
    getColor,
    getSpacing,
    getRadius,
    getShadow,
    getTypographyStyle,
    createThemeStyle,
  }), [mode, isDark]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      mode: 'light',
      isDark: false,
      setMode: () => {},
      toggleMode: () => {},
    };
  }
  return context;
};

export default ThemeContext;
