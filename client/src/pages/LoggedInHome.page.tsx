import React, { useState } from 'react';
import { IconUserCircle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import {
  ActionIcon,
  Button,
  Container,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { styles } from '@/theme';

export function LoggedInHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Container size="lg">
      <Group justify="apart" mb="xl">
        <Title order={2} style={styles.title}>
          Your Groups
        </Title>
        <Menu opened={isMenuOpen} onChange={setIsMenuOpen}>
          <Menu.Target>
            <ActionIcon size="lg" variant="subtle" color="gray">
              <IconUserCircle size={24} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>Contacts</Menu.Item>
            <Menu.Item>Edit profile</Menu.Item>
            <Menu.Item>Log Out</Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
        <Paper p="md" withBorder>
          Discussion forum name 1
        </Paper>
        <Paper p="md" withBorder>
          Discussion forum name 2
        </Paper>
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
  );
}
