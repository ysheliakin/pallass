import React, { useEffect, useState } from 'react';
import { IconUserCircle } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { Divider } from '@mantine/core';
import {
  ActionIcon,
  Box,
  Button,
  Container,
  createTheme,
  Group,
  MantineProvider,
  MantineThemeOverride,
  Menu,
  Title,
} from '@mantine/core';
import { useAppContext } from '@/app-context';
import logo from '../../logo.svg';

const theme: MantineThemeOverride = createTheme({
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
    accent: [
      '#d05572',
      '#d05572',
      '#d05572',
      '#d05572',
      '#d05572',
      '#d05572',
      '#d05572',
      '#d05572',
      '#d05572',
      '#d05572',
    ],
    background: [
      '#e1f2e1',
      '#e1f2e1',
      '#e1f2e1',
      '#e1f2e1',
      '#e1f2e1',
      '#e1f2e1',
      '#e1f2e1',
      '#e1f2e1',
      '#e1f2e1',
      '#e1f2e1',
    ],
    light: [
      '#fdf9f1',
      '#fdf9f1',
      '#fdf9f1',
      '#fdf9f1',
      '#fdf9f1',
      '#fdf9f1',
      '#fdf9f1',
      '#fdf9f1',
      '#fdf9f1',
      '#fdf9f1',
    ],
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const appContext = useAppContext();

  const email = localStorage.getItem('email');

  // Log the user out
  const handleLogout = () => {
    // Remove the token from the local storage
    localStorage.removeItem('token');
    // Set the authentication state to false
    appContext.setUser(null);
    // Navigate to the homepage
    navigate('/');
  };

  // Navigate to the "Edit Profile" page
  const handleEditProfile = () => {
    navigate('/edit-profile');
  }

  return (
    <MantineProvider theme={theme}>
      <Box style={styles.pageContainer}>
        <Container size="xl" px={0}>
          <Box style={styles.header}>
            <div style={styles.headerContent}>
              <img src={logo} alt="Logo" height={40} />
              <Title style={styles.title} order={1}>Pallas's Hub</Title>

              <Group>
                {appContext.user?.id ? (
                  <Menu 
                    opened={isMenuOpen} 
                    onChange={setIsMenuOpen}
                  >
                    <Menu.Target>
                      <ActionIcon size="lg" variant="subtle" color="gray">
                        <IconUserCircle size={40} />
                      </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown
                      style={{ border: 'solid darkgray' }}
                      styles={{ dropdown: { zIndex: 1000 } }}
                    >
                      <Menu.Item
                        style={{
                          backgroundColor: 'transparent',
                          cursor: 'default',
                          fontWeight: 'bold',
                          textAlign: 'center'
                        }}
                      >
                        {email}
                      </Menu.Item>
                      <Divider
                        style={{
                          height: 4,
                          backgroundColor: '#5B5A60',
                        }}
                      />
                      <Menu.Item style={{ textAlign: 'center' }} onClick={handleEditProfile}>Edit profile</Menu.Item>
                      <Divider />
                      <Menu.Item style={{ textAlign: 'center' }} onClick={handleLogout}>Log Out</Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      variant="outline"
                      style={styles.secondaryButton}
                    >
                      Log in
                    </Button>
                    <Button component={Link} to="/signup" style={styles.primaryButton}>
                      Sign up
                    </Button>
                  </>
                )}
              </Group>
            </div>
          </Box>
          <Box style={styles.content}>{children}</Box>
        </Container>
      </Box>
    </MantineProvider>
  );
}
