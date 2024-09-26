import React, { useState } from 'react';
import { Container, Title, TextInput, PasswordInput, Button, Paper, Text, Box } from '@mantine/core';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <Container size="xs" mt={60}>
        <Title order={2} ta="center" mt="xl" c="white">Log in</Title>
        
        <Paper withBorder shadow="md" p={30} mt={30} radius="md" bg="dark.7">
          <TextInput
            label="Email address"
            placeholder="hello@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            styles={(theme) => ({
              label: { color: theme.colors.gray[5] },
              input: { backgroundColor: theme.colors.dark[5], color: theme.white },
            })}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            styles={(theme) => ({
              label: { color: theme.colors.gray[5] },
              input: { backgroundColor: theme.colors.dark[5], color: theme.white },
            })}
          />
          <Button fullWidth mt="xl" color="brand" onClick={handleLogin}>
            Log In
          </Button>
        </Paper>

        <Box mt="xl" ta="center">
          <Button component={Link} to="/signup" variant="outline" color="brand">
            Create account
          </Button>
        </Box>

      </Container>
    </Layout>
  );
}