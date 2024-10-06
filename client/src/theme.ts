import { createTheme } from '@mantine/core';

export const theme = createTheme(
  {
    colors: {
      brand: [
        '#AB4D7C',
        '#793852',
        '#793852',
        '#793852',
        '#793852',
        '#793852',
        '#793852',
        '#793852',
        '#793852',
        '#793852',
      ],
      secondary: [
        '#37344b',
        '#37344b',
        '#37344b',
        '#37344b',
        '#37344b',
        '#37344b',
        '#37344b',
        '#37344b',
        '#37344b',
        '#37344b',
      ],
      Accent: ['#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572', '#d05572'],
      Background: ['#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1', '#e1f2e1'],
    },
    primaryColor: 'brand',
  }
);

export const styles = {
  pageContainer: {
    minHeight: '100vh',
  },
  header: {
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
    '&:hover': {
      backgroundColor: theme.colors.Accent[1], // FIXME
    },
  },
  secondaryButton: {},
  input: {
  },
  formContainer: {
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
}
