import React, { useState, useRef } from 'react';
import { Container, Title, TextInput, Button, Group, Paper, Avatar, Box, Text, Overlay, Center, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUser, IconEdit } from '@tabler/icons-react';
import { Layout, useStyles } from '../components/layout';

interface UserProfile {
  name: string;
  institution: string;
  jobTitle: string;
  fieldOfStudy: string;
  links: string;
  profilePicture: string | null;
}

export function UserProfilePage() {
  const styles = useStyles();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Test Richardson',
    institution: 'University of Test',
    jobTitle: 'Professor of Testing',
    fieldOfStudy: 'Applied Test Sciences',
    links: 'www.testrichardson.com, @testrich',
    profilePicture: null,
  });

  const form = useForm({
    initialValues: profile,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    setIsEditing(true);
    form.setValues(profile);
  };

  const handleSaveChanges = () => {
    setProfile(form.values);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    form.reset();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        form.setFieldValue('profilePicture', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Layout>
      <Container size="sm">
        <Paper p="xl" radius="md" withBorder style={styles.formContainer}>
          <Group justify="space-between" align="flex-start" mb="xl">
            <Stack gap="xs">
              <Title order={2} style={styles.title}>
                {profile.name}
              </Title>
              <Text size="sm" color="dimmed">{profile.jobTitle}</Text>
              <Text size="sm" color="dimmed">{profile.institution}</Text>
            </Stack>
            <Box style={{ position: 'relative', cursor: isEditing ? 'pointer' : 'default' }} onClick={handleAvatarClick}>
              <Avatar 
                size={100} 
                radius={50} 
                src={form.values.profilePicture || undefined}
                color="blue"
              >
                <IconUser size={60} />
              </Avatar>
              {isEditing && (
                <Overlay opacity={0.6} color="#000" blur={2} radius={50} center>
                  <Center style={{ width: '100%', height: '100%' }}>
                    <IconEdit size={40} style={{ color: 'white' }} />
                  </Center>
                </Overlay>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </Box>
          </Group>

          <form onSubmit={form.onSubmit(handleSaveChanges)}>
            <TextInput
              label="Name"
              {...form.getInputProps('name')}
              disabled={!isEditing}
              styles={{ input: styles.input }}
            />
            <TextInput
              label="Institution/Organization"
              {...form.getInputProps('institution')}
              disabled={!isEditing}
              mt="md"
              styles={{ input: styles.input }}
            />
            <TextInput
              label="Job Title"
              {...form.getInputProps('jobTitle')}
              disabled={!isEditing}
              mt="md"
              styles={{ input: styles.input }}
            />
            <TextInput
              label="Field of Study"
              {...form.getInputProps('fieldOfStudy')}
              disabled={!isEditing}
              mt="md"
              styles={{ input: styles.input }}
            />
            <TextInput
              label="Links"
              {...form.getInputProps('links')}
              disabled={!isEditing}
              mt="md"
              styles={{ input: styles.input }}
            />

            <Group justify="flex-end" mt="xl">
              {!isEditing ? (
                <Button onClick={handleEditClick} style={styles.primaryButton}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleCancelEdit} variant="outline" color="gray">
                    Cancel
                  </Button>
                  <Button type="submit" style={styles.primaryButton}>
                    Save Changes
                  </Button>
                </>
              )}
            </Group>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
}