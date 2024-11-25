import React, { useState } from 'react';
import { Container, Title, TextInput, Select, Radio, Textarea, Button, Paper, Group, Stack, Box } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';
import { Link } from 'react-router-dom';

export function CreateGroup() {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [notifications, setNotifications] = useState('on');
  const [description, setDescription] = useState('');

  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  var getUserName = "";

  const handleCreateGroup = async () => {
    console.log('Group data:', { name, users, privacy, notifications, description });
    // Handle group creation logic here
    const transformedPrivacy = privacy === 'public';
    const transformedNotifications = notifications === 'on';

    // Group data to be sent in the POST request
    const groupData = {
    name,
    privacy: transformedPrivacy,
    notifications: transformedNotifications,
    description
    };

    console.log('Group data:', groupData);

    try {
      const response = await fetch('http://localhost:5000/newgroup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupData)
      });

      if (response.ok) {
        const data = await response.json();
        // Access both the 'id' and 'uuid' fields from the response
        const groupId = data.id;
        const groupUuid = data.uuid;

        // Log or use the groupId and groupUuid
        console.log('Group created successfully');
        console.log('Group ID:', groupId);
        console.log('Group UUID:', groupUuid);
      } else {
        console.error('Failed to create group');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddUser = () => {
    if (newUser && !users.includes(newUser)) {
      setUsers([...users, newUser]);
      setNewUser('');
    }
  };

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>

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
            <TextInput
              label="Add Users"
              placeholder="Enter user email"
              value={newUser}
              onChange={(event) => setNewUser(event.currentTarget.value)}
              styles={{ input: styles.input }}
              rightSection={
                <Button onClick={handleAddUser} size="xs">Add</Button>
              }
            />
            {users.length > 0 && (
              <Box mt="xs">
                <Title order={6}>Added Users:</Title>
                {users.map((user, index) => (
                  <Box key={index}>{user}</Box>
                ))}
              </Box>
            )}
          </Box>

          <Group grow mt="md">
            <Stack>
              <Title order={6}>Privacy:</Title>
              <Radio.Group
                value={privacy}
                onChange={setPrivacy}
              >
                <Radio value="private" label="Private" />
                <Radio value="public" label="Public" />
              </Radio.Group>
            </Stack>

            <Stack>
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