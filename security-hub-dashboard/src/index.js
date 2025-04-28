import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import of MUI for theming purposes.
import { CssBaseline, ThemeProvider } from '@mui/material';
// This is a custom theme context import for switching between light and dark mode.
import { ThemeModeProvider, ThemeModeContext } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

// This is just a top level rander that applies the theme and basic setup.
root.render(
  <ThemeModeProvider>
    <ThemeModeContext.Consumer>
      {({ theme }) => (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      )}
    </ThemeModeContext.Consumer>
  </ThemeModeProvider>
);