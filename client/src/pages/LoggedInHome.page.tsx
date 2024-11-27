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

interface Groups {
  ID: number, 
  Name: string, 
  Description: string, 
  CreatedAt: string
  Uuid: number,
  Public: string,
  Notifications: string,
  ID_2: string,
  GroupID: string,
  Role: string,
  JoinedAt: string,
  UserEmail: string
}

export function LoggedInHomePage() {
  const styles = useStyles();
  const [threadsData, setThreadsData] = useState<Threads[]>([]);
  const [groupsData, setGroupsData] = useState<Groups[]>([]);
  // Temporary
  const [groupUuid, setGroupUuid] = useState("")

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');

  // Runs on initialization of the page
  useEffect(() => {
    const fetchData = async() => {
      try {
        // Get the threads upvoted by the user
        const upvotedThreads = await fetch(`http://localhost:5000/getUpvotedThreads/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        // Check if the response is ok
        if (!upvotedThreads.ok) {
          throw new Error('Error in the response');
        }

        const upvotedThreadsData = await upvotedThreads.json();
        setThreadsData(upvotedThreadsData);

        // Get the groups that the user is a part of
        const groupsApartOf = await fetch(`http://localhost:5000/getGroups/${email}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        // Check if the response is ok
        if (!groupsApartOf.ok) {
          throw new Error('Error in the response');
        }

        const groupsApartOfData = await groupsApartOf.json();
        setGroupsData(groupsApartOfData)
      } catch(error) {
        console.error(error)
      }
    };

    fetchData();
  }, [email]);

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

        {/* If the user is a part of groups, display them. Otherwise, display a message. */}
        {groupsData ? (
          <SimpleGrid cols={2} spacing="md" mb="xl">          
            {groupsData.map((groupData) => (
              <Paper 
                key={groupData.ID}
                p="md" 
                withBorder
                component={Link}
                onClick={() => handleViewGroup(groupData.ID)}
                to={`/group/${groupData.Uuid}`}
              >
                <Text fw={500} color="black">{groupData.Name}</Text>
                
                {groupData.Public ? (
                  <Text size="sm" color="dimmed" mt="xs">Public</Text>
                ) : (
                  <Text size="sm" color="dimmed" mt="xs">Private</Text>
                )}
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Text mb="md">You have not upvoted any discussion threads yet.</Text>
        )}

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
