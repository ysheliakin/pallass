import React, { useState } from 'react';
import { Container, Title, TextInput, Textarea, Select, Text, Button, Paper, Group } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';
import { useNavigate, Link } from 'react-router-dom';

export function CreateThread() {
  const styles = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: 'General', label: 'General' },
    { value: 'Technology', label: 'Technology' },
    // Add more predefined categories as needed
  ]);

  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')
  const navigate = useNavigate();

  const handleCreateThread =  async () => {
    // Handle thread creation logic here
    const threadData = {
      Title: title,
      Content: description,
      Category: category,
      UserEmail: email
    };
  
    try {
      // Send a POST request to the backend
      const response = await fetch('http://localhost:5000/postThread', {
        method: 'POST', // POST request
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(threadData), // Convert thread data to JSON
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Get the response data
      const threadIdentifiers = await response.json();
      localStorage.setItem("threadID", threadIdentifiers.id);
      navigate(`/thread/${threadIdentifiers.uuid}`);
    } catch (error) {
      console.error('Error creating thread:', error);
      alert('Failed to create thread. Please try again.');
    }
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.some(c => c.value === newCategory)) {
      setCategories([...categories, { value: newCategory, label: newCategory }]);
      setCategory(newCategory);
      setNewCategory('');
    }
  };

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>
      
      <Container size="sm" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Create a Thread</Title>
        
        <Paper 
          withBorder 
          shadow="md" 
          p={30} 
          mt={30} 
          radius="md" 
          style={{...styles.formContainer, backgroundColor: 'white'}}
        >
          <TextInput
            label="Title"
            placeholder="Enter thread title"
            required
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <Textarea
            label="Description"
            placeholder="Enter thread description"
            required
            mt="md"
            minRows={4}
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <Select
            label="Category"
            placeholder="Select a category"
            data={categories}
            searchable
            value={category}
            onChange={(value: string | null) => setCategory(value)}
            mt="md"
            styles={{ input: styles.input }}
          />

          <Group mt="sm" align="flex-end">
            <TextInput
              label="New Category"
              placeholder="Enter new category"
              value={newCategory}
              onChange={(event) => setNewCategory(event.currentTarget.value)}
              style={{ flex: 1 }}
              styles={{ input: styles.input }}
            />
            <Button onClick={handleAddCategory}>Add</Button>
          </Group>

          <Button 
            fullWidth 
            mt="xl" 
            style={styles.primaryButton}
            onClick={handleCreateThread}
          >
            Create thread
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}