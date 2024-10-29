import React, { useState, useEffect, useRef } from 'react';
import { Container, Title as MantineTitle, Text, Paper, Button, Textarea, Group, Stack, Box } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';
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

interface Message {
  sender: string;
  content: string;
}

interface Thread {
  ID: number, 
  Firstname: string, 
  Lastname: string, 
  Title: string, 
  Content: string, 
  Category: string, 
  Upvotes: number, 
  Uuid: number
}

const currentUser: User = {
  id: '2',
  name: 'Jane Smith'
};

export function ThreadView() {
  const styles = useStyles();
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadData, setThreadData] = useState<Thread | null>(null);

  const email = localStorage.getItem('email');
  const ws = useRef<WebSocket | null>(null);
  const threadID = localStorage.getItem("threadID");

  useEffect(() => {
      console.log("threadID: ", threadID)

      const fetchThreadData = async () => {
          const response = await fetch(`http://localhost:5000/threads/${threadID}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
              }
          });
      
          // Check if the response is ok (status code 200-299)
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const data: Thread = await response.json();
          console.log("data: ", data)
          setThreadData(data);
          console.log("threadData: ", threadData)
      }

      fetchThreadData();

      // Websocket connection
      console.log("email: ", email)
      ws.current = new WebSocket(`ws://localhost:5000/ws/${email}`)

      ws.current.onopen = () => {
          console.log("Websocket connected");
      }

      ws.current.onmessage = (event) => {
          const message = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, message]);
      };

      ws.current.onerror = (event) => {
          console.error("WebSocket error observed:", event);
      };

      return () => {
          ws.current?.close();
      };
  }, [email, threadID])

  const sendMessage = async () => {
      console.log("sendMessage()")
      console.log("email: ", email)

      const response = await fetch('http://localhost:5000/getName', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const userData = await response.json();
      const name = "" + userData.Firstname + " " + userData.Lastname
      const message = { sender: name, content: newMessage };
      
      if (ws.current) {
          ws.current.send(JSON.stringify(message));
          setNewMessage('');
      } else {
          console.error("The WebSocket is uninitialized.");
      }
  };

  // Handle the loading state
  if (!threadData) {
    return <div>Loading...</div>;
  }

  // Access the title and content of the thread
  const { Title, Content } = threadData;

  console.log("Title: ", threadData.Title)
  console.log("Content: ", threadData.Content)

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

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setAudioFile(files[0]);
      // You can also handle the upload process here if needed
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImageFile(files[0]);
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
          <label htmlFor="video-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
              <i className="fas fa-upload"></i> Upload Video
            </Button>
          </label>

          <label htmlFor="video-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
              <i className="fas fa-upload"></i> Upload Audio
            </Button>
          </label>

          <label htmlFor="video-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
              <i className="fas fa-upload"></i> Upload Image
            </Button>
          </label>
        </Box>
      )}
      
      {'replies' in message && message.replies.map((reply) => renderMessage(reply, true))}
    </Paper>
  );

  return (
    <Layout>
      <Container size="lg" mt={30}>
        <MantineTitle order={2} style={styles.title}>{Title}</MantineTitle>
        <Text mb="xl">{Content}</Text>

        <Stack gap="md">
          {messages.map((msg, index) => (
            <div key={index}>
                <strong>{msg.sender}:</strong> {msg.content}
            </div>
          ))}
        </Stack>

        <Paper mt="xl" p="md" withBorder>
          <Textarea
            placeholder="Your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            minRows={3}
            mb="sm"
          />
          <Button onClick={sendMessage}>Post Message</Button>
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

          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioUpload}
            id="audio-upload"
            style={{ display: 'none' }}  // Hide the default file input
          />

          <label htmlFor="audio-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
              <i className="fas fa-upload"></i> Upload Audio
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
              <i className="fas fa-upload"></i> Upload Image
            </Button>
          </label>
        </Paper>
      </Container>
    </Layout>
  );
}