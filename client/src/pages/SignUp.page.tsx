import React, { useState } from 'react';
import { Container, Title, TextInput, PasswordInput, Button, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Layout, useStyles } from '../components/layout';

export function SignUpPage() {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <Container size="xs" mt={60}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Sign up for free</Title>
        
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
          <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleSignUp}>
            Create account
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}