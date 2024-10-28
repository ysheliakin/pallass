import React, { useState, useEffect } from 'react';
import { Container, Title, Text, Paper, Button, Textarea, Group, Stack } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';
import { useParams } from 'react-router-dom';
import { IconVideo, IconMusic, IconPhoto } from '@tabler/icons-react'; // Import relevant icons

interface User {
  id: string;
  name: string;
}

interface Comment {
  ID: number;
  Firstname: string;
  Lastname: string;
  Content: string;
  CreatedAt: string;
}

interface Thread {
  ID: number;
  Firstname: string;
  Lastname: string;
  Title: string;
  Content: string;
  Category: string;
  Upvotes: number;
  CreatedAt: string;
}

const currentUser: User = {
  id: '2',
  name: 'Jane Smith'
};

export function ThreadView() {
  const { threadId } = useParams<{ threadId: string }>();
  const styles = useStyles();
  const [thread, setThread] = useState<Thread | null>(null);
  const [comments, setComments] = useState<Comment[]>([]); // Ensure this is initialized as an array
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch thread data
    const fetchThread = async () => {
        try {
            const response = await fetch(`http://localhost:5000/threads/${threadId}`);
            const data = await response.json();
            setThread(data);
        } catch (error) {
            console.error("Error fetching thread:", error);
        }
    };

    // Fetch comments data
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/threads/${threadId}/comments`);
            const data = await response.json();
            console.log("Comments response:", data); // Log the response
            // Check if the data is an array
            if (Array.isArray(data)) {
                setComments(data);
            } else {
                console.error("Comments data is not an array:", data);
                setComments([]); // Reset to an empty array if the data is not an array
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
            setComments([]); // Reset to an empty array on error
        }
    };

    fetchThread();
    fetchComments();
}, [threadId]);


  const handlePostMessage = () => {
    if (newMessage.trim()) {
      // Logic to handle posting a new message, if required.
      setNewMessage('');
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedContent(content);
  };

  const handleSaveEdit = (messageId: string) => {
    // Logic to save the edited message, if required.
    setEditingMessageId(null);
    setEditedContent('');
  };

  const handleReply = (messageId: string) => {
    setReplyingToId(messageId);
  };

  const handlePostReply = (messageId: string) => {
    if (replyContent.trim()) {
      // Logic to handle posting a reply, if required.
      setReplyingToId(null);
      setReplyContent('');
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setVideoFile(files[0]);
    }
  };

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setAudioFile(files[0]);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
    }
  };

  const renderComment = (comment: Comment) => (
    <Paper key={comment.ID} p="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{comment.Firstname} {comment.Lastname}</Text>
        <Text size="sm" color="dimmed">{new Date(comment.CreatedAt).toLocaleString()}</Text>
      </Group>
      <Text mb="sm">{comment.Content}</Text>
    </Paper>
  );

  return (
    <Layout>
      <Container size="lg" mt={30}>
        {thread ? (
          <>
            <Title order={2} style={styles.title}>{thread.Title}</Title>
            <Text mb="xl">{thread.Content}</Text>
            <Text mb="xl">Category: {thread.Category}</Text>
            <Text mb="xl">Created At: {new Date(thread.CreatedAt).toLocaleString()}</Text>
            <Text mb="xl">Upvotes: {thread.Upvotes}</Text>
          </>
        ) : (
          <Text>Loading thread...</Text>
        )}

        <Stack gap="md">
          {comments.map(comment => renderComment(comment))}
        </Stack>

        <Paper mt="xl" p="md" withBorder>
          <Textarea
            placeholder="Your comment"
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            minRows={3}
            mb="sm"
          />
          <Button onClick={handlePostMessage}>Post Comment</Button>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            id="video-upload"
            style={{ display: 'none' }}  // Hide the default file input
          />
          
          <label htmlFor="video-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
              <IconVideo size={20} /> Upload Video
            </Button>
          </label>

          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            id="audio-upload"
            style={{ display: 'none' }}  // Hide the default file input
          />

          <label htmlFor="audio-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
            <IconMusic size={20} /> Upload Audio
            </Button>
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            id="image-upload"
            style={{ display: 'none' }}  // Hide the default file input
          />

          <label htmlFor="image-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
            <IconPhoto size={20} /> Upload Image
            </Button>
          </label>
        </Paper>
      </Container>
    </Layout>
  );
}

