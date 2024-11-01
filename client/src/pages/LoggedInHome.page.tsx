import React, { useState } from 'react';
import { Container, Title, Button, Group, Paper, ActionIcon, Grid, Text, Box, Modal } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { Layout, useStyles } from '../components/layout';

interface Group {
  id: string;
  name: string;
}

interface ScheduledSession {
  id: string;
  title: string;
  date: string;
  type: string;
}

export function LoggedInHomePage() {
  const styles = useStyles();
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'Group name 1' },
    { id: '2', name: 'Group name 2' },
  ]);
  const [scheduledSessions, setScheduledSessions] = useState<ScheduledSession[]>([
    { 
      id: '1', 
      title: 'Research Discussion',
      date: '1/20/2024, 2:00:00 PM',
      type: 'Meeting'
    }
  ]);
  const [groupToRemove, setGroupToRemove] = useState<Group | null>(null);

  const handleRemoveGroup = (group: Group) => {
    setGroupToRemove(group);
  };

  const confirmRemoveGroup = () => {
    if (groupToRemove) {
      setGroups(groups.filter(g => g.id !== groupToRemove.id));
      setGroupToRemove(null);
    }
  };

  return (
    <Layout>
      <Container size="lg">
        <Grid gutter="xl">
          <Grid.Col span={7}>
            <Box mb="xl">
              <Title order={2} style={styles.title} mb="md">Your Groups</Title>
              <Box mb="md">
                {groups.map(group => (
                  <Paper 
                    key={group.id} 
                    p="md" 
                    withBorder 
                    mb="xs"
                    style={{ position: 'relative' }}
                  >
                    {group.name}
                    <ActionIcon
                      style={{ position: 'absolute', top: 8, right: 8 }}
                      size="sm"
                      onClick={() => handleRemoveGroup(group)}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Paper>
                ))}
              </Box>
              <Group>
                <Button 
                  component={Link} 
                  to="/create-group" 
                  variant="subtle" 
                  color="violet"
                >
                  + Create group
                </Button>
                <Button 
                  component={Link} 
                  to="/join-group" 
                  variant="subtle" 
                  color="violet"
                >
                  + Join group
                </Button>
              </Group>
            </Box>

            <Box mb="xl">
              <Title order={3} mb="md" style={styles.title}>Discussion Forum threads you follow</Title>
              <Box mb="md">
                <Paper p="md" withBorder mb="xs">Discussion forum name 1</Paper>
                <Paper p="md" withBorder mb="xs">Discussion forum name 2</Paper>
              </Box>
              <Group>
                <Button 
                  component={Link} 
                  to="/create-thread" 
                  variant="subtle" 
                  color="violet"
                >
                  + Create a thread
                </Button>
                <Button 
                  component={Link} 
                  to="/discover-threads" 
                  variant="subtle" 
                  color="violet"
                >
                  + Discover threads
                </Button>
              </Group>
            </Box>

            <Box mb="xl">
              <Title order={3} mb="md" style={styles.title}>Expert Q&A Sessions</Title>
              <Group>
                <Button 
                  component={Link} 
                  to="/host-qa" 
                  style={styles.primaryButton}
                >
                  Host Q&A session
                </Button>
                <Button 
                  component={Link} 
                  to="/join-qa" 
                  style={styles.primaryButton}
                >
                  Join Q&A session
                </Button>
              </Group>
            </Box>

            <Box mb="xl">
              <Title order={3} mb="md" style={styles.title}>Online Sessions</Title>
              <Group>
                <Button 
                  component={Link} 
                  to="/create-session" 
                  style={styles.primaryButton}
                >
                  Create Online Session
                </Button>
                <Button 
                  component={Link} 
                  to="/join-session" 
                  style={styles.primaryButton}
                >
                  Join Online Session
                </Button>
              </Group>
            </Box>

            <Box>
              <Title order={3} mb="md" style={styles.title}>Learn</Title>
              <Group>
                <Button style={styles.primaryButton}>Write about a topic</Button>
                <Button style={styles.primaryButton}>Learn about a topic</Button>
              </Group>
            </Box>
          </Grid.Col>

          <Grid.Col span={5}>
            <Title order={2} style={styles.title} mb="md">Your Scheduled Sessions</Title>
            {scheduledSessions.map(session => (
              <Paper
                key={session.id}
                p="md"
                withBorder
                mb="xs"
                style={{
                  borderLeft: '4px solid #AB4D7C',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  <Text fw="500">{session.title}</Text>
                  <Text size="sm" color="dimmed">{session.date}</Text>
                </Box>
                <Text size="sm" color="dimmed">{session.type}</Text>
              </Paper>
            ))}
          </Grid.Col>
        </Grid>

        <Modal
          opened={groupToRemove !== null}
          onClose={() => setGroupToRemove(null)}
          title="Confirm Group Removal"
          centered 
          size="sm" 
        >
          <Text>Are you sure you would like to leave the group "{groupToRemove?.name}"?</Text>
          <Group mt="md" justify="flex-end">
            <Button onClick={() => setGroupToRemove(null)} variant="outline">Cancel</Button>
            <Button onClick={confirmRemoveGroup} color="red">Leave Group</Button>
          </Group>
        </Modal>
      </Container>
    </Layout>
  );
}