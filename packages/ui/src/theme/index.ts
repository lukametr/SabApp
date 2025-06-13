import { createTheme, ThemeOptions } from '@mui/material/styles';
import { ThemeConfig } from './types';

const defaultConfig: ThemeConfig = {
  mode: 'light',
  primaryColor: '#1976d2',
  secondaryColor: '#dc004e',
  borderRadius: 8,
  fontFamily: '"BPG Nino Mtavruli", "Helvetica", "Arial", sans-serif',
};

export const createCustomTheme = (config: Partial<ThemeConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };

  const themeOptions: ThemeOptions = {
    palette: {
      mode: finalConfig.mode,
      primary: {
        main: finalConfig.primaryColor,
      },
      secondary: {
        main: finalConfig.secondaryColor,
      },
    },
    typography: {
      fontFamily: finalConfig.fontFamily,
    },
    shape: {
      borderRadius: finalConfig.borderRadius,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: finalConfig.borderRadius,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: finalConfig.borderRadius,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
}; 