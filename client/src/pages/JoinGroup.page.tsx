import React, { useState } from 'react';
import { Container, Title, TextInput, Radio, Button, Paper, Stack } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';
import { Link } from 'react-router-dom';

export function JoinGroup() {
  const styles = useStyles();

  const [groupId, setGroupId] = useState('');
  const [notifications, setNotifications] = useState('on');

  const handleJoinGroup = () => {
    console.log('Join group data:', { groupId, notifications });
    // Handle group joining logic here
  };

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>

      <Container size="sm" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Join Group</Title>
        
        <Paper 
          withBorder 
          shadow="md" 
          p={30} 
          mt={30} 
          radius="md" 
          style={{...styles.formContainer, backgroundColor: 'white'}}
        >
          <TextInput
            label="GroupID"
            placeholder="Enter group ID"
            required
            value={groupId}
            onChange={(event) => setGroupId(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <Stack mt="md">
            <Title order={6}>Notifications:</Title>
            <Radio.Group
              value={notifications}
              onChange={setNotifications}
            >
              <Radio value="on" label="On" />
              <Radio value="off" label="Off" />
            </Radio.Group>
          </Stack>

          <Button 
            fullWidth 
            mt="xl" 
            style={styles.primaryButton}
            onClick={handleJoinGroup}
          >
            Join Group/Request to Join Group
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}