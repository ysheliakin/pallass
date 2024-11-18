import React, { useState } from 'react';
import { Container, Title, TextInput, PasswordInput, Button, Paper } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';

export function JoinQASession() {
  const styles = useStyles();
  const [sessionId, setSessionId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleJoinSession = () => {
    console.log('Join session data:', { sessionId, password, name });
    // Handle join session logic here
  };

  return (
    <Layout>
      <Container size="sm" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Join Q&A Session</Title>
        
        <Paper style={{...styles.formContainer, backgroundColor: 'white'}} withBorder shadow="md" p={30} mt={30} radius="md">
          <TextInput
            label="Session ID"
            placeholder="Enter session ID"
            required
            value={sessionId}
            onChange={(event) => setSessionId(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter session password"
            required
            mt="md"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />
          <TextInput
            label="Name"
            placeholder="Enter your name"
            required
            mt="md"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />
          <Button 
            fullWidth 
            mt="xl" 
            style={styles.primaryButton}
            onClick={handleJoinSession}
          >
            Join Session
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}