import React, { useState, useEffect } from 'react';
import { Container, Title, Box, MantineProvider, createTheme, MantineThemeOverride, Group, Button, Menu, ActionIcon } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';

import { Link, useNavigate } from 'react-router-dom';

const theme: MantineThemeOverride = createTheme({
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

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const styles = useStyles();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the token from the local storage
    const token = localStorage.getItem('token');

    // If the token was successfully retrieved, set the authentication state to true. Otherwise, set it to false
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [])

  // Log the user out
  const handleLogout = () => {
    // Remove the token from the local storage
    localStorage.removeItem('token');
    // Set the authentication state to false
    setIsAuthenticated(false);
    // Navigate to the homepage
    navigate('/');
  }

  return (
    <MantineProvider theme={theme}>
      <Box style={styles.pageContainer}>
        <Container size="xl" px={0}>
          <Box style={styles.header}>
            <div style={styles.headerContent}>
              <Link to="/" style={styles.title}>
                <Title order={1}>Pallas's Hub</Title>
              </Link>
              <Group>
                {isAuthenticated ? (
                  <Menu opened={isMenuOpen} onChange={setIsMenuOpen}>
                    <Menu.Target>
                      <ActionIcon size="lg" variant="subtle" color="gray">
                        <IconUserCircle size={40} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown style={{ border: 'solid darkgray' }} styles={{ dropdown: { zIndex: 1000 } }}>
                      <Menu.Item>Contacts</Menu.Item>
                      <Menu.Item>Edit profile</Menu.Item>
                      <Menu.Item onClick={handleLogout}>Log Out</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <>
                    <Button component={Link} to="/login" variant="outline" style={styles.secondaryButton}>Log in</Button>
                    <Button component={Link} to="/signup" style={styles.primaryButton}>Sign up</Button>
                  </>
                )}
              </Group>
            </div>
          </Box>
          <Box style={styles.content}>
            {children}
          </Box>
        </Container>
      </Box>
    </MantineProvider>
  );
}
