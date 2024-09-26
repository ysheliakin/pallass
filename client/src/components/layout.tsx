import React from 'react';
import { Container, Title, Box, MantineProvider, createTheme } from '@mantine/core';
import { Link } from 'react-router-dom';

const theme = createTheme({
  colors: {
    brand: ['#ff8447', '#ff8447', '#ff8447', '#ff8447', '#ff8447', '#ff8447', '#ff8447', '#ff8447', '#ff8447', '#ff8447'],
  },
  primaryColor: 'brand',
});

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <MantineProvider theme={theme}>
      <Box style={{ backgroundColor: '#111111', minHeight: '100vh', color: 'white' }}>
        <Container size="xl" px={0}>
          <Box py="md" px="md" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, backgroundColor: '#111111' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Title order={1} c="red">
                Pallas's Hub
              </Title>
            </Link>
          </Box>
          <Box pt={80} pb={20}>  {/* Increased padding-top and added padding-bottom */}
            {children}
          </Box>
        </Container>
      </Box>
    </MantineProvider>
  );
}