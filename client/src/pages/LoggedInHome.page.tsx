import React, { useState } from 'react';
import { Container, Title, Button, Group, Paper, Menu, ActionIcon, SimpleGrid } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Layout, useStyles } from '../components/layout';

export function LoggedInHomePage() {
  const style = useStyles();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Layout>
      <Container size="lg">
        <Group justify="space-between" align="center" mb="xl">
          <Title order={2} style={style.title}>Your Groups</Title>
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
          <Paper p="md" withBorder>Group name 1</Paper>
          <Paper p="md" withBorder>Group name 2</Paper>
        </SimpleGrid>

        <Group mb="xl">
          <Button 
            component={Link} 
            to="/create-group" 
            variant="outline" 
            style={style.secondaryButton}
          >
            + Create group
          </Button>
          <Button 
            component={Link} 
            to="/join-group" 
            variant="outline" 
            style={style.secondaryButton}
          >
            + Join group
          </Button>
        </Group>

        <Title order={3} mb="md" style={style.title}>Discussion Forum threads you follow</Title>
        <SimpleGrid cols={2} spacing="md" mb="xl">
          <Paper p="md" withBorder>Discussion forum name 1</Paper>
          <Paper p="md" withBorder>Discussion forum name 2</Paper>
        </SimpleGrid>

        <Group mb="xl">
          <Button variant="outline" style={style.secondaryButton}>+ Create a thread</Button>
          <Button variant="outline" style={style.secondaryButton}>+ Discover threads</Button>
        </Group>

        <Title order={3} mb="md" style={style.title}>Expert Q&A Sessions</Title>
        <Group mb="xl">
          <Button 
            component={Link} 
            to="/host-qa" 
            style={style.primaryButton}
          >
            Host Q&A session
          </Button>
          <Button 
            component={Link} 
            to="/join-qa" 
            style={style.primaryButton}
          >
            Join Q&A session
          </Button>
        </Group>

        <Title order={3} mb="md" style={style.title}>Learn</Title>
        <Group>
          <Button style={style.primaryButton}>Write about a topic</Button>
          <Button style={style.primaryButton}>Learn about a topic</Button>
        </Group>
      </Container>
    </Layout>
  );
}