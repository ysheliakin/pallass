import React from 'react';
import { Container, Title, Text, Button, Group, Stack, Paper, Image } from '@mantine/core';
import { Link } from 'react-router-dom';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Layout } from '../components/layout';

export function HomePage() {
  return (
    <Container size="xl" px={0}>
      <Container size="xl" py="md">
        <Group justify="space-between" align="center">
          <Title order={1} c="red">Pallas's Hub</Title>
          <Group>
            <Button component={Link} to="/login" variant="outline">Log in</Button>
            <Button component={Link} to="/signup">Sign up</Button>
          </Group>
        </Group>
      </Container>

      <Container size="lg">
        <Title order={2} ta="center" mt="xl">Communicate with fellow researchers for free</Title>
        
        <Stack gap="xl" mt="xl">
          <Paper shadow="sm" p="md">
            <Group>
              <div style={{ flex: 1 }}>
                <Title order={3}>Create and join Groups to work on projects</Title>
              </div>
              <Image src="/api/placeholder/300/200" alt="Group example" width={300} height={200} />
            </Group>
          </Paper>
          
          <Paper shadow="sm" p="md">
            <Group>
              <Image src="/api/placeholder/300/200" alt="Discussion Forum thread example" width={300} height={200} />
              <div style={{ flex: 1 }}>
                <Title order={3}>Create and follow threads in the Discussion Forum</Title>
              </div>
            </Group>
          </Paper>
          
          <Paper shadow="sm" p="md">
            <Group>
              <div style={{ flex: 1 }}>
                <Title order={3}>Join and host Expert Q&A sessions</Title>
              </div>
              <Image src="/api/placeholder/300/200" alt="Expert Q&A session example" width={300} height={200} />
            </Group>
          </Paper>
          
          <Paper shadow="sm" p="md">
            <Group>
              <Image src="/api/placeholder/300/200" alt="Learn topic example" width={300} height={200} />
              <div style={{ flex: 1 }}>
                <Title order={3}>Learn about a topic written by an expert / write about a topic you're an expert in</Title>
              </div>
            </Group>
          </Paper>
          
          <Paper shadow="sm" p="md">
            <Group>
              <div style={{ flex: 1 }}>
                <Title order={3}>Send direct messages</Title>
              </div>
              <Image src="/api/placeholder/300/200" alt="Direct message example" width={300} height={200} />
            </Group>
          </Paper>
        </Stack>
        
      </Container>

    </Container>
  );
}