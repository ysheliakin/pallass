import React, { useState } from 'react';
import { Container, Title, TextInput, PasswordInput, Button, Paper, Group, Text, Box } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Layout, useStyles } from '@/components/layout';

export function SignUpPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [socialLinks, setSocialLinks] = useState(['']);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    // Here you would handle the sign-up logic
    const response = await fetch('http://localhost:5000/registeruser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, password, organization, fieldOfStudy, jobTitle, socialLinks }),
    });

    // Log the user in if it worked well, otherwise error
    if (response.ok) {
      navigate('/dashboard');
    } else {
      const errorData = await response.json();
      setError(errorData.message)
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, '']);
  };

  const updateSocialLink = (index: number, value: string) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = value;
    setSocialLinks(updatedLinks);
  };

  return (
    <Layout>
      <Container size="sm" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Sign up for free</Title>

        {error && <p style={{ color: "red" }}>{error}</p>}
        
        <Paper withBorder shadow="md" p={30} mt={30} radius="md" style={{ backgroundColor: "#fff" }}>
          <Group grow mb="md">
            <TextInput
              label="First name"
              placeholder="Your first name"
              required
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
              styles={{ input: styles.input }}
            />
            <TextInput
              label="Last name"
              placeholder="Your last name"
              required
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              styles={{ input: styles.input }}
            />
          </Group>

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
          <TextInput
            label="Institution/organization you work at"
            placeholder='Institution name (or "Independent")'
            mt="md"
            value={organization}
            onChange={(event) => setOrganization(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />
          <TextInput
            label="Your field of study"
            placeholder="e.g., Computer Science, Biology"
            required
            mt="md"
            value={fieldOfStudy}
            onChange={(event) => setFieldOfStudy(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />
          <TextInput
            label="Your job title"
            placeholder="e.g., Researcher, Professor"
            mt="md"
            value={jobTitle}
            onChange={(event) => setJobTitle(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <Box mt="md">
            <Text size="sm" style={{ marginBottom: 5 }}>Social media accounts</Text>
            {socialLinks.map((link, index) => (
              <TextInput
                key={index}
                placeholder="https://..."
                value={link}
                onChange={(event) => updateSocialLink(index, event.currentTarget.value)}
                styles={{ input: styles.input }}
                mt={5}
              />
            ))}
            <Button onClick={addSocialLink} variant="outline" size="xs" mt={5} style={styles.secondaryButton}>
              + Add link
            </Button>
          </Box>

          <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleSignUp}>
            Create account
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}