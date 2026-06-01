import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider');
  }
  return context;
};

// Colores personalizados (puedes ajustarlos)
const lightTheme = createTheme({
  palette: {
    mode: 'light',

    primary: {
      main: '#3B82F6',   
      light: '#60A5FA',
      dark: '#2563EB',
    },

    secondary: {
      main: '#64748B',   
    },

    background: {
      default: '#FFFFFF', 
      paper: '#FFFFFF',   
    },

    text: {
      primary: '#555',
      secondary: '#64748B',
    },

    action: {
      hover: 'rgba(59, 130, 246, 0.08)',
      selected: '#E0EDFF',
    },

    divider: '#E2E8F0',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      main: '#3B82F6',  
      light: '#60A5FA',
      dark: '#2563EB',
    },

    secondary: {
      main: '#94A3B8',  
    },

    background: {
      default: '#0F172A',
      paper: '#1E293B',  
    },

    text: {
      primary: '#E2E8F0',
      secondary: '#94A3B8',
    },

    action: {
      hover: 'rgba(148, 163, 184, 0.12)',
      selected: '#3B82F6',
    },

    divider: 'rgba(148, 163, 184, 0.2)',
  },
});

export const ThemeProvider = ({ children }) => {
  // Obtener tema guardado en localStorage o usar 'light' por defecto
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('themeMode', newMode);
      return newMode;
    });
  };

  const value = {
    mode,
    toggleTheme,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};