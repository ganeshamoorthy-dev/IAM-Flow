import { createContext } from 'react';

// Define the theme mode type
export type ThemeMode = 'light' | 'dark';

// Define the context interface
export interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// Create the context
export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
});
