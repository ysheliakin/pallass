import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, TextInput, Button } from '@mantine/core';

export function SignupPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('http://localhost:4020/registeruser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, organization, fieldOfStudy, jobTitle }),
    });

    // Log the user in if it worked well, otherwise error
    if (response.ok) {
      navigate('/loginuser');
    } else {
      console.log("Error signing up");
    }
  };

  return (
    <Container>
      <Title order={2} text-align="center">Sign Up</Title>

      <TextInput label="First Name" value={firstName} onChange={(e) => setFirstName(e.currentTarget.value)}/>
      <TextInput label="Last Name" value={lastName} onChange={(e) => setLastName(e.currentTarget.value)}/>
      <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} type="email"/>
      <TextInput label="Password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} type="password"/>
      <TextInput label="Organization" value={organization} onChange={(e) => setOrganization(e.currentTarget.value)} type="organization"/>
      <TextInput label="Field of Study" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.currentTarget.value)} type="fieldOfStudy"/>
      <TextInput label="Job title" value={jobTitle} onChange={(e) => setJobTitle(e.currentTarget.value)} type="jobTitle"/>

      <Button onClick={handleSubmit}>Submit</Button>
    </Container>
  );
}
