import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Button, Container, Group, Paper, Radio, Select, Stack, Text, Textarea, TextInput, Title, useSafeMantineTheme } from '@mantine/core';
import { base } from '@/api/base';
import { addGroupMember, createGroup, createGroupWithGrant } from '@/api/group';
import { Layout, useStyles } from '@/components/layout';


interface Grants {
  ID: number,
	Title: string,
}

export function CreateGroup() {
  const styles = useStyles();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('private');
  const [users, setUsers] = useState<string[]>([]);
  const [newUser, setNewUser] = useState('');
  const [grant, setGrant] = useState<string | null>(null);
  const [grants, setGrants] = useState<Grants[]>([]);
  const [error, setError] = useState('');
  const [groupUuid, setGroupUuid] = useState('');

  const email = localStorage.getItem('email');
  const navigate = useNavigate();

  type GroupData = {
    name: string;
    privacy: boolean;
    description: string;
  };

  type GroupMembers = {
    GroupID: string;
    UserEmail: string | null;
    Role: string;
  };

  // Runs on initialization of the page
  useEffect(() => {
    const fetchGrants = async () => {
      try {
        // Get the threads upvoted by the user
        const getGrants = await fetch(`${base}/getGrants`, {
          method: 'GET',
        });

        // Check if the response is ok
        if (!getGrants.ok) {
          throw new Error('Error in the response');
        }

        const getGrantsData = await getGrants.json();
        console.log('getGrantsData: ', getGrantsData);
        setGrants(getGrantsData);
      } catch (error) {
        console.log('No grants found');
      }
    };

    fetchGrants();
  }, []);

  const handleCreateGroup = async () => {
    console.log('Group data:', { name, users, privacy, description });
    // Handle group creation logic here
    const transformedPrivacy = privacy === 'public';

    // Group data to be sent in the POST request
    const groupData: GroupData = {
      name,
      privacy: transformedPrivacy,
      description
    };

    console.log('Group data:', groupData);

    try {
      console.log("grant: ", grant)

      if (grant != null) {
        const response = await createGroupWithGrant(groupData, grant)

        if (response.ok) {
          // Access both the 'id' and 'uuid' fields from the response
          const groupId = response.id;
          const groupUuid = response.uuid;
          setGroupUuid(groupUuid);
  
          // Log or use the groupId and groupUuid
          console.log('Group created successfully');
          console.log('Group ID:', groupId);
  
          const groupMembersData: GroupMembers = {
            GroupID: groupId,
            UserEmail: email,
            Role: "Owner"
          }
  
          console.log('groupMembersData:', groupMembersData);
          localStorage.setItem("groupID", groupId);
  
          try {
            const response = await addGroupMember(groupMembersData)
  
            if (response.ok) {
              console.log("data: ", response)
              console.log('Group UUID:', groupUuid);
            } else {
              console.error('Failed to add members to group');
              setError(response.message);
            }
          } catch (error) {
            console.error('Error:', error);
          }
          
          // If no users were added to the group, navigate to the group's page
          if (users.length == 0) {
            console.log("groupUuid: ", groupUuid)
  
            navigate(`/group/${groupUuid}`);
          }
  
          // Add group members
          for (let i = 0; i < users.length; i++) {
            const groupMembersData: GroupMembers = {
              GroupID: groupId,
              UserEmail: users[i],
              Role: "Member"
            }
  
            console.log('groupMembersData', i,  ':, ', groupMembersData);
  
            try {
              const response = await addGroupMember(groupMembersData)
    
              if (response.ok) {
                console.log("data (loop): ", response)
                console.log("groupUuid: ", groupUuid)
  
                // Navigate to the group's page
                localStorage.setItem("groupID", groupId);
                navigate(`/group/${groupUuid}`);
              } else {
                console.error('Failed to add members to group');
                setError(response.message);
              }
            } catch (error) {
              console.error('Error:', error);
            } 
          }
        } else {
          console.error('Failed to add members to group');
          const getError = await response.json();
          setError(getError.message);
        }
      } else {
        const response = await createGroup(groupData)

        if (response.ok) {
          // Access both the 'id' and 'uuid' fields from the response
          const groupId = response.id;
          const groupUuid = response.uuid;
          setGroupUuid(groupUuid);
  
          // Log or use the groupId and groupUuid
          console.log('Group created successfully');
          console.log('Group ID:', groupId);
  
          const groupMembersData: GroupMembers = {
            GroupID: groupId,
            UserEmail: email,
            Role: "Owner"
          }
  
          console.log('groupMembersData:', groupMembersData);
          localStorage.setItem("groupID", groupId);
  
          try {
            const response = await addGroupMember(groupMembersData)
  
            if (response.ok) {
              console.log("data: ", response)
              console.log('Group UUID:', groupUuid);
            } else {
              console.error('Failed to add members to group');
              setError(response.message);
            }
          } catch (error) {
            console.error('Error:', error);
          }
          
          // If no users were added to the group, navigate to the group's page
          if (users.length == 0) {
            console.log("groupUuid: ", groupUuid)
  
            navigate(`/group/${groupUuid}`);
          }
  
          // Add group members
          for (let i = 0; i < users.length; i++) {
            const groupMembersData: GroupMembers = {
              GroupID: groupId,
              UserEmail: users[i],
              Role: "Member"
            }
  
            console.log('groupMembersData', i,  ':, ', groupMembersData);
  
            try {
              const response = await addGroupMember(groupMembersData)
    
              if (response.ok) {
                console.log("data (loop): ", response)
                console.log("groupUuid: ", groupUuid)
  
                // Navigate to the group's page
                localStorage.setItem("groupID", groupId);
                navigate(`/group/${groupUuid}`);
              } else {
                console.error('Failed to add members to group');
                setError(response.message);
              }
            } catch (error) {
              console.error('Error:', error);
            } 
          }
        } else {
          console.error('Failed to add members to group');
          const getError = await response.json();
          setError(getError.message);
        }
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
        
        {error && (
          <Group>
            <p style={{ color: 'red' }}>{error}</p>
            <Link to={`/group/${groupUuid}`}>Go to Your Group Page</Link>
          </Group>
        )}

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
          </Group>

          <Box mt="md">
            <Text size="sm" style={{ fontWeight: 600, marginBottom: 2 }}>Add Users</Text>

            <Group>
              <TextInput
                placeholder="Enter user email"
                value={newUser}
                onChange={(event) => setNewUser(event.currentTarget.value)}
                styles={{ input: styles.input }}
                style={{ width: 550 }}
              />
              
              <Button onClick={handleAddUser} size="xs">Add</Button>
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

          <Select
            label="Select a research grant opportunity (optional)"
            placeholder="Enter grant"
            data={grants.map(grant => ({
              value: grant.ID.toString(),
              label: grant.Title
            }))}
            searchable
            value={grant}
            onChange={(value: string | null) => setGrant(value)}
            mt="md"
            styles={{ input: styles.input }}
          />

          <Button 
            fullWidth 
            mt="xl" 
            style={styles.primaryButton}
            onClick={handleCreateGroup}
          >
            Create Group
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}
