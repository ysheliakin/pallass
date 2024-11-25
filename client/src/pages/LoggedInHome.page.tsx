import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Group, Paper, SimpleGrid, Title } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';

interface Threads {
  ID: number;
  Firstname: string;
  Lastname: string;
  Title: string;
  Content: string;
  Category: string;
  Upvotes: number;
  Uuid: number;
  UserEmail: string;
}

export function LoggedInHomePage() {
  const styles = useStyles();
  const [threadsData, setThreadsData] = useState<Threads[]>([]);
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    // Get the threads upvoted by the user
    const fetchThreadData = async () => {
      const response = await fetch(`http://localhost:5000/getThreads`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error('Error in the response');
      }

      const data = await response.json();
      setThreadsData(data);
    };

    fetchThreadData();
  }, []);

  const handleViewThread = (threadID: number, threadUuid: number) => {
    {
      localStorage.setItem('threadID', threadID.toString());
      navigate(`/thread/${threadUuid}`);
    }
  };

  return (
    <Layout>
      <Container size="lg">
        <Group justify="apart" mb="xl">
          <Title order={2} style={styles.title}>
            Your Groups
          </Title>
        </Group>

        <SimpleGrid cols={2} spacing="md" mb="xl">
          <Paper p="md" withBorder>
            Group name 1
          </Paper>
          <Paper p="md" withBorder>
            Group name 2
          </Paper>
        </SimpleGrid>

        <Group mb="xl">
          <Button component={Link} to="/create-group" variant="subtle" color="violet">
            + Create group
          </Button>
          <Button component={Link} to="/join-group" variant="subtle" color="violet">
            + Join group
          </Button>
        </Group>

        <Title order={3} mb="md" style={styles.title}>
          Discussion Forum threads you follow
        </Title>
        <SimpleGrid cols={2} spacing="md" mb="xl">
          {threadsData.map((threadData) => (
            <Button
              key={threadData.ID}
              style={{ margin: '5px' }}
              onClick={() => handleViewThread(threadData.ID, threadData.Uuid)}
            >
              {threadData.Title}
            </Button>
          ))}
        </SimpleGrid>

        <Group mb="xl">
          <Button component={Link} to="/create-thread" variant="subtle" color="violet">
            + Create a thread
          </Button>
          <Button component={Link} to="/discover-threads" variant="subtle" color="violet">
            + Discover threads
          </Button>
        </Group>

        <Title order={3} mb="md" style={styles.title}>
          Expert Q&A Sessions
        </Title>
        <Group mb="xl">
          <Button component={Link} to="/host-qa" style={styles.primaryButton}>
            Host Q&A session
          </Button>
          <Button component={Link} to="/join-qa" style={styles.primaryButton}>
            Join Q&A session
          </Button>
        </Group>

        <Title order={3} mb="md" style={styles.title}>
          Learn
        </Title>
        <Group>
          <Button style={styles.primaryButton}>Write about a topic</Button>
          <Button style={styles.primaryButton}>Learn about a topic</Button>
        </Group>
      </Container>
    </Layout>
  );
}
