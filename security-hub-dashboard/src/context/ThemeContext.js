import React, { createContext, useMemo, useState } from 'react';
import { createTheme } from '@mui/material/styles';

export const ThemeModeContext = createContext({
  toggleTheme: () => {},
  mode: 'light',
  theme: createTheme({ palette: { mode: 'light' } })
});

export const ThemeModeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      background: {
        default: mode === 'dark' ? '#121212' : '#fff',
        paper: mode === 'dark' ? '#1e1e1e' : '#f9f9f9',
      },
    },
  }), [mode]);

  return (
    <ThemeModeContext.Provider value={{ toggleTheme, mode, theme }}>
      {children}
    </ThemeModeContext.Provider>
  );
};