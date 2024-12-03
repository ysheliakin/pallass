import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Grid, Paper, Radio, Stack, Text, TextInput, Title } from '@mantine/core';
import { base } from '@/api/base';
import { Layout, useStyles } from '@/components/layout';


interface Group {
  ID: number,
  Name: string,
  Description: string,
  Uuid: string,
  CreatedAt: string,
  Public: boolean,
  MemberEmails: Array<String>,
  JoinRequestEmails: Array<String>,
}

export function JoinGroup() {
  const styles = useStyles();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState('');
  const [groups, setGroups] = useState<Group[] | null>(null);
  const [nullResponse, setNullResponse] = useState(false);
  //const [successMessage, setSuccessMessage] = useState("")

  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')

  const handleSearchGroup = async (name: string) => {
    const response = await fetch(`${base}/getGroupsByInput`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Error in the response');
    }

    const responseData = await response.json();
    console.log('responseData: ', responseData);
    setGroups(responseData);

    if (responseData != null) {
      setNullResponse(false);
    } else {
      setNullResponse(true);
    }
  };

  const joiningGroup = async (groupID: number, groupUuid: string, useremail: string) => {
    const groupid = groupID.toString();
    const role = 'Member';

    const response = await fetch(`${base}/addgroupmember`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupid, useremail, role }),
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Error in the response');
    }

    localStorage.setItem('groupID', groupid);
    navigate(`/group/${groupUuid}`);
  };

  const requestJoinGroup = async (groupID: number, useremail: string) => {
    const groupid = groupID.toString();

    const response = await fetch(`${base}/requestJoinGroup`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupid, useremail }),
    });

    // Check if the response is ok
    if (!response.ok) {
      //setSuccessMessage("")
      throw new Error('Error in the response');
    }

    //setSuccessMessage(responseMessage)
    handleSearchGroup(userInput);
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
          style={{...styles.formContainer, backgroundColor: 'white', marginBottom: 40}}
        >
          <TextInput
            label="Search for a Group"
            placeholder="Enter keywords or a group's name"
            value={userInput}
            onChange={(event) => setUserInput(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <Button 
            fullWidth 
            mt="xl" 
            style={styles.primaryButton}
            onClick={() => handleSearchGroup(userInput)}
          >
            Search Group
          </Button>
        </Paper>

        <Grid>
          <Grid.Col span={12}>
            {groups && (
              <Grid>
                {groups.map(group => (
                  <Grid.Col key={group.ID} span={4}>
                    <Card 
                      shadow="sm" 
                      p="lg" 
                      radius="md" 
                      withBorder 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Text fw={500} style={{ marginBottom: 10 }}>{group.Name}</Text>
                      
                      {group.Public == true ? (
                        <Text>Public</Text>
                      ) : (
                        <Text>Private</Text>
                      )}

                      <Text size="sm" color="dimmed" mt="xs" style={{ marginBottom: 20}}>
                        Created on: {new Date(group.CreatedAt).toLocaleDateString()}
                      </Text>

                      {group.Public == true ? (
                        <Button 
                          onClick={() => {
                            if (email) {
                              joiningGroup(group.ID, group.Uuid, email);
                            }
                          }}

                          disabled={!email || group.MemberEmails.includes(email)}
                        >
                          Join
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => {
                            if (email) {
                              requestJoinGroup(group.ID, email);
                            }
                          }}

                          disabled={!email || group.JoinRequestEmails.includes(email) || group.MemberEmails.includes(email)}
                        >
                          Request to Join
                        </Button>
                      )}
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}

            {nullResponse && (
              <Text
                style={{
                  fontWeight: 500,
                  letterSpacing: '1px',
                }}
              >
                No groups were found.
              </Text>
            )}
          </Grid.Col>
          </Grid>
      </Container>
    </Layout>
  );
}
