import React, { useEffect, useState } from 'react';
import { string } from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Card, Checkbox, Container, Grid, Menu, Paper, Radio, Text, TextInput, Title } from '@mantine/core';
import { base } from '@/api/base';
import { Layout, useStyles } from '@/components/layout';


interface Threads {
  ID: number, 
  Firstname: string, 
  Lastname: string, 
  Title: string, 
  Content: string, 
  Category: string, 
  Uuid: number,
  UpvoteCount: number
}

// Mock data for threads (unchanged)
const mockThreads = Array(12).fill(null).map((_, index) => ({
  id: index + 1,
  title: `Thread ${index + 1}`,
  category: `Category ${(index % 3) + 1}`,
  lastActive: new Date(Date.now() - Math.random() * 10000000000),
}));

export function DiscoverThreads() {
  const styles = useStyles();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [threadName, setThreadName] = useState('');
  const [sortBy, setSortBy] = useState('mostUpvoted');
  const [lastActive, setLastActive] = useState('');
  const [threadsData, setThreadsData] = useState<Threads[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchThreadData = async () => {
      const threadsByMostUpvotes = await fetch(`${base}/getThreadsSortedByMostUpvotes`, {
        method: 'GET',
      });

      // Check if the response is ok
      if (!threadsByMostUpvotes.ok) {
        throw new Error('Error in the response');
      }

      const threadsByMostUpvotesData = await threadsByMostUpvotes.json();
      setThreadsData(threadsByMostUpvotesData);
    };

    fetchThreadData();
  }, []);

  let categories: string[] = [];

  if (threadsData != null) {
    // Get unique categories from threads
    categories = [...new Set(threadsData.map((thread) => thread.Category))];
  } else {
    categories = [];
  }

  const handleViewThread = (threadID: number) => {
    {
      localStorage.setItem('threadID', threadID.toString());
    }
  };

  // Handle category selection
  const handleCategorySelect = async (category: string) => {
    // If "None" is selected, set selectedCategory to an empty string
    // Otherwise, set selectedCategory to the selected category
    if (category === 'None') {
      setSelectedCategory('');
    } else {
      setSelectedCategory(category);
    }
  };

  // Handle upvotes sorting selection
  const handleSortByUpvotes = async (sortByUpvotes: string) => {
    // If "Most upvoted" is chosen, set sortBy to 'mostUpvoted'
    // Otherwise, set sortBy to 'leastUpvoted'
    if (sortByUpvotes == 'mostUpvoted') {
      setSortBy('mostUpvoted');
    } else {
      setSortBy('leastUpvoted');
    }
  };

  const handleFilter = async (title: string, category: string, sortByUpvotes: string) => {
    console.log('threadName: ', threadName);
    if (threadName != '') {
      // Display the threads, sorted by the most upvotes, whose title contains the input entered by the user
      if (sortByUpvotes == 'mostUpvoted') {
        const response = await fetch(`${base}/getThreadsByNameSortedByMostUpvotes`, {
          method: 'POST',
          body: JSON.stringify({ title }),
        });

        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error in the response');
        }

        const responseData = await response.json();
        console.log('responseData: ', responseData);
        setThreadsData(responseData);
      } else {
        // Display the threads, sorted by the least upvotes, whose title contains the input entered by the user
        const response = await fetch(`${base}/getThreadsByNameSortedByLeastUpvotes`, {
          method: 'POST',
          body: JSON.stringify({ title }),
        });

        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error in the response');
        }

        const responseData = await response.json();
        console.log('responseData: ', responseData);
        setThreadsData(responseData);
      }
    } else {
      if (sortByUpvotes == 'mostUpvoted') {
        // Show all of the threads sorted by the most upvotes
        if (category == '') {
          const response = await fetch(`${base}/getThreadsSortedByMostUpvotes`, {
            method: 'GET',
          });

          // Check if the response is ok
          if (!response.ok) {
            throw new Error('Error in the response');
          }

          const responseData = await response.json();
          setThreadsData(responseData);
        } else {
          // Show all of the threads of a chosen category sorted by the most upvotes
          const response = await fetch(`${base}/getThreadsByCategorySortedByMostUpvotes`, {
            method: 'POST',
            body: JSON.stringify({ category }),
          });

          // Check if the response is ok
          if (!response.ok) {
            throw new Error('Error in the response');
          }

          const responseData = await response.json();
          setThreadsData(responseData);
        }
      } else {
        // Show all of the threads sorted by the least upvotes
        if (category == '') {
          const response = await fetch(`${base}/getThreadsSortedByLeastUpvotes`, {
            method: 'GET',
          });

          // Check if the response is ok
          if (!response.ok) {
            throw new Error('Error in the response');
          }

          const responseData = await response.json();
          setThreadsData(responseData);
        } else {
          // Show all of the threads of a chosen category sorted by the least upvotes
          const response = await fetch(`${base}/getThreadsByCategorySortedByLeastUpvotes`, {
            method: 'POST',
            body: JSON.stringify({ category }),
          });

          // Check if the response is ok
          if (!response.ok) {
            throw new Error('Error in the response');
          }

          const responseData = await response.json();
          setThreadsData(responseData);
        }
      }
    }
  };

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>

      <Container size="xl" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Discover Threads</Title>
        
        <Grid mt={30}>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Filters</Title>
              
              <Text fw={500} mb="xs">Category</Text>
              {/* Dropdown menu to select a category */}
              <Menu>
                <Menu.Target>
                  <div
                    style={{
                      padding: '10px',
                      border: '1px solid #ccc',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {/* Conditionally render the selected category or placeholder */}
                    <span
                      style={{
                        color: selectedCategory && selectedCategory !== 'No category' ? '#000' : '#aaa',
                      }}
                    >
                      {/* If a category is selected, render that category. Otherwise, render the placeholder */}
                      {selectedCategory && selectedCategory !== 'No category'
                        ? `${selectedCategory}`
                        : 'Select a Category'}
                    </span>

                    {/* To create the dropdown arrow */}
                    <span
                      style={{
                        marginLeft: 10,
                        borderLeft: '5px solid transparent',
                        borderRight: '5px solid transparent',
                        borderTop: '5px solid',
                        width: 0,
                        height: 0,
                      }}
                    />
                  </div>
                </Menu.Target>

                <Menu.Dropdown>
                  {categories.map((category) => (
                    <Menu.Item 
                      key={category} 
                      onClick={() => handleCategorySelect(category)}
                    >
                      {category}
                    </Menu.Item>
                  ))}
                  <Menu.Item style={{ color: 'red' }} onClick={() => handleCategorySelect("None")}>None</Menu.Item>
                </Menu.Dropdown>
              </Menu>

              <TextInput
                label="Thread Name (any category)"
                placeholder="Search by name"
                value={threadName}
                onChange={(event) => setThreadName(event.currentTarget.value)}
                mt="md"
                styles={{ input: styles.input }}
              />

              {/* Sort the threads by most upvoted or by least upvoted */}
              <Text fw={500} mt="md" mb="xs">Sort by</Text>
              <Radio.Group value={sortBy}>
                <Radio value="mostUpvoted" label="Most upvoted" mb="xs" onClick={() => handleSortByUpvotes("mostUpvoted")} />
                <Radio value="leastUpvoted" label="Least upvoted" mb="xs" onClick={() => handleSortByUpvotes("leastUpvoted")} />
              </Radio.Group>

              <Button 
                onClick={() => handleFilter(threadName, selectedCategory, sortBy)} 
                fullWidth 
                variant="outline" 
                color="gray" 
                mt="xl"
              >
                Save
              </Button>
            </Paper>
          </Grid.Col>

          {/* Display the threads based on the filters selected */}

          <Grid.Col span={9}>
            {threadsData ? (
              <Grid>
                {threadsData.map(thread => (
                  <Grid.Col key={thread.ID} span={4}>
                    <Card 
                      shadow="sm" 
                      p="lg" 
                      radius="md" 
                      withBorder 
                      component={Link}
                      onClick={() => handleViewThread(thread.ID)}
                      to={`/thread/${thread.Uuid}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Text fw={500}>{thread.Title}</Text>
                      <Text size="sm" color="dimmed" mt="xs">
                        Category: {thread.Category}
                      </Text>
                      <Text size="sm" color="dimmed" mt="xs">Upvotes: {thread.UpvoteCount}</Text>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Text
                style={{
                  fontWeight: 500,
                  letterSpacing: '1px',
                }}
              >
                No threads were found.
              </Text>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </Layout>
  );
}
