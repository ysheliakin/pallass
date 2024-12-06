import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Group, Paper, SimpleGrid, Text, Title } from '@mantine/core';
import { base } from '@/api/base';
import { getUserPosts, Post } from '@/api/post';
import { useAppContext } from '@/app-context';
import { Layout, useStyles } from '@/components/layout';


interface Threads {
  ID: number;
  Firstname: string;
  Lastname: string;
  Title: string;
  Content: string;
  Category: string;
  Uuid: number;
  UserEmail: string;
}

interface Groups {
  ID: number;
  Name: string;
  Description: string;
  CreatedAt: string;
  Uuid: number;
  Public: string;
  Notifications: string;
  ID_2: string;
  GroupID: string;
  Role: string;
  JoinedAt: string;
  UserEmail: string;
}

export function LoggedInHomePage() {
  const styles = useStyles();
  const { user } = useAppContext();
  const [threadsData, setThreadsData] = useState<Threads[]>([]);
  const [groupsData, setGroupsData] = useState<Groups[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const email = localStorage.getItem('email');

  // Runs on initialization of the page
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userPosts = await getUserPosts(user!.id);
        if (userPosts?.length > 0) {
          setPosts(userPosts);
        }

        // Get the threads upvoted by the user
        const upvotedThreads = await fetch(`${base}/getUpvotedThreads/${email}`, {
          method: 'GET',
        });

        // Check if the response is ok
        if (!upvotedThreads.ok) {
          throw new Error('Error in the response');
        }

        const upvotedThreadsData = await upvotedThreads.json();
        setThreadsData(upvotedThreadsData);

        // Get the groups that the user is a part of
        const groupsApartOf = await fetch(`${base}/getGroups/${email}`, {
          method: 'GET',
        });

        // Check if the response is ok
        if (!groupsApartOf.ok) {
          throw new Error('Error in the response');
        }

        const groupsApartOfData = await groupsApartOf.json();
        setGroupsData(groupsApartOfData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [email]);

  const handleViewThread = (threadID: number) => {
    {
      localStorage.setItem('threadID', threadID.toString());
    }
  };

  const handleViewGroup = (groupID: number) => {
    {
      localStorage.setItem('groupID', groupID.toString());
    }
  };

  return (
    <Layout>
      <Container size="lg">
        <Group justify="apart" mb="xl" style={{ marginTop: 20 }}>
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
                <Text fw={500} color="black">
                  {groupData.Name}
                </Text>

                {groupData.Public ? (
                  <Text size="sm" color="dimmed" mt="xs">
                    Public
                  </Text>
                ) : (
                  <Text size="sm" color="dimmed" mt="xs">
                    Private
                  </Text>
                )}
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Text mb="md">You have not joined any groups yet.</Text>
        )}

        <Group mb="xl">
          <Button component={Link} to="/create-group" variant="subtle" color="violet">
            + Create group
          </Button>
          <Button component={Link} to="/join-group" variant="subtle" color="violet">
            + Join group
          </Button>
        </Group>

        <Group justify="apart" mb="xl" style={{ marginTop: 50 }}>
          <Title order={2} style={styles.title}>
            Your Posts
          </Title>
        </Group>

        {posts.length > 0 ? (
          <SimpleGrid cols={2} spacing="md" mb="xl">
            {posts.map((post) => (
              <Paper key={post.ID} p="md" withBorder component={Link} to={`/post/${post.ID}`}>
                <Text fw={500} color="black">
                  {post.Title}
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        ) : (
          <Text mb="md">You have not created any posts yet.</Text>
        )}

        <Group mb="xl">
          <Button component={Link} to="/post/create" variant="subtle" color="violet">
            + Write a post
          </Button>
        </Group>

        <Group justify="apart" mb="xl" style={{ marginTop: 50 }}>
          <Title order={2} style={styles.title}>
            Your Upvoted Discussion Forum Threads
          </Title>
        </Group>
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
                <Text fw={500} color="black">
                  {threadData.Title}
                </Text>
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
            + Create thread
          </Button>
          <Button component={Link} to="/discover-threads" variant="subtle" color="violet">
            + Discover threads
          </Button>
        </Group>

        <Group justify="apart" mb="xl" style={{ marginTop: 50 }}>
          <Title order={2} style={styles.title}>
            Funding Opportunities
          </Title>
        </Group>

        <Group mb="xl">
          <Button
            component={Link}
            to="/funding-opportunities/create"
            variant="subtle"
            color="violet"
          >
            + Create a funding opportunity
          </Button>
          <Button component={Link} to="/funding-opportunities" variant="subtle" color="violet">
            + Discover funding opportunities
          </Button>
        </Group>
      </Container>
    </Layout>
  );
}
