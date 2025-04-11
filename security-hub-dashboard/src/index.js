import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ThemeModeProvider, ThemeModeContext } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));

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