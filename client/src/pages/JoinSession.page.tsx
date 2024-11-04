import React, { useState } from 'react';
import { Container, Title, Box, TextInput, Button, Alert } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';
import { Link } from 'lucide-react';

export function JoinSession() {
  const styles = useStyles();
  const [groupId, setGroupId] = useState('');
  const [sessionName, setSessionName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle join session logic here
    console.log('Joining session:', { groupId, sessionName });
  };

  return (
    <Layout>
      <Container size="sm">
        <Box 
          style={{ 
            backgroundColor: 'white', 
            padding: '2rem', 
            borderRadius: '8px', 
            marginTop: '2rem',
          }}
        >
          <Title 
            order={2} 
            mb="md" 
            ta="center"
            style={{ color: '#AB4D7C' }}
          >
            Join Online Session
          </Title>

          <form onSubmit={handleSubmit}>
            <TextInput
              required
              label="Group ID"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              placeholder="Enter group ID"
              mb="md"
              styles={{
                input: {
                  backgroundColor: '#fdf9f1'
                }
              }}
            />

            <TextInput
              label="Session Name"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              placeholder="Or enter session name"
              mb="xl"
              styles={{
                input: {
                  backgroundColor: '#fdf9f1'
                }
              }}
            />

            <Alert
              icon={<Link size={16} />}
              color="pink"
              variant="light"
              mb="xl"
            >
             NOTE: A session link will be provided by the session creator to join the online session
            </Alert>

            <Button
              type="submit"
              fullWidth
              styles={(theme) => ({
                root: {
                  backgroundColor: '#d05572',
                  '&:hover': {
                    backgroundColor: '#c04562'
                  }
                }
              })}
            >
              Join Session
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  );
}

export default JoinSession;