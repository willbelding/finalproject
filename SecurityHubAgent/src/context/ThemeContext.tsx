// This file is reponsible for providing the theme options for the application
import React, { createContext, useContext, useState } from 'react';
import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';

// defines an alias for the theme context value
type ThemeContextType = {
  theme: Theme;
  isDark: boolean; //a boolean to check whether dark mode is enabled
  toggleTheme: () => void;
};

// Object context is created for the theme and sets an initial undefined value
// (This value will be given by ThemeProvider).
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// This provides the theme context.
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const theme = isDark ? DarkTheme : DefaultTheme;
  
  // This renders the ThemeContext.Provider component
  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook is created to provide way for components to access theme context. 
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeContext MUST be used within a ThemeProvider');
  return context;
};