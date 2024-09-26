import React, { useState } from 'react';
import { Container, Title, TextInput, PasswordInput, Button, Group, Paper, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout';

export function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Here you would typically handle the sign-up logic
    // For now, we'll just redirect to the logged-in homepage
    navigate('/dashboard');
  };

  return (
    <Layout>
      <Container size="sm">
        <Title order={2} ta="center" mt="xl">Sign up for free</Title>
        
        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Email address"
            placeholder="hello@example.com"
            required
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          {/* Add other sign-up fields here */}
          <Button fullWidth mt="xl" onClick={handleSignUp}>
            Create account
          </Button>
        </Paper>

      </Container>
    </Layout>
  );
}