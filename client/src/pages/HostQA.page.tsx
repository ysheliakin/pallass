import React, { useState } from 'react';
import { Button, Container, Paper, Textarea, TextInput, Title } from '@mantine/core';
import { useStyles } from '@/theme';

export function HostQASession() {
  const styles = useStyles();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [topic, setTopic] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateSession = () => {
    // Ima put the sesssion creation logic here later
    console.log('Session data:', { title, time, topic, fieldOfStudy, description });
    // Probably have this work with an API or something else
  };

  return (
    <Container size="sm" mt={30}>
      <Title order={2} ta="center" mt="xl" style={styles.title}>
        Host Q&A Session
      </Title>

      {/* CHANGE: Updated Paper component styles */}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Title"
          placeholder="Enter session title"
          required
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
          styles={{ input: styles.input }}
        />
        <TextInput
          label="Time"
          placeholder="Enter session time"
          required
          mt="md"
          value={time}
          onChange={(event) => setTime(event.currentTarget.value)}
          styles={{ input: styles.input }}
        />
        <TextInput
          label="Topic/Subject"
          placeholder="Enter topic or subject"
          required
          mt="md"
          value={topic}
          onChange={(event) => setTopic(event.currentTarget.value)}
          styles={{ input: styles.input }}
        />
        <TextInput
          label="Field of Study"
          placeholder="Enter field of study"
          required
          mt="md"
          value={fieldOfStudy}
          onChange={(event) => setFieldOfStudy(event.currentTarget.value)}
          styles={{ input: styles.input }}
        />
        <Textarea
          label="Description"
          placeholder="Enter session description"
          required
          mt="md"
          minRows={4}
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
          styles={{ input: styles.input }}
        />
        <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleCreateSession}>
          Create session with link
        </Button>
      </Paper>
    </Container>
  );
}
