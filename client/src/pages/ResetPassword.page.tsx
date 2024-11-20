import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextInput, PasswordInput, Container, Title, Paper, Button } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';

export function ResetPasswordPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  const [tempcode, setTempcode] = useState('');
  const [display, setDisplay] = useState<'tempcode' | 'password'>('tempcode');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  if (email == null) {
    console.log("No email retrieved")
    return
  }

  const handleCodeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('http://localhost:5000/validate-code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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

    const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const handleBackToLogin = () => {
    navigate('/login')
  };

  return (
    <Layout>
      <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Homepage
      </Link>

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
