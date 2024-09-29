import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, TextInput, Button } from '@mantine/core';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5000/loginuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    // Log the user in if it worked well, otherwise error
    if (response.ok) {
      navigate('/loggedInHomepage');
    } else {
      console.log("Error logging in");
    }
  };

  return (
    <Container>
      <Title order={2} text-align="center">Log In</Title>

      <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} type="email"/>
      <TextInput label="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} type="password"/>

      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
}
