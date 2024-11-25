import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { login } from '@/api/user';
import { useAppContext } from '@/app-context';
import { Layout, useStyles } from '@/components/layout';

export function LoginPage() {
  const styles = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const appContext = useAppContext();

  const navigate = useNavigate();

  const handleLogin = async () => {
    const user = await login(email, password);
    // Log the user in if it succeeded, otherwise return an error
    if (user.ok) {
      appContext.setUser(user);

      setError('');

      // Store the token in the local storage
      localStorage.setItem('token', user.token);

      // TODO: set user in context
      localStorage.setItem('email', email);

      navigate('/dashboard');
    } else {
      setError(user.message);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <Layout>
      <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Homepage
      </Link>

      <Container size="xs" mt={60}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>
          Log in
        </Title>

        {error !== '' && <p style={{ color: 'red' }}>{error}</p>}

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

          <Text size="sm" mt="xs">
            <Anchor style={{ color: 'darkblue' }} onClick={handleForgotPassword}>
              Forgot password
            </Anchor>
          </Text>
        </Paper>
      </Container>
    </Layout>
  );
}
