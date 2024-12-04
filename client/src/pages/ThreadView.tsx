import React, { useEffect, useRef, useState } from 'react';
import { EditorConsumer } from '@tiptap/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Card, Container, Group, Image, Title as MantineTitle, Modal, Paper, Text, Textarea, Title } from '@mantine/core';
import { base } from '@/api/base';
import { Layout, useStyles } from '@/components/layout';
import { FundingOpportunities } from './FundingOpportunities.page';


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
  id: string,
  sender: string,
  content: string,
  date: string,
  type: string,
  reply: string,
  replyingmsgid: string,
  replyingmsgsender: string,
  replyingmsgcontent: string,
  replyingmsgdate: string,
}

interface Thread {
  ThreadID: string,
  ThreadTitle: string,
  ThreadContent: string,
  ThreadCategory: string,
  UpvoteCount: string,
  ThreadUuid: string,
  ThreadCreatedAt: string,
  ThreadUserEmail: string,
  MessageID: string,
  MessageFirstname: string,
  MessageLastname: string,
  MessageContent: string,
  MessageCreatedAt: string,
  ReplyID: string,
  ReplyFirstname: string,
  ReplyLastname: string,
  ReplyContent: string,
  ReplyCreatedAt: string,
  UserFullname: string,
  UpvoteEmails: Array<String>,
  FundingOpportunityTitle: string,
}

export function ThreadView() {
  const styles = useStyles();
  const navigate = useNavigate();

  const [newMessage, setNewMessage] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
  // States for message reply
  const [replyingToMessageId, setReplyingToMessageId] = useState<string | null>(null);
  const [replyingToMessageSender, setReplyingToMessageSender] = useState<string | null>(null);
  const [replyingToMessageContent, setReplyingToMessageContent] = useState<string | null>(null);
  const [replyingToMessageDate, setReplyingToMessageDate] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [threadData, setThreadData] = useState<Thread[] | null>(null);
  const [upvoteState, setUpvoteState] = useState(false);
  const [userName, setUserName] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);

  const email = localStorage.getItem('email');
  const ws = useRef<WebSocket | null>(null);
  const threadID = localStorage.getItem('threadID');
  var getUserName = '';

  const fetchArticles = async () => {
    const today = new Date();

    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    // Formatting
    const formattedDate = yesterday.toISOString().split('T')[0];
    // console.log(formattedDate);
    // console.log("testing");
    var filteredQuery;

    const fillerWords = [
      'a',
      'about',
      'the',
      'in',
      'of',
      'thread',
      'they',
      'like',
      'so',
      'or',
      'as',
      'yet',
      'just',
      'very',
      'right',
      'just',
      'by',
      'be',
      'you',
      'as',
      'this',
      'that',
      'we',
      'us',
      'me',
      'them',
      'there',
      'their',
      'on',
      'to',
      'think',
      'most',
      'not',
      'few',
      'is',
      'it',
      'he',
      'she',
      'what',
      'where',
      'why',
      'how',
      'if',
      'nor',
      'when',
      'too',
      'see',
      'saw',
      'do',
      'know',
      'way',
      'here',
      'all',
    ];

    // console.log("threadData (fetchArticles): ", threadData)

    // filter out filler words
    if (threadData && threadData.length > 0 && threadData[0].ThreadTitle) {
      const query = threadData[0].ThreadTitle;
      filteredQuery = query
        .split(' ')
        .filter((word) => !fillerWords.includes(word.toLowerCase()))
        .join(' ');

      // console.log('Filtered Query:', filteredQuery);
    } else {
      console.error('ThreadTitle is null or undefined');
    }
    try {
      if (threadData && threadData.length > 0) {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=${filteredQuery}&from=2024-11-06&to=${formattedDate}&sortBy=popularity&language=en&apiKey=3457f090118c4f92a4eab998982c7457`
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
      console.error('Error fetching articles:', error);
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

    const fillerWords = [
      'a',
      'about',
      'the',
      'in',
      'of',
      'thread',
      'they',
      'like',
      'so',
      'or',
      'as',
      'yet',
      'just',
      'very',
      'right',
      'just',
      'by',
      'be',
      'you',
      'as',
      'this',
      'that',
      'we',
      'us',
      'me',
      'them',
      'there',
      'their',
      'on',
      'to',
      'think',
      'most',
      'not',
      'few',
      'is',
      'it',
      'he',
      'she',
      'what',
      'where',
      'why',
      'how',
      'if',
      'nor',
      'when',
      'too',
      'see',
      'saw',
      'do',
      'know',
      'way',
      'here',
      'all',
    ];
    // filter out filler words
    if (threadData && threadData.length > 0 && threadData[0].ThreadTitle) {
      const query = threadData[0].ThreadCategory;
      filteredQuery = query
        .split(' ')
        .filter((word) => !fillerWords.includes(word.toLowerCase()))
        .join(' ');

      // console.log('Filtered Query:', filteredQuery);
    } else {
      console.error('ThreadTitle is null or undefined');
    }
    const safeQuery = filteredQuery || '';
    try {
      if (threadData && threadData.length > 0) {
        const response = await fetch(
          // `https://doaj.org/api/search/journals/keywords:${filteredQuery}?lang=en&page=1&pageSize=3`
          `https://doaj.org/api/search/journals/${filteredQuery}?lang=en&page=1&pageSize=3`
          // `https://doaj.org/api/search/journals/${filteredQuery}?page=1&pageSize=3`
          // q=${encodeURIComponent(safeQuery)}&fromDate=${formattedDate}&toDate=${formattedDate}&size=3&lang=en`
        );
        // const textResponse = await response.text();
        // console.log(textResponse);
        const data = await response.json();
        // console.log('API Response:', JSON.stringify(data, null, 2));

        if (data && data.results && data.results.length > 0) {
          const papers: Paper[] = data.results.map((paper: any) => ({
            title: paper.bibjson?.title || ' ',
            Author: paper.bibjson?.author?.name,
            organization: paper.bibjson?.publisher.name || ' ', // Publisher name as organization
            paperLink:
              paper.bibjson.article.license_display_example_url ||
              `https://www.google.com/search?q=article+has+no+link`, // Link to article
          }));

          setPapers(papers.slice(0, 3));
          // console.log(JSON.stringify(papers));
        } else {
          console.error('Papers not found in response', data);
        }
      }
    } catch (error) {
      console.error('Error fetching Papers:', error);
    }
  };

  const fetchThread = async () => {
    // Get the discussion thread's information (including its messages)
    const fetchThreadData = async () => {
      const response = await fetch(`${base}/threads/${threadID}`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data != null) {
        // If the user upvoted the thread, do not allow the user to click on the "Upvote" button again
        data[0].UpvoteEmails.map((user_email: String) => {
          if (user_email == email) {
            setUpvoteState(true);
          }
        });
      }

      setThreadData(data);
    };

    fetchThreadData();
    // fetchArticles();

    // Websocket connection
    ws.current = new WebSocket(`ws://${base}/wsthread/${email}`);

    ws.current.onopen = () => {
      console.log('Websocket connected');
    };

    // Handle incoming messages from the WebSocket server (i.e. when a user sends a message)
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      // Edit the message's content if the type is 'EDIT_MESSAGE'
      if (message.type === 'EDIT_MESSAGE') {
        // Edit the message (if it was a newly sent message)
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id == message.id ? { ...msg, content: message.content } : msg
          )
        );

        // Edit the message (if it was an older message displayed during the page initialization)
        setThreadData((prevMessages) => {
          if (prevMessages == null) {
            return [];
          }

          const updatedThreadMessages = prevMessages.map((msg) =>
            msg.MessageID == message.id ? { ...msg, MessageContent: message.content } : msg
          );
          return updatedThreadMessages;
        });
      }
      // Remove the message and its nested replies if the type is 'DELETE_MESSAGE'
      else if (message.type === 'DELETE_MESSAGE') {
        // To delete a message and its nested replies that were newly sent
        const deleteNewMessageAndReplies = (
          messages: Message[],
          deletingMessageId: string
        ): Message[] => {
          // Contain all messages that are going to be deleted
          const deletingMessages = new Set([deletingMessageId]);

          // Get all of the replies to the deleted messages
          const deletingReplies = (messageId: string) => {
            // Find the replies to the replies of the deleted message
            const replies = messages.filter((msg) => msg.replyingmsgid === messageId);
            replies.forEach((reply) => {
              deletingMessages.add(reply.id);
              deletingReplies(reply.id);
            });
          };

          // Recursion that starts from the deleted message
          deletingReplies(deletingMessageId);

          // Filter out all the messages that need to be deleted
          return messages.filter((msg) => !deletingMessages.has(msg.id));
        };

        // To delete a message and its nested replies that were displayed on page initialization
        const deleteOldMessageAndReplies = (
          messages: Thread[],
          deletingMessageId: string
        ): Thread[] => {
          const deletingMessages = new Set([Number(deletingMessageId)]);

          const deletingReplies = (messageId: string) => {
            const replies = messages.filter((msg) => msg.ReplyID == messageId);
            replies.forEach((reply) => {
              deletingMessages.add(Number(reply.MessageID));
              deletingReplies(reply.MessageID);
            });
          };

          deletingReplies(deletingMessageId);

          return messages.filter((msg) => !deletingMessages.has(Number(msg.MessageID)));
        };

        // Remove the deleted message and its nested replies (if it was a newly sent message)
        setMessages((prevMessages) => deleteNewMessageAndReplies(prevMessages, message.id));

        // Remove the deleted message and its nested replies (if it was an older message displayed during the page initialization)
        setThreadData((prevMessages) => {
          if (prevMessages == null || prevMessages.length === 0) {
            return [];
          }

          const updatedThreadMessages = deleteOldMessageAndReplies(prevMessages, message.id);
          console.log('updatedThreadMessages: ', updatedThreadMessages);

          return updatedThreadMessages;
        });
      }
      // Render the list of messages with the new message included
      else {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    ws.current.onerror = (event) => {
      console.error('WebSocket error observed:', event);
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      ws.current?.close();
    };
  };

  // Runs on initialization of the page
  useEffect(() => {
    fetchThread();
    //fetchArticles();
  }, [email, threadID]);

  useEffect(() => {
    if (threadData && threadData.length > 0) {
      fetchArticles();
      fetchPapers();
    }
  }, [email, threadID, threadData]);

  console.log('threadData: ', threadData);

  const sendMessage = async () => {
    // Get the sender's information
    const fullname = await fetch(`${base}/getUserName`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    // Check if the response is ok
    if (!fullname.ok) {
      throw new Error('Network response was not ok');
    }

    const userData = await fullname.json();
    const firstname = userData.Firstname;
    const lastname = userData.Lastname;
    getUserName = '' + firstname + ' ' + lastname;

    const threadid = threadID;
    const content = newMessage;
    const replymessageid = replyingToMessageId;

    // Store the message being sent
    const storeThreadMessage = await fetch(`${base}/storeThreadMessage`, {
      method: 'POST',
      body: JSON.stringify({ firstname, lastname, threadid, content, replymessageid }),
    });

    if (!storeThreadMessage.ok) {
      throw new Error('Network response was not ok');
    }

    const threadMessageData = await storeThreadMessage.json();
    const messageID = '' + threadMessageData.ID + '';

    const message = {
      id: messageID,
      sender: getUserName,
      content: newMessage,
      date: threadMessageData.CreatedAt,
      reply: 'false',
    } as Message;

    localStorage.setItem('localName', getUserName);

    const name = localStorage.getItem('localName');
    if (name != null) {
      setUserName(name);
    }

    // If the WebSocket connection exists, send the message through the WebSocket
    if (ws.current) {
      ws.current.send(JSON.stringify(message));
      setNewMessage('');
    } else {
      console.error('The WebSocket is uninitialized.');
    }
  };

  // Called when the user clicks on the 'Edit' button: enables the user to edit their message
  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedContent(content);
  };

  // Upvote the discussion thread
  const handleUpvote = async () => {
    try {
      const storeUpvote = await fetch(`${base}/threads/upvote/${threadID}`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });

      if (!storeUpvote.ok) {
        throw new Error('Failed to upvote');
      }

      const getThreadUpvotes = await fetch(`${base}/threads/getUpvotes/${threadID}`, {
        method: 'GET',
      });

      if (!getThreadUpvotes.ok) {
        throw new Error('Failed to upvote');
      }

      const data = await getThreadUpvotes.json();

      setThreadData((prevData) => {
        if (!prevData) {
          return prevData;
        }

        const updatedThread = prevData.map((getData, index) => {
          if (index === 0) {
            return { ...getData, UpvoteCount: data };
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
    const response = await fetch(`${base}/deleteThreadMessage/${messageId}`, {
      method: 'DELETE',
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const getMessageID = '' + messageId + '';

    // Delete the message with the corresponding message ID: "getMessageID"
    if (ws.current) {
      ws.current.send(
        JSON.stringify({ id: getMessageID, type: 'DELETE_MESSAGE', replyingmsgid: getMessageID })
      );
    }
  };

  // Save the edited message
  const handleSaveEdit = async (messageId: string, content: string) => {
    const id = '' + messageId + '';

    const response = await fetch(`${base}/editThreadMessage`, {
      method: 'POST',
      body: JSON.stringify({ id, content }),
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    // Edit the message with the corresponding message ID
    if (ws.current) {
      ws.current.send(JSON.stringify({ id: id, content: content, type: 'EDIT_MESSAGE' }));
    }

    setEditingMessageId(null);
    setEditedContent('');
  };

  // Called when the user clicks on the 'Cancel' button: stops the editing interface
  const handleCancelEdit = () => {
    setEditingMessageId(null);
  };

  // Called when the user clicks on the 'Reply' button: enables the user to reply to a message
  const handleReply = (
    messageId: string,
    messageSender: string,
    messageContent: string,
    messageDate: string
  ) => {
    setReplyingToMessageId(messageId);
    setReplyingToMessageSender(messageSender);
    setReplyingToMessageContent(messageContent);
    setReplyingToMessageDate(messageDate);
  };

  // Post the reply
  const handlePostReply = async (messageId: string) => {
    // Get the sender's information
    const fullname = await fetch(`${base}/getUserName`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    // Check if the response is ok
    if (!fullname.ok) {
      throw new Error('Network response was not ok');
    }

    const userData = await fullname.json();
    const firstname = userData.Firstname;
    const lastname = userData.Lastname;
    getUserName = '' + firstname + ' ' + lastname;

    const threadid = threadID;
    const content = newMessage;
    const replymessageid = '' + messageId + '';

    // Store the reply
    const storeThreadMessage = await fetch(`${base}/storeThreadMessage`, {
      method: 'POST',
      body: JSON.stringify({ firstname, lastname, threadid, content, replymessageid }),
    });

    if (!storeThreadMessage.ok) {
      throw new Error('Network response was not ok');
    }

    const threadMessageData = await storeThreadMessage.json();
    const messageID = '' + threadMessageData.ID + '';
    const id = replymessageid;

    // Get the information of the message being replied to
    const getReplyingMessageData = await fetch(`${base}/getReplyingMessageData`, {
      method: 'POST',
      body: JSON.stringify({ id }),
    });

    const replyingMessageData = await getReplyingMessageData.json();
    const replyingMessageSender =
      replyingMessageData[0].Firstname + ' ' + replyingMessageData[0].Lastname;
    const replyingMessageID = '' + replyingMessageData[0].ID + '';

    var message: Message;

    // If the ID of the message being replied to exists, create an object containing a reply
    // Else, create an object containing a message that is not a reply
    if (replymessageid != null) {
      message = {
        id: messageID,
        sender: getUserName,
        content: newMessage,
        date: threadMessageData.CreatedAt,
        reply: 'true',
        replyingmsgid: replyingMessageID,
        replyingmsgsender: replyingMessageSender,
        replyingmsgcontent: replyingMessageData[0].Content,
        replyingmsgdate: replyingMessageData[0].CreatedAt,
      } as Message;
    } else {
      message = {
        id: messageID,
        sender: getUserName,
        content: newMessage,
        date: threadMessageData.CreatedAt,
        reply: 'false',
      } as Message;
    }

    localStorage.setItem('localName', getUserName);

    const name = localStorage.getItem('localName');
    if (name != null) {
      setUserName(name);
    }

    if (ws.current) {
      // Send the message
      ws.current.send(JSON.stringify(message));
      setNewMessage('');
    } else {
      console.error('The WebSocket is uninitialized.');
    }

    // Set the states for the message reply to null to end the reply interface
    setReplyingToMessageId(null);
    setReplyingToMessageSender(null);
    setReplyingToMessageContent(null);
    setReplyingToMessageDate(null);
  };

  // End the reply interface
  const handleCancelReply = () => {
    setReplyingToMessageId(null)
    setReplyingToMessageSender(null)
    setReplyingToMessageContent(null)
    setReplyingToMessageDate(null)
  }  

  // Handle the loading state
  if (!threadData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>

      <Container size="lg" mt={30}>
        {/* Discussion thread's title, description, creation date, and upvotes */}
        <Paper p="md" shadow="sm" radius="md" withBorder>
          <MantineTitle order={2} style={styles.title} mb="xs">
            {threadData[0].ThreadTitle}
          </MantineTitle>
          
          <Group justify="space-between" align="center">
            <Text size="sm" color="dimmed">
              Created on: <strong>{new Date(threadData[0].ThreadCreatedAt).toLocaleDateString()}</strong>
            </Text>
            <Text size="sm" color="dimmed">
              Upvotes: <strong>{threadData[0].UpvoteCount}</strong>
            </Text>
          </Group>

          {threadData[0].FundingOpportunityTitle && (
            <Text size="sm" style={{ fontStyle: 'italic', marginBottom: 10 }}>
              Research Grant Opportunity: <strong>{threadData[0].FundingOpportunityTitle}</strong>
            </Text>
          )}

          <Text mb="lg" size="md" style={{ lineHeight: 1.6 }}>
            {threadData[0].ThreadContent}
          </Text>

          {/* Upvote button */}
          <Group>
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
        <Card key={index} shadow="sm" padding="lg" style={{ width: '350px' }} 
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {article.urlToImage && (
            <Image src={article.urlToImage} alt={article.title} height={200} fit="cover" />
          )}
          <Text size="lg" mt="md">{article.title}</Text>
          <Button
            // variant="light"
            color="blue"
            fullWidth
            mt="md"
            component="a"
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4DFF00'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2986CC'}
          >
            READ MORE
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
            width: '350px',
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
            variant="dark"
            color="red"
            fullWidth
            mt="md"
            component="a"
            href={paper.paperLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#CC0000',
              color: '#fff',
              // fontWeight: 'bold',
              textTransform: 'uppercase',
              padding: '12px',
              borderRadius: '5px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4DFF00'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#CC0000'}
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

<Title style={{ marginTop: 50 }} order={3}>Comments</Title>
        {/* Messages displayed on page initialization */}
        <div style={{ paddingBottom: replyingToMessageId ? '220px' : '130px' }}>
          {threadData && threadData[0].MessageID ? (
            threadData.map((threadMessage) => (
              <React.Fragment key={threadMessage.MessageID}>
                {/* If the message is a reply, display the message being replied to */}
                {threadMessage.ReplyContent && (
                  <Card shadow="sm" padding="xs" radius="md" style={{ backgroundColor: '#D7C6B4', marginTop: '10px', ...(threadMessage.ReplyContent != '' ? { borderBottomLeftRadius: '0', borderBottomRightRadius: '0' } : {}) }}>
                    <Group>
                      <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        <Text><span style={{ color: '#BE4BDB', fontWeight: 700, fontSize: 14 }}>Reply To </span> | <span style={{ fontSize: 12, fontWeight: 700 }}>{ threadMessage.ReplyFirstname } { threadMessage.ReplyLastname }</span> <span style={{ fontSize: 10, float: 'right' }}>{new Date(threadMessage.ReplyCreatedAt).toLocaleDateString()} {new Date(threadMessage.ReplyCreatedAt).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>
                        <Text style={{ fontSize: 12 }}>{ threadMessage.ReplyContent }</Text>
                      </Box>
                    </Group>
                  </Card>
                )}

                <Card key={threadMessage.MessageID} shadow="sm" padding="md" radius="md" style={{ backgroundColor: 'transparent', marginBottom: '10px', ...(threadMessage.ReplyID != null ? { borderTopLeftRadius: '0', borderTopRightRadius: '0' } : { marginTop: '10px' }) }}>
                  <Group>
                    {/* Display the 'Edit' and 'Delete' buttons if the user is the one who sent the message */}
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
                              onClick={handleCancelEdit} 
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
                              onClick={() => handleReply(threadMessage.MessageID, threadMessage.MessageFirstname + " " + threadMessage.MessageLastname, threadMessage.MessageContent, threadMessage.MessageCreatedAt)}
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
                      // Do not display the 'Edit' and 'Delete' buttons if the user is not the one who sent the message
                      <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                        <Text><span style={{ fontWeight: 700 }}>{threadMessage.MessageFirstname} {threadMessage.MessageLastname}</span> <span style={{ fontWeight: 400, fontSize: 13, float: 'right' }}>{new Date(threadMessage.MessageCreatedAt).toLocaleDateString()} {new Date(threadMessage.MessageCreatedAt).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>
                        <Text style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{threadMessage.MessageContent}</Text>

                        <Button 
                          onClick={() => handleReply(threadMessage.MessageID, threadMessage.MessageFirstname + " " + threadMessage.MessageLastname, threadMessage.MessageContent, threadMessage.MessageCreatedAt)}
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
              </React.Fragment>
            ))
          ) : (
            null
          )}

          {/* Messages sent in real-time by a user*/}
          {messages.map((msg) => (
            <React.Fragment key={msg.id}>
              {/* If the message is a reply, display the message being replied to */}
              {msg.reply == 'true' && (
                <Card shadow="sm" padding="xs" radius="md" style={{ backgroundColor: '#D7C6B4', marginTop: '10px', ...(msg.reply === 'true' ? { borderBottomLeftRadius: '0', borderBottomRightRadius: '0' } : {}) }}>
                  <Group>
                    <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <Text><span style={{ color: '#BE4BDB', fontWeight: 700, fontSize: 14 }}>Reply To </span> | <span style={{ fontSize: 12, fontWeight: 700 }}>{ msg.replyingmsgsender }</span> <span style={{ fontSize: 10, float: 'right' }}>{new Date(msg.replyingmsgdate).toLocaleDateString()} {new Date(msg.replyingmsgdate).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>
                      <Text style={{ fontSize: 12 }}>{ msg.replyingmsgcontent }</Text>
                    </Box>
                  </Group>
                </Card>
              )}

              <Card shadow="sm" padding="md" radius="md" style={{ backgroundColor: 'transparent', marginBottom: '10px', ...(msg.reply === 'true' ? { borderTopLeftRadius: '0', borderTopRightRadius: '0' } : { marginTop: '10px' }) }}>
                <Group>
                  {/* Display the 'Edit' and 'Delete' buttons if the user is the one who sent the message */}
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
                            onClick={handleCancelEdit}
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
                            onClick={() => handleReply(msg.id, msg.sender, msg.content, msg.date)}
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
                    // Do not display the 'Edit' and 'Delete' buttons if the user is not the one who sent the message
                    <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                      <Text><span style={{ fontWeight: 700 }}>{msg.sender}</span> <span style={{ fontWeight: 400, fontSize: 13, float: 'right' }}>{new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>
                      <Text style={{ wordWrap: 'break-word', overflowWrap: 'break-word' }}>{msg.content}</Text>

                      <Button 
                        onClick={() => handleReply(msg.id, msg.sender, msg.content, msg.date)}
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
            </React.Fragment>
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
            marginTop: 50,
          }}
        >
          { replyingToMessageId && replyingToMessageDate ? (
            // If the user is replying to a message, display the message the user is replying to
            <div>
              <Card shadow="sm" padding="xs" radius="md" style={{ backgroundColor: 'lightgray', marginTop: '10px', borderBottomLeftRadius: '0', borderBottomRightRadius: '0' }}>
                <Group>
                  <Box style={{ width: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                    <Text><Button color='red' size='compact-xs' onClick={() => handleCancelReply()}>X</Button> <span style={{ color: '#BE4BDB', fontWeight: 700, fontSize: 14 }}>Replying To </span> | <span style={{ fontSize: 12, fontWeight: 700 }}>{replyingToMessageSender}</span> <span style={{ fontSize: 10, float: 'right' }}>{new Date(replyingToMessageDate).toLocaleDateString()} {new Date(replyingToMessageDate).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit', hour12: true})}</span></Text>
                    <Text style={{ fontSize: 12 }}>{replyingToMessageContent}</Text>
                  </Box>
                </Group>
              </Card>

              <Textarea
                placeholder="Your message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.currentTarget.value)}
                minRows={3}
                mb="sm"
                radius="0"
              />

              <Button style={{ marginBottom: '10px' }} onClick={() => handlePostReply(replyingToMessageId)}>Post Message</Button>
            </div>
          ) : (
            <div>
              <Textarea
                placeholder="Your message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.currentTarget.value)}
                minRows={3}
                mb="sm"
              />
              
              <Button style={{ marginBottom: '10px' }} onClick={sendMessage}>Post Message</Button>
            </div>
          ) }
        </Paper>
      </Container>
    </Layout>
  );
}
