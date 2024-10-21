import React, { useState, useEffect } from 'react';
import { Container, Title, Paper, Switch, Select, Button, Group, Stack, Divider, Notification } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCheck } from '@tabler/icons-react';
import { Layout, useStyles } from '../components/layout';

interface SettingsFormValues {
  emailNotifications: boolean;
  pushNotifications: boolean;
  colorScheme: string;
  privacy: string;
  twoFactorAuth: boolean;
}

// Small bug in the code where if you change a setting and save it, then change that setting back, it will not let you save again.
export function SettingsPage() {
  const styles = useStyles();
  const [hasChanges, setHasChanges] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const initialValues: SettingsFormValues = {
    emailNotifications: true,
    pushNotifications: false,
    colorScheme: 'pallas',
    privacy: 'public',
    twoFactorAuth: false,
  };

  const form = useForm<SettingsFormValues>({
    initialValues: initialValues,
  });

  useEffect(() => {
    const currentValues = form.values;
    const hasChanged = Object.keys(initialValues).some(
      key => initialValues[key as keyof SettingsFormValues] !== currentValues[key as keyof SettingsFormValues]
    );
    setHasChanges(hasChanged);
  }, [form.values]);

  const handleSaveChanges = (values: SettingsFormValues) => {
    console.log('Saving settings:', values);
    setHasChanges(false);
    setShowNotification(true);
    // Here you would typically send these values to your backend
    setTimeout(() => setShowNotification(false), 3000); // Hide notification after 3 seconds
  };

  return (
    <Layout>
      <Container size="sm">
        <Paper p="xl" radius="md" withBorder style={styles.formContainer}>
          <Title order={2} style={styles.title} mb="xl">
            Settings
          </Title>

          <form onSubmit={form.onSubmit(handleSaveChanges)}>
            <Stack gap="xl">
              <div>
                <Title order={4} mb="md">Notifications</Title>
                <Stack gap="xs">
                  <Switch
                    label="Email Notifications"
                    {...form.getInputProps('emailNotifications', { type: 'checkbox' })}
                  />
                  <Switch
                    label="Push Notifications"
                    {...form.getInputProps('pushNotifications', { type: 'checkbox' })}
                  />
                </Stack>
              </div>

              <Divider />

              <div>
                <Title order={4} mb="md">Appearance</Title>
                <Select
                  label="Color Scheme"
                  data={[
                    { value: 'pallas', label: 'Pallas (Current)' },
                    { value: 'panther', label: 'Panther (Dark)' },
                  ]}
                  {...form.getInputProps('colorScheme')}
                />
              </div>

              <Divider />

              <div>
                <Title order={4} mb="md">Privacy & Security</Title>
                <Stack gap="md">
                  <Select
                    label="Profile Visibility"
                    data={[
                      { value: 'public', label: 'Public' },
                      { value: 'private', label: 'Private' },
                    ]}
                    {...form.getInputProps('privacy')}
                  />
                  <Switch
                    label="Two-Factor Authentication"
                    {...form.getInputProps('twoFactorAuth', { type: 'checkbox' })}
                  />
                </Stack>
              </div>

              <Group justify="flex-end" mt="xl">
                <Button 
                  type="submit" 
                  style={hasChanges ? styles.primaryButton : styles.outlinedButton}
                  disabled={!hasChanges}
                >
                  Save Changes
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>

        {showNotification && (
          <Notification
            icon={<IconCheck size="1.1rem" />}
            color="teal"
            title="Settings Updated"
            onClose={() => setShowNotification(false)}
            style={{
              position: 'fixed',
              bottom: '20px',
              right: '20px',
              zIndex: 1000,
            }}
          >
            Your settings have been successfully updated.
          </Notification>
        )}
      </Container>
    </Layout>
  );
}