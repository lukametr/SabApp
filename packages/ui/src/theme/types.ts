import { Theme } from '@mui/material/styles';

export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  secondaryColor: string;
  borderRadius: number;
  fontFamily: string;
}

export interface CustomTheme extends Theme {
  custom: {
    borderRadius: number;
    fontFamily: string;
  };
} 