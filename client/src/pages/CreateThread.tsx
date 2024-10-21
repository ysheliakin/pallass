import React, { useState } from 'react';
import { Container, Title, TextInput, Textarea, Select, Text, Button, Paper, Group } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';

export function CreateThread() {
  const styles = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: 'general', label: 'General' },
    { value: 'tech', label: 'Technology' },
    // Add more predefined categories as needed
  ]);

  const handleCreateThread =  async () => {
    console.log('Thread data:', { title, description, category });
    // Handle thread creation logic here
    const threadData = {
      Firstname: "Guest",
      Lastname: "Guest",
      Title: title,
      Content: description,
      Category: category,
    };
  
    try {
      // Send a POST request to the backend
      const response = await fetch('http://localhost:5000/postThread', {
        method: 'POST', // Specify the request method
        headers: {
          'Content-Type': 'application/json', // Specify content type as JSON
        },
        body: JSON.stringify(threadData), // Convert thread data to JSON
      });
  
      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Get the response data
      const data = await response.json();
      console.log('Response from server:', data);
      window.location.href = data.link;


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

          <Text size="sm" color="gray" mt="md">
            Note: A moderator must approve a post before it is displayed.
          </Text>

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