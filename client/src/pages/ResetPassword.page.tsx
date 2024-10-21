import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextInput, PasswordInput, Container, Title, Paper, Button } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';

export function ResetPasswordPage() {
  const styles = useStyles();
  const [tempcode, setTempcode] = useState('');
  const [display, setDisplay] = useState<'tempcode' | 'password'>('tempcode');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('email');

  if (email == null) {
    console.log("No email retrieved")
    return
  }

  const handleCodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Email (handleCodeSubmit): ", email)
    console.log("tempCode (handleCodeSubmit): ", tempcode)

    const response = await fetch('http://localhost:5000/validate-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, tempcode }),
    });
    
    if (response.ok) {
        setError('');
        setDisplay('password');
    } else {
        const errorData = await response.json();
        setError(errorData.message)
    }
  }

  const handlePasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Email (handlePasswordSubmit): ", email)

    const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
        setError('');
        navigate('/login');
    } else {
        const errorData = await response.json();
        setError(errorData.message)
    }
  }

  return (
    <Layout>
    {display === 'tempcode' ? (
      <Container size="xs" mt={60}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Enter your verification code</Title>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">          
            <input type="hidden" value={email} name="email" />
            <TextInput
              label="Verfication code"
              placeholder="Your verification code"
              required
              value={tempcode}
              onChange={(event) => setTempcode(event.currentTarget.value)}
            />
            <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleCodeSubmit}>Submit</Button>
        </Paper> 
      </Container>
    ) : (
      <Container size="xs" mt={60}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Reset your password</Title>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <Paper withBorder shadow="md" p={30} mt={30} radius="md"> 
            <input type="hidden" value={email} name="email" />
            <PasswordInput
              label="New password"
              placeholder="Your new password"
              required
              mt="md"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
            <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handlePasswordSubmit}>Change password</Button>
        </Paper> 
      </Container>
    )}
    </Layout>
  );
}
