import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContextTypes';
import type { ThemeContextType } from '../contexts/ThemeContextTypes';

/**
 * Custom hook to use the theme context
 * Provides access to theme mode and toggle functionality
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }
  
  return context;
};
