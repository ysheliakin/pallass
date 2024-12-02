import React from 'react';
import { Container, Group, Image, Paper, Stack, Title } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';
import groupImage from '@/images/group_example.png';
import threadImage from '@/images/thread_example.png';

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
              <Image 
                src={groupImage}
                alt="Group example"
                width={417.39}
                height={200}
              />
            </Group>
          </Paper>

          <Paper shadow="sm" p="md">
            <Group>
              <Image
                src={threadImage}
                alt="Discussion Forum thread example"
                width={417.39}
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
                <Title order={3}>Create and discover Funding Opportunities</Title>
              </div>
              <Image
                src="/api/placeholder/300/200"
                alt="Funding opportunity example"
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
