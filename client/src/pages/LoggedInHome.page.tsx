import React, { useState, useEffect } from 'react';
import { Container, Title, Button, Group, Paper, SimpleGrid, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { Layout, useStyles } from '@/components/layout';

interface Threads {
  ID: number, 
  Firstname: string, 
  Lastname: string, 
  Title: string, 
  Content: string, 
  Category: string, 
  Uuid: number,
  UserEmail: string
}

export function LoggedInHomePage() {
  const styles = useStyles();
  const [threadsData, setThreadsData] = useState<Threads[]>([]);
  // Temporary
  const [groupUuid, setGroupUuid] = useState("")

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  useEffect(() => {
    // Get the threads upvoted by the user
    const fetchThreadData = async () => {
        const response = await fetch(`http://localhost:5000/getUpvotedThreads/${email}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    
        // Check if the response is ok
        if (!response.ok) {
            throw new Error('Error in the response');
        }

        const data = await response.json();
        console.log("data: ", data)
        setThreadsData(data);
      }

      setGroupUuid("cfc53e71-1958-4137-b12c-ac2757b59761")

      fetchThreadData();
  }, [])

  const handleViewThread = (threadID: number) => {{
    localStorage.setItem("threadID", threadID.toString());
  }}

  const handleViewGroup = (groupID: number) => {{
    localStorage.setItem("groupID", groupID.toString());
  }}

  return (
    <Layout>
      <Container size="lg">
        <Group justify="apart" mb="xl">
          <Title order={2} style={styles.title}>
            Your Groups
          </Title>
        </Group>

        <SimpleGrid cols={2} spacing="md" mb="xl">
          <Paper p="md" withBorder component={Link} onClick={() => handleViewGroup(25)} to={`/group/${groupUuid}`}>
            Group ID 6
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

        <Title order={3} mb="md" style={styles.title}>Discussion Forum threads you upvoted</Title>
        {/* If the user upvoted threads, display them. Otherwise, display a message. */}
        {threadsData ? (
          <SimpleGrid cols={2} spacing="md" mb="xl">          
            {threadsData.map((threadData) => (
              <Paper 
                key={threadData.ID}
                p="md" 
                withBorder
                component={Link}
                onClick={() => handleViewThread(threadData.ID)}
                to={`/thread/${threadData.Uuid}`}
              >
                <Text fw={500} color="black">{threadData.Title}</Text>
                <Text size="sm" color="dimmed" mt="xs">
                  Category: {threadData.Category}
                </Text>            
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Text mb="md">You have not upvoted any discussion threads yet.</Text>
        )}

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
