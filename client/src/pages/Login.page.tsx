import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useStyles } from '@/theme';

export function LoginPage() {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/dashboard');
  };

  return (
    <Container size="xs" mt={60}>
      <Title order={2} ta="center" mt="xl" style={styles.title}>
        Log in
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email address"
          placeholder="hello@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          styles={{ input: styles.input }}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          styles={{ input: styles.input }}
        />
        <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleLogin}>
          Log In
        </Button>
      </Paper>
    </Container>
  );
}
