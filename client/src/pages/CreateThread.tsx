import React, { useEffect, useState } from 'react';
import { Container, Title, TextInput, Textarea, Select, Text, Button, Paper, Group } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';
import { useNavigate, Link } from 'react-router-dom';
import { base } from '@/api/base';

interface Grants {
  ID: number,
	Title: string,
}

interface CategoryAndGrantData {
  Category: string;
  ID: number;
  Title: string;
}

export function CreateThread() {
  const styles = useStyles();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [grant, setGrant] = useState<string | null>(null);
  const [grants, setGrants] = useState<Grants[]>([]);

  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')
  const navigate = useNavigate();

  // Runs on initialization of the page
  useEffect(() => {
    const fetchCategoriesAndGrants = async () => {
      try {
        // Get the threads upvoted by the user
        const getCategoriesAndGrants = await fetch(`http://${base}/getCategoriesAndGrants`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
  
        // Check if the response is ok
        if (!getCategoriesAndGrants.ok) {
          throw new Error('Error in the response');
        }
  
        const getCategoriesAndGrantsData = await getCategoriesAndGrants.json();
        console.log("getCategoriesAndGrantsData: ", getCategoriesAndGrantsData);

        // Get distinct categories
        const categoriesSet: Set<string> = new Set(getCategoriesAndGrantsData.map((item: CategoryAndGrantData) => item.Category));
        // Get distinct grant IDs
        //const grantsSet: Set<string> = new Set(getCategoriesAndGrantsData.map((item: CategoryAndGrantData) => item.ID));

        // Convert Sets to Arrays if needed
        const distinctCategories = Array.from(categoriesSet).map((category) => ({
          value: category,
          label: category,
        }));
        
        // Step 1: Ensure that uniqueGrants contains Grants objects
        const uniqueGrants = Array.from(
          new Map(
            getCategoriesAndGrantsData.map((item: CategoryAndGrantData) => [
              `${item.ID}-${item.Title}`, 
              item
            ]) // This will now correctly deduplicate based on ID-Title
          ).values()
        );

        // Step 2: Type assertion to tell TypeScript that uniqueGrants is of type Grants[]
        const grantsData = (uniqueGrants as Grants[]).map((grant) => ({
          ID: grant.ID,
          Title: grant.Title,
        }));
        // Step 3: Set the grants state with the distinct data
        setGrants(grantsData);


        setCategories(distinctCategories);
      } catch(error) {
        console.log("No categories created")
      }
    }

    fetchCategoriesAndGrants();
  }, [])

  const handleCreateThread =  async () => {
    // Handle thread creation logic here
    const threadData = {
      Title: title,
      Content: description,
      Category: category,
      UserEmail: email
    };
  
    try {
      if (grant != null) {
        // Send a POST request to the backend
        const response = await fetch(`http://${base}/postThread/${grant}`, {
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
      } else {
        // Send a POST request to the backend
        const response = await fetch(`http://${base}/postThread`, {
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
      }
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

          <Select
            label="Select a research grant opportunity (optional)"
            placeholder="Enter grant"
            data={grants.map(grant => ({
              value: grant.ID.toString(),
              label: grant.Title
            }))}
            searchable
            value={grant}
            onChange={(value: string | null) => setGrant(value)}
            mt="md"
            styles={{ input: styles.input }}
          />

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