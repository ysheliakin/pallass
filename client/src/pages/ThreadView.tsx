import React, { useState } from 'react';
import { Container, Title, Text, Paper, Button, Textarea, Group, Stack, Box } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';
import { useParams } from 'react-router-dom';

interface User {
  id: string;
  name: string;
}

interface Reply {
  id: string;
  author: User;
  date: string;
  content: string;
}

interface Message extends Reply {
  replies: Reply[];
}

const currentUser: User = {
  id: '2',
  name: 'Jane Smith'
};

const mockThread = {
  id: '1',
  title: 'Example Thread Title',
  description: 'This is an example thread description.',
  messages: [
    { 
      id: '1', 
      author: { id: '1', name: 'John Doe' }, 
      date: '2023-05-01', 
      content: 'This is the first message in the thread.',
      replies: []
    },
    { 
      id: '2', 
      author: { id: '2', name: 'Jane Smith' }, 
      date: '2023-05-02', 
      content: 'This is a message in the thread that YOU posted.',
      replies: []
    },
    { 
      id: '3', 
      author: { id: '3', name: 'Alice Johnson' }, 
      date: '2023-05-03', 
      content: 'Another message in the thread.',
      replies: []
    },
  ] as Message[]
};

export function ThreadView() {
  const { threadId } = useParams<{ threadId: string }>();
  const styles = useStyles();
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockThread.messages);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handlePostMessage = () => {
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: String(messages.length + 1),
        author: currentUser,
        date: new Date().toISOString().split('T')[0],
        content: newMessage,
        replies: []
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedContent(content);
  };

  const handleSaveEdit = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId ? { ...msg, content: editedContent } : msg
    ));
    setEditingMessageId(null);
    setEditedContent('');
  };

  const handleReply = (messageId: string) => {
    setReplyingToId(messageId);
  };

  const handlePostReply = (messageId: string) => {
    if (replyContent.trim()) {
      const newReply: Reply = {
        id: `${messageId}-reply-${Date.now()}`,
        author: currentUser,
        date: new Date().toISOString().split('T')[0],
        content: replyContent
      };
      setMessages(messages.map(msg => 
        msg.id === messageId 
          ? { ...msg, replies: [...msg.replies, newReply] } 
          : msg
      ));
      setReplyingToId(null);
      setReplyContent('');
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setVideoFile(files[0]);
      // You can also handle the upload process here if needed
    }
  };

  const renderMessage = (message: Message | Reply, isReply = false) => (
    <Paper key={message.id} p="md" withBorder style={isReply ? { marginLeft: 20 } : {}}>
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{message.author.name}</Text>
        <Text size="sm" color="dimmed">{message.date}</Text>
      </Group>
      {editingMessageId === message.id ? (
        <>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.currentTarget.value)}
            minRows={3}
            mb="sm"
          />
          <Button onClick={() => handleSaveEdit(message.id)} size="sm">Save</Button>
        </>
      ) : (
        <>
          <Text mb="sm">{message.content}</Text>
          <Group>
            {message.author.id === currentUser.id && (
              <Button 
                onClick={() => handleEditMessage(message.id, message.content)}
                variant="subtle" 
                color="blue" 
                size="sm"
              >
                Edit
              </Button>
            )}
            {!isReply && (
              <Button 
                onClick={() => handleReply(message.id)}
                variant="subtle" 
                color="grape" 
                size="sm"
              >
                Reply
              </Button>
            )}
          </Group>
        </>
      )}
      {replyingToId === message.id && (
        <Box mt="md">
          <Textarea
            placeholder="Your reply"
            value={replyContent}
            onChange={(e) => setReplyContent(e.currentTarget.value)}
            minRows={2}
            mb="sm"
          />
          <Button onClick={() => handlePostReply(message.id)} size="sm">Post Reply</Button>
        </Box>
      )}
      {'replies' in message && message.replies.map((reply) => renderMessage(reply, true))}
    </Paper>
  );

  return (
    <Layout>
      <Container size="lg" mt={30}>
        <Title order={2} style={styles.title}>{mockThread.title}</Title>
        <Text mb="xl">{mockThread.description}</Text>

        <Stack gap="md">
          {messages.map(message => renderMessage(message))}
        </Stack>

        <Paper mt="xl" p="md" withBorder>
          <Textarea
            placeholder="Your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            minRows={3}
            mb="sm"
          />
          <Button onClick={handlePostMessage}>Post Message</Button>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            id="video-upload"
            style={{ display: 'none' }}  // Hide the default file input
          />
          
          <label htmlFor="video-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
              <i className="fas fa-upload"></i> Upload Video
            </Button>
          </label>

        </Paper>
      </Container>
    </Layout>
  );
}