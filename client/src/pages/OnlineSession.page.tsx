import React, { useState } from 'react';
import { Container, Title, Box, Group, TextInput, Textarea, Radio, Select, Alert, Text } from '@mantine/core';
import { Video } from 'lucide-react';
import { Layout } from '../components/layout';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

const SessionScheduler = () => {
  const navigate = useNavigate();
  const [sessionType, setSessionType] = useState('meeting');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [groupId, setGroupId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // TODO: Add your API call here to save the session
      
      notifications.show({
        title: 'Success!',
        message: 'Your session has been scheduled successfully',
        color: 'green',
      });

      // Navigate back to home page after short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to schedule session. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <Layout>
      <Container size="md">
        <Box style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>
          <Title order={2} mb="sm" style={{ color: '#AB4D7C' }}>
            Schedule Online Session
          </Title>
          <Text size="sm" color="dimmed" mb="lg">
            Create a new online session for your research community
          </Text>

          <form onSubmit={handleSubmit}>
            <Select
              required
              label="Session Type"
              value={sessionType}
              onChange={(value) => setSessionType(value || 'meeting')}
              data={[
                { value: 'meeting', label: 'Meeting' },
                { value: 'workshop', label: 'Workshop' },
                { value: 'presentation', label: 'Presentation' }
              ]}
              mb="md"
              styles={{
                input: {
                  backgroundColor: '#fdf9f1'
                }
              }}
            />

            <TextInput
              required
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter session title"
              mb="md"
              styles={{
                input: {
                  backgroundColor: '#fdf9f1'
                }
              }}
            />

            <Textarea
              required
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the session"
              minRows={3}
              mb="md"
              styles={{
                input: {
                  backgroundColor: '#fdf9f1'
                }
              }}
            />

            <Group grow mb="md">
              <TextInput
                required
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: '#fdf9f1'
                  }
                }}
              />
              <TextInput
                required
                type="time"
                label="Time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                styles={{
                  input: {
                    backgroundColor: '#fdf9f1'
                  }
                }}
              />
            </Group>

            <Group grow mb="md">
              <Select
                label="Duration"
                value={duration}
                onChange={(value) => setDuration(value || '60')}
                data={[
                  { value: '30', label: '30 minutes' },
                  { value: '60', label: '1 hour' },
                  { value: '90', label: '1.5 hours' },
                  { value: '120', label: '2 hours' }
                ]}
                styles={{
                  input: {
                    backgroundColor: '#fdf9f1'
                  }
                }}
              />
              <TextInput
                label="Max Attendees"
                type="number"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                placeholder="Optional"
                styles={{
                  input: {
                    backgroundColor: '#fdf9f1'
                  }
                }}
              />
            </Group>

            <Box mb="md">
              <Text size="sm" fw={500} mb="xs">
                Visibility
              </Text>
              <Radio.Group
                value={isPublic ? 'public' : 'private'}
                onChange={(value) => setIsPublic(value === 'public')}
              >
                <Group mt="xs">
                  <Radio value="public" label="Public" />
                  <Radio value="private" label="Group Only" />
                </Group>
              </Radio.Group>
            </Box>

            {!isPublic && (
              <Box mb="md">
                <Group grow>
                  <Select
                    required
                    label="Select Group"
                    value={selectedGroup}
                    onChange={(value) => setSelectedGroup(value || '')}
                    data={[
                      { value: '1', label: 'Research Group A' },
                      { value: '2', label: 'Workshop B' },
                      { value: '3', label: 'Q&A Session C' }
                    ]}
                    placeholder="Select a group"
                    styles={{
                      input: {
                        backgroundColor: '#fdf9f1'
                      }
                    }}
                  />
                  <TextInput
                    label="Or Enter Group ID"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    placeholder="Enter group ID to join"
                    styles={{
                      input: {
                        backgroundColor: '#fdf9f1'
                      }
                    }}
                  />
                </Group>
              </Box>
            )}

            <Alert
              icon={<Video size={16} />}
              color="pink"
              variant="light"
              mb="lg"
            >
              A video conference link will be automatically generated and shared with attendees
            </Alert>

            <Group justify="flex-end">
              <button
                type="submit"
                style={{
                  backgroundColor: '#d05572',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Schedule Session
              </button>
            </Group>
          </form>
        </Box>
      </Container>
    </Layout>
  );
};

export default SessionScheduler;