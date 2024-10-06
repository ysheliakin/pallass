import { createTheme } from '@mantine/core';

export const theme = createTheme({
  colors: {
    brand: ['#AB4D7C', '#793852', '#793852', '#793852', '#793852', '#793852', '#793852', '#793852', '#793852', '#793852'],
    secondary: ['#37344b', '#37344b', '#37344b', '#37344b', '#37344b', '#37344b', '#37344b', '#37344b', '#37344b', '#37344b'],
    accent: ['#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572'],
    background: ['#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1'],
    light: ['#fdf9f1', '#fdf9f1', '#fdf9f1', '#fdf9f1', '#fdf9f1', '#fdf9f1', '#fdf9f1', '#fdf9f1', '#fdf9f1', '#fdf9f1'],
  },
  primaryColor: 'brand',
});

export const useStyles = () => ({
  pageContainer: {
    backgroundColor: theme.colors?.light?.[0],
    minHeight: '100vh',
    color: theme.colors?.secondary?.[0],
  },
  header: {
    backgroundColor: theme.colors?.secondary?.[0],
    padding: '1rem',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: theme.colors?.brand?.[0],
    textDecoration: 'none',
  },
  content: {
    paddingTop: 80,
    paddingBottom: 20,
  },
  primaryButton: {
    backgroundColor: theme.colors?.accent?.[0],
    color: theme.colors?.light?.[0],
    '&:hover': {
      backgroundColor: theme.colors?.accent?.[1],
    },
  },
  secondaryButton: {
    color: theme.colors?.light?.[0],
    borderColor: theme.colors?.light?.[0],
    '&:hover': {
      backgroundColor: theme.colors?.light?.[0],
      color: theme.colors?.secondary?.[0],
    },
  },
  input: {
    backgroundColor: theme.colors?.light?.[0],
    color: theme.colors?.secondary?.[0],
    '&::placeholder': {
      color: theme.colors?.secondary?.[2],
    },
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
});
