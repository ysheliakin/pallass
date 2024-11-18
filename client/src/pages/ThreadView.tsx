<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { IconMusic, IconPhoto, IconVideo } from '@tabler/icons-react';
=======
import React, { useState, useEffect, useRef } from 'react';
import { Container, Title as MantineTitle, Text, Image, Title, Paper, Button, Textarea, Group, Box, Card, Modal } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';
>>>>>>> 71e8c27a0a83c0f557ff824db80d91d019008166
import { useParams } from 'react-router-dom';
import { EditorConsumer } from '@tiptap/react';
import { IconVideo } from '@tabler/icons-react';

interface User {
  id: string;
  name: string;
}

interface Article {
  id: string;
  title: string;
  url: string;
  urlToImage: string;
}

interface Paper {

  title: string;
  Author: string;
  organization: string;
  paperLink: string; 
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
  id: string;
  sender: string;
  content: string;
  date: string;
  type: string;
}

interface Thread {
  ThreadID: string,
  ThreadFirstname: string,
  ThreadLastname: string,
  ThreadTitle: string,
  ThreadContent: string,
  ThreadCategory: string,
  ThreadUpvotes: string,
  ThreadUuid: string,
  ThreadCreatedAt: string,
  MessageID: string,
  MessageFirstname: string,
  MessageLastname: string,
  MessageContent: string,
  MessageCreatedAt: string,
  UserFullname: string
}

const currentUser: User = {
  id: '2',
  name: 'Jane Smith',
};

export function ThreadView() {
  const styles = useStyles();
  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [threadData, setThreadData] = useState<Thread[] | null>(null);
  const [upvoteState, setUpvoteState] = useState(false);
  const [userName, setUserName] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);

  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const ws = useRef<WebSocket | null>(null);
  const threadID = localStorage.getItem("threadID");
  var getUserName = "";

  const fetchArticles = async () => {
    const today = new Date();

    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    // Formatting
    const formattedDate = yesterday.toISOString().split('T')[0];
    // console.log(formattedDate);
    // console.log("testing");
    var filteredQuery;

    const fillerWords = ['a', 'about', 'the', 'in', 'of', 'thread', 'benefits', 'like', 'so', 'or',
      'as', 'yet', 'just', 'very', 'right', 'just', 'by', 'be', 'you', 'as', 'this', 'that', 'we', 'all',
      'us', 'me', 'them', 'there', 'their', 'on', 'to', 'think', 'most', 'not', 'few', 'is', 'it'
    ];
    // filter out filler words
    if (threadData && threadData.length > 0 && threadData[0].ThreadTitle) {
      const query = threadData[0].ThreadTitle;
      filteredQuery = query
        .split(' ')
        .filter(word => !fillerWords.includes(word.toLowerCase()))
        .join(' ');
      
      console.log('Filtered Query:', filteredQuery);
    } else {
      console.error('ThreadTitle is null or undefined');
    }
    try {
      if (threadData && threadData.length > 0) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${filteredQuery}&from=${formattedDate}&to=${formattedDate}&sortBy=popularity&language=en&apiKey=3457f090118c4f92a4eab998982c7457`
        );
        const data = await response.json();
        if (data.articles && Array.isArray(data.articles)) {
          // Show the first 3 articles
          setArticles(data.articles.slice(0, 3));
        } else {
          console.error('Articles not found in response', data);
        }
      } 
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
  


  };

  const fetchPapers = async () => {
    const today = new Date();

    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    // Formatting
    const formattedDate = yesterday.toISOString().split('T')[0];
    // console.log(formattedDate);
    // console.log("testing");
    var filteredQuery;

    const fillerWords = ['a', 'about', 'the', 'in', 'of', 'thread', 'benefits', 'like', 'so', 'or',
      'as', 'yet', 'just', 'very', 'right', 'just', 'by', 'be', 'you', 'as', 'this', 'that', 'we', 'all',
      'us', 'me', 'them', 'there', 'their', 'on', 'to', 'think', 'most', 'not', 'few', 'is', 'it'
    ];
    // filter out filler words
    if (threadData && threadData.length > 0 && threadData[0].ThreadTitle) {
      const query = threadData[0].ThreadCategory;
      filteredQuery = query
        .split(' ')
        .filter(word => !fillerWords.includes(word.toLowerCase()))
        .join(' ');
      
      console.log('Filtered Query:', filteredQuery);
    } else {
      console.error('ThreadTitle is null or undefined');
    }
    const safeQuery = filteredQuery || '';
    try {
      if (threadData && threadData.length > 0) {
        const response = await fetch(
          `https://doaj.org/api/search/journals/${filteredQuery}?page=1&pageSize=3`
          // q=${encodeURIComponent(safeQuery)}&fromDate=${formattedDate}&toDate=${formattedDate}&size=3&lang=en`
        );
        // const textResponse = await response.text();
        // console.log(textResponse);
        const data = await response.json();
        // console.log('API Response:', JSON.stringify(data, null, 2));

        if (data && data.results && data.results.length > 0) {
          const papers: Paper[] = data.results.map((paper: any) => ({
            title: paper.bibjson.title.exact,
            Author: paper.bibjson.author,  
            organization: paper.bibjson.publisher.name || ' ', // Publisher name as organization
            paperLink: paper.bibjson.article.license_display_example_url || 'N/A', // Link to article
          }));
    
  
          setPapers(papers.slice(0, 3));
        } else {
          console.error('Papers not found in response', data);
        }
      } 
      } catch (error) {
        console.error("Error fetching Papers:", error);
      }
  


  };


  const fetchThread = async() => {
    const fetchThreadData = async () => {
      const response = await fetch(`http://localhost:5000/threads/${threadID}`, {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setThreadData(data);
    }
    
    fetchThreadData();
    // fetchArticles();

    // Websocket connection
    ws.current = new WebSocket(`ws://localhost:5000/ws/${email}`)

    ws.current.onopen = () => {
        console.log("Websocket connected");
    }

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Edit the message's content if the type is 'EDIT_MESSAGE'
      if (message.type === 'EDIT_MESSAGE') {
        console.log("message.id: ", message.id)
        console.log("message.content: ", message.content)

        // Edit the message (if it was a newly sent message)
        setMessages((prevMessages) => prevMessages.map((msg) => msg.id == message.id ? { ...msg, content : message.content } : msg));

        // Edit the message (if it was an older message displayed during the page initialization)
        setThreadData((prevMessages) => {
          if (prevMessages == null ) {
            return [];
          }

          const updatedThreadMessages = prevMessages.map((msg) => msg.MessageID == message.id ? { ...msg, MessageContent : message.content } : msg);
          console.log("updatedThreadMessages: ", updatedThreadMessages)
          return updatedThreadMessages;
        })
      }
      // Remove the message if the type is 'DELETE_MESSAGE'
      else if (message.type === 'DELETE_MESSAGE') {
        // Remove the deleted message (if it was a newly sent message)
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== message.id));

        // Remove the deleted message (if it was an older message displayed during the page initialization)
        setThreadData((prevMessages) => {
          if (prevMessages == null ) {
            return [];
          }

          const updatedThreadMessages = prevMessages.filter((msg) => msg.MessageID != message.id);
          return updatedThreadMessages;
        })
      }
      // Render the list of messages with the new message included 
      else {
        setMessages((prevMessages) => [...prevMessages, message]);
      } 
    };

    ws.current.onerror = (event) => {
        console.error("WebSocket error observed:", event);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
        ws.current?.close();
    };
  }

  useEffect(() => {
    fetchThread();
    fetchArticles();
  }, [email, threadID]);

  useEffect(() => {
    if (threadData && threadData.length > 0) {
      fetchArticles();
      fetchPapers();
    }
  }, [email, threadID, threadData]);


  const sendMessage = async () => {
    const fullname = await fetch('http://localhost:5000/getUserName', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    // Check if the response is ok
    if (!fullname.ok) {
      throw new Error('Network response was not ok');
    }

    const userData = await fullname.json();
    const firstname = userData.Firstname
    const lastname = userData.Lastname
    getUserName = "" + firstname + " " + lastname

    const threadid = threadID
    const content = newMessage

    const storeThreadMessage = await fetch('http://localhost:5000/storeThreadMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstname, lastname, threadid, content }),
    });

    if (!storeThreadMessage.ok) {
      throw new Error('Network response was not ok');
    }

    const threadMessageData = await storeThreadMessage.json()
    const messageID = "" + threadMessageData.ID + ""

    const message = { id: messageID, sender: getUserName, content: newMessage, date: threadMessageData.CreatedAt } as Message;

    localStorage.setItem("localName", getUserName)

    const name = localStorage.getItem("localName")
    if (name != null) {
      setUserName(name)
    }

    if (ws.current) {
      ws.current.send(JSON.stringify(message));
      setNewMessage('');
    } else {
        console.error("The WebSocket is uninitialized.");
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedContent(content);    
  };

  const handleUpvote = async () => { 
    try {
      const response = await fetch(`http://localhost:5000/threads/upvote/${threadID}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to upvote');
      }

      const data = await response.json(); 
  

      setThreadData((prevData) => {
        if (!prevData) {
          return prevData;
        }
        
        const updatedThread = prevData.map((getData, index) => {
          if (index === 0) {
            return { ...getData, ThreadUpvotes: data.upvotes.toString() };
          }
          return getData;
        });

        return updatedThread;
      });
    } catch (error) {
      console.error('Error upvoting the thread:', error);
    }
    setUpvoteState(true);
  };

  const handleDeleteThreadMessage = async (messageId: string) => {    
    const response = await fetch(`http://localhost:5000/deleteThreadMessage/${messageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const getMessageID = "" + messageId + ""

    // Delete the message with the corresponding message ID: "getMessageID"
    if (ws.current) {
      ws.current.send(JSON.stringify({ id: getMessageID, type: 'DELETE_MESSAGE' }));
    }
  }

  const handleSaveEdit = async (messageId: string, content: string) => {
    const id = "" + messageId + ""

    console.log("getMessageID: ", id)

    const response = await fetch(`http://localhost:5000/editThreadMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, content }),
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Edit the message with the corresponding message ID
    if (ws.current) {
      ws.current.send(JSON.stringify({id: id, content: content, type: 'EDIT_MESSAGE'}));
    }

    console.log("Successful edit (I think)")

    setEditingMessageId(null);
    setEditedContent('');
  };

  const handleReply = (messageId: string) => {
    setReplyingToId(messageId);
  };

  const handleCancelEdit = (messageId: string) => {
    setEditingMessageId(null);
  }

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

  // Handle the loading state
  if (!threadData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Container size="lg" mt={30}>
        <Paper p="md" shadow="sm" radius="md" withBorder>
          <MantineTitle order={2} style={styles.title} mb="xs">
            {threadData[0].ThreadTitle}
          </MantineTitle>
          
          <Group justify="space-between" align="center">
            <Text size="sm" color="dimmed">
              Created on: <strong>{new Date(threadData[0].ThreadCreatedAt).toLocaleDateString()}</strong>
            </Text>
            <Text size="sm" color="dimmed">
              Upvotes: <strong>{threadData[0].ThreadUpvotes}</strong>
            </Text>
          </Group>

          <Text mb="lg" size="md" style={{ lineHeight: 1.6 }}>
            {threadData[0].ThreadContent}
          </Text>

          {/* Call to Action or Stats */}
          <Group align="right">
            <Button variant="outline" color="blue" onClick={handleUpvote} disabled={upvoteState}>
              👍 Upvote
            </Button>
          </Group>
        </Paper>

        <Box mt="xl">
  <Title order={3}>Latest News On The Subject</Title>
  {articles.length > 0 ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
      {articles.map((article, index) => (
        <Card key={index} shadow="sm" padding="lg" style={{ width: '350px' }}>
          {article.urlToImage && (
            <Image src={article.urlToImage} alt={article.title} height={200} fit="cover" />
          )}
          <Text size="lg" mt="md">{article.title}</Text>
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            component="a"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read more
          </Button>
        </Card>
      ))}
    </div>
  ) : (
    <Text>No articles available.</Text>
  )}
</Box>

<Box mt="xl">
<Title order={3}>Interesting Journals In The Field</Title>

  {papers.length > 0 ? (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        marginTop: '20px',
      }}
    >
      {papers.map((paper, index) => (
        <Card
          key={index}
          shadow="sm"
          padding="lg"
          style={{
            width: '300px',
            borderRadius: '10px',
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Text
            size="lg"
            mt="md"
            style={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '10px',
              lineHeight: '1.5',
            }}
          >
            {paper.title}
          </Text>

          <Text>
            {paper.Author}
          </Text>

          <Text>
            {paper.organization}
          </Text>
          
          <Button
            variant="light"
            color="blue"
            fullWidth
            mt="md"
            component="a"
            href={paper.paperLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#1E90FF',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              padding: '12px',
              borderRadius: '5px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4682B4'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1E90FF'}
          >
            Read more
          </Button>
        </Card>
      ))}
    </div>
  ) : (
    <Text style={{fontSize: '1.2rem', color: '#777' }}>No articles available.</Text>
  )}
</Box>

<Title order={3}>Comments</Title>
        {/* Messages displayed on page initialization */}
        <div style={{ paddingBottom: '130px' }}>
          {threadData && threadData.length > 0 ? (
            threadData.map((threadMessage) => (
              <Card key={threadMessage.MessageID} shadow="sm" padding="md" radius="md" style={{ backgroundColor: 'transparent', marginBottom: '10px', marginTop: '10px' }}>
                <Group>
                  {threadMessage.MessageFirstname + " " + threadMessage.MessageLastname == threadData[0].UserFullname ? (
                    <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <Text><span style={{ fontWeight: 700 }}>{threadMessage.MessageFirstname} {threadMessage.MessageLastname}</span> <span style={{ fontWeight: 400, fontSize: 13, float: 'right' }}>{new Date(threadMessage.MessageCreatedAt).toLocaleDateString()} {new Date(threadMessage.MessageCreatedAt).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>

                      {editingMessageId == threadMessage.MessageID ? (
                        // In-place edit mode: Display a Textarea
                        <div style={{ flex: 1 }}>
                          <Textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            placeholder="Edit your message"
                            autosize
                            styles={{
                              input: { backgroundColor: 'transparent' },
                            }}
                          />
                        </div>
                      ) : (
                        // Display message content normally
                        <Text style={{ flex: 1 }}>
                          {threadMessage.MessageContent}
                        </Text>
                      )}

                      {editingMessageId == threadMessage.MessageID ? (
                        // Show "Save" and "Cancel" buttons when editing
                        <>
                          <Button
                            onClick={() => handleSaveEdit(editingMessageId, editedContent)} 
                            variant="subtle" 
                            color="green" 
                            size="sm"
                            mt="sm"
                          >
                            Save
                          </Button>
                          <Button 
                            onClick={() => handleCancelEdit(editingMessageId)} 
                            variant="subtle" 
                            color="gray" 
                            size="sm"
                            mt="sm"
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        // Show "Edit" button when not editing
                        <>
                          <Button 
                            onClick={() => handleEditMessage(threadMessage.MessageID, threadMessage.MessageContent)} 
                            variant="subtle" 
                            color="blue" 
                            size="sm"
                            mt="sm"
                          >
                            Edit
                          </Button>

                          <Button
                            onClick={() => handleReply(threadMessage.MessageID)}
                            variant="subtle" 
                            color="grape" 
                            size="sm"
                            mt="sm"
                          >
                            Reply
                          </Button>

                          <Button 
                            onClick={() => handleDeleteThreadMessage(threadMessage.MessageID)}
                            variant="subtle" 
                            color="red" 
                            size="sm"
                            mt="sm"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Box>
                  ) : (
                    <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <Text><span style={{ fontWeight: 700 }}>{threadMessage.MessageFirstname} {threadMessage.MessageLastname}</span> <span style={{ fontWeight: 400, fontSize: 13, float: 'right' }}>{new Date(threadMessage.MessageCreatedAt).toLocaleDateString()} {new Date(threadMessage.MessageCreatedAt).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>
                      <Text style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{threadMessage.MessageContent}</Text>

                      <Button 
                        onClick={() => handleReply(threadMessage.MessageID)}
                        variant="subtle" 
                        color="grape" 
                        size="sm"
                        mt="sm"
                      >
                        Reply
                      </Button>
                    </Box>
                  )}
                </Group>
              </Card>
            ))
          ) : (
            null
          )}

          {/* Messages sent in real-time by a user*/}
          {messages.map((msg) => (
            <Card key={msg.id} shadow="sm" padding="md" radius="md" style={{ backgroundColor: 'transparent', marginBottom: '10px', marginTop: '10px' }}>
              <Group>
                {msg.sender == userName ? (
                  <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    <Text><span style={{ fontWeight: 700 }}>{msg.sender}</span> <span style={{ fontWeight: 400, fontSize: 13, float: 'right' }}>{new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>

                    {editingMessageId == msg.id ? (
                      // In-place edit mode: Display a Textarea
                      <div style={{ flex: 1 }}>
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          placeholder="Edit your message"
                          autosize
                          styles={{
                            input: { backgroundColor: 'transparent' },
                          }}
                        />
                      </div>
                    ) : (
                      // Display message content normally
                      <Text style={{ flex: 1 }}>
                        {msg.content}
                      </Text>
                    )}

                    {editingMessageId == msg.id ? (
                      // Show "Save" and "Cancel" buttons when editing
                      <>
                        <Button
                          onClick={() => handleSaveEdit(editingMessageId, editedContent)} 
                          variant="subtle" 
                          color="green" 
                          size="sm"
                          mt="sm"
                        >
                          Save
                        </Button>
                        <Button 
                          onClick={() => handleCancelEdit(editingMessageId)} 
                          variant="subtle" 
                          color="gray" 
                          size="sm"
                          mt="sm"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      // Show "Edit" button when not editing
                      <>
                        <Button 
                          onClick={() => handleEditMessage(msg.id, msg.content)} 
                          variant="subtle" 
                          color="blue" 
                          size="sm"
                          mt="sm"
                        >
                          Edit
                        </Button>

                        <Button
                          onClick={() => handleReply(msg.id)}
                          variant="subtle" 
                          color="grape" 
                          size="sm"
                          mt="sm"
                        >
                          Reply
                        </Button>

                        <Button 
                          onClick={() => handleDeleteThreadMessage(msg.id)}
                          variant="subtle" 
                          color="red" 
                          size="sm"
                          mt="sm"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </Box>
                ) : (
                  <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    <Text><span style={{ fontWeight: 700 }}>{msg.sender}</span> <span style={{ fontWeight: 400, fontSize: 13, float: 'right' }}>{new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>
                    <Text style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{msg.content}</Text>

                    <Button 
                      onClick={() => handleReply(msg.id)}
                      variant="subtle" 
                      color="grape" 
                      size="sm"
                      mt="sm"
                    >
                      Reply
                    </Button>
                  </Box>
                )}
              </Group>
            </Card>
          ))}
        </div>

        {/* User input for posting */}
        <Paper
          shadow="sm" 
          radius="md"
          mt="xl"
          p="md"
          withBorder

          style={{
            position: 'fixed',
            bottom: 0,
            width: '1108px',
          }}
        >
          <Textarea
            placeholder="Your message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            minRows={3}
            mb="sm"
          />
<<<<<<< HEAD
          <Button onClick={handlePostMessage}>Post Comment</Button>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            id="video-upload"
            style={{ display: 'none' }} // Hide the default file input
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
            style={{ display: 'none' }} // Hide the default file input
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
            style={{ display: 'none' }} // Hide the default file input
          />

          <label htmlFor="image-upload">
            <Button component="span" variant="outline" style={{ marginBottom: '10px' }}>
            <IconPhoto size={20} /> Upload Image
            </Button>
          </label>
=======
          <Button style={{ marginBottom: '10px' }} onClick={sendMessage}>Post Message</Button>
>>>>>>> 71e8c27a0a83c0f557ff824db80d91d019008166
        </Paper>
      </Container>
    </Layout>
  );
}
