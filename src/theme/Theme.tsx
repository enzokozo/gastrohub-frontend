import { createTheme } from '@mui/material/styles';

// Configurações de tipografia comuns a ambos os temas
const commonSettings = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009688', // Teal
    },
    secondary: {
      main: '#ff9800', // Orange
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    }
  },
  ...commonSettings,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#80cbc4', // Lighter teal
    },
    secondary: {
      main: '#ffb74d', // Lighter orange
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    }
  },
  ...commonSettings,
});