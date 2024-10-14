import React, { useState } from 'react';
import { Container, Title, TextInput, Radio, Textarea, Button, Paper, Group, Stack, Box } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';

export function CreateGroup() {
  const styles = useStyles();
  const [name, setName] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [notifications, setNotifications] = useState('on');
  const [description, setDescription] = useState('');

  const handleCreateGroup = () => {
    console.log('Group data:', { name, users, privacy, notifications, description });
    // Handle group creation logic here
  };

  const handleAddUser = () => {
    if (newUser && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setNewUser('');
    }
  };

  return (
    <Layout>
      <Container size="sm" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Create Group</Title>
        
        <Paper 
          withBorder 
          shadow="md" 
          p={30} 
          mt={30} 
          radius="md" 
          style={{...styles.formContainer, backgroundColor: 'white'}}
        >
          <TextInput
            label="Name"
            placeholder="Enter group name"
            required
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <Box mt="md">
            <Group align="flex-end" gap="sm">
              <TextInput
                label="Add Users"
                placeholder="Enter user email"
                value={newUser}
                onChange={(event) => setNewUser(event.currentTarget.value)}
                styles={{ input: styles.input, root: { flexGrow: 1 } }}
              />
              <Button onClick={handleAddUser} style={styles.primaryButton}>Add</Button>
            </Group>
            {users.length > 0 && (
              <Box mt="xs">
                <Title order={6}>Added Users:</Title>
                {users.map((user, index) => (
                  <Box key={index}>{user}</Box>
                ))}
              </Box>
            )}
          </Box>

          <Group grow mt="md" align="flex-start">
            <Stack gap="xs">
              <Title order={6}>Privacy:</Title>
              <Radio.Group
                value={privacy}
                onChange={setPrivacy}
              >
                <Radio value="private" label="Private" />
                <Radio value="public" label="Public" />
              </Radio.Group>
            </Stack>

            <Stack gap="xs">
              <Title order={6}>Notifications:</Title>
              <Radio.Group
                value={notifications}
                onChange={setNotifications}
              >
                <Radio value="on" label="On" />
                <Radio value="off" label="Off" />
              </Radio.Group>
            </Stack>
          </Group>

          <Textarea
            label="Description"
            placeholder="Enter group description"
            required
            mt="md"
            minRows={4}
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <Button 
            fullWidth 
            mt="xl" 
            style={styles.primaryButton}
            onClick={handleCreateGroup}
          >
            Create Group and GroupID
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}