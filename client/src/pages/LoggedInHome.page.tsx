import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Group, Paper, SimpleGrid, Title } from '@mantine/core';
import { getUser } from '@/api/user';
import { Layout, useStyles } from '../components/layout';

export function LoggedInHomePage() {
  const styles = useStyles();

  useEffect(() => {
    const run = async () => {
      const user = await getUser(localStorage.getItem('token'));
    };
    run();
  }, []);

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
          {/*<Paper p="md" withBorder to="/signup">Discussion forum name 1</Paper>
          <Paper p="md" withBorder>Discussion forum name 2</Paper>*/}
          <Button component={Link} to="/discussion" style={styles.primaryButton}>
            Discussion forum name 1
          </Button>
          <Button style={styles.primaryButton}>Discussion forum name 2</Button>
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
