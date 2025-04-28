// This file is used to apply the different themes to the dashboard
// (Light and Dark mode)
import React, { createContext, useMemo, useState } from 'react';
import { createTheme } from '@mui/material/styles';

// This provides the context to switch between the two modes everywhere
// in the dashboard
export const ThemeModeContext = createContext({
  toggleTheme: () => {},
  mode: 'light',
  theme: createTheme({ palette: { mode: 'light' } })
});

// This provides the theme context.
export const ThemeModeProvider = ({ children }) => {
  // The state for the light theme mode
  const [mode, setMode] = useState('light');

  // This is the toggle function for this feature. The user can
  // switch between light and dark modes with ease.
  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // This memorises the MUI theme based on the selected mode.
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#121212' : '#fff',
        paper: mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
      },
    },
  }), [mode]);
  
  // The theme is then returned.
  return (
    <ThemeModeContext.Provider value={{ toggleTheme, mode, theme }}>
      {children}
    </ThemeModeContext.Provider>
  );
};