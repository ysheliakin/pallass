import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppShell, Button, ColorSchemeScript, Group, Title } from '@mantine/core';
import { styles } from '@/theme';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

export function Layout() {
  return (
    <AppShell padding="md">
      <AppShell.Header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.title}>
            <Title order={1}>Pallas's Hub</Title>
          </Link>
          <Group>
            <ColorSchemeToggle />
            <Button component={Link} to="/login" variant="default">
              Log in
            </Button>
            <Button component={Link} to="/signup" style={styles.primaryButton}>
              Sign up
            </Button>
          </Group>
        </div>
      </AppShell.Header>
      <AppShell.Main style={{ padding: '80px 0 20px' }}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
