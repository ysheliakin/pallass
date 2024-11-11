import React from 'react';
import { Container, Group, Image, Paper, Stack, Title } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';


export function HomePage() {
  const styles = useStyles();

  return (
    <Layout>
      <Container size="lg">
        <img src="../logo.svg" alt="Logo" style={{ display: 'block', margin: '0 auto' }} />
        <Title order={2} ta="center" mt="xl" style={styles.title}>
          Communicate with fellow researchers for free
        </Title>

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
              <Image
                src="/api/placeholder/300/200"
                alt="Discussion Forum thread example"
                width={300}
                height={200}
              />
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
              <Image
                src="/api/placeholder/300/200"
                alt="Expert Q&A session example"
                width={300}
                height={200}
              />
            </Group>
          </Paper>

          <Paper shadow="sm" p="md">
            <Group>
              <Image
                src="/api/placeholder/300/200"
                alt="Learn topic example"
                width={300}
                height={200}
              />
              <div style={{ flex: 1 }}>
                <Title order={3}>
                  Learn about a topic written by an expert / write about a topic you're an expert in
                </Title>
              </div>
            </Group>
          </Paper>

          <Paper shadow="sm" p="md">
            <Group>
              <div style={{ flex: 1 }}>
                <Title order={3}>Send direct messages</Title>
              </div>
              <Image
                src="/api/placeholder/300/200"
                alt="Direct message example"
                width={300}
                height={200}
              />
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Layout>
  );
}
