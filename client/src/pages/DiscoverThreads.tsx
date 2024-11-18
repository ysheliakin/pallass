import React, { useState } from 'react';
import { Container, Title, TextInput, Checkbox, Radio, Paper, Grid, Card, Text, Button } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';
import { Link } from 'react-router-dom';

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
  const [sortBy, setSortBy] = useState('mostRecentlyActive');
  const [lastActive, setLastActive] = useState('');

  const filterThreads = () => {
    return mockThreads.filter(thread => 
      (selectedCategories.length === 0 || selectedCategories.includes(thread.category)) &&
      (threadName === '' || thread.title.toLowerCase().includes(threadName.toLowerCase()))
    ).sort((a, b) => {
      if (sortBy === 'mostRecentlyActive') return b.lastActive.getTime() - a.lastActive.getTime();
      if (sortBy === 'leastRecentlyActive') return a.lastActive.getTime() - b.lastActive.getTime();
      return 0;
    });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setThreadName('');
    setSortBy('mostRecentlyActive');
    setLastActive('');
  };

  const filteredThreads = filterThreads();

  return (
    <Layout>
      <Container size="xl" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Discover Threads</Title>
        
        <Grid mt={30}>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Filters</Title>
              
              <Text fw={500} mb="xs">Category</Text>
              {['Category 1', 'Category 2', 'Category 3'].map(category => (
                <Checkbox
                  key={category}
                  label={category}
                  checked={selectedCategories.includes(category)}
                  onChange={(event) => {
                    if (event.currentTarget.checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    }
                  }}
                  mb="xs"
                />
              ))}

              <TextInput
                label="Thread Name"
                placeholder="Search by name"
                value={threadName}
                onChange={(event) => setThreadName(event.currentTarget.value)}
                mt="md"
                styles={{ input: styles.input }}
              />

              <Text fw={500} mt="md" mb="xs">Sort by</Text>
              <Radio.Group value={sortBy} onChange={setSortBy}>
                <Radio value="mostRecentlyActive" label="Most recently active" mb="xs" />
                <Radio value="leastRecentlyActive" label="Least recently active" mb="xs" />
                <Radio value="mostFollowed" label="Most followed" mb="xs" />
                <Radio value="leastFollowed" label="Least followed" mb="xs" />
              </Radio.Group>

              <Text fw={500} mt="md" mb="xs">Last active</Text>
              <Radio.Group value={lastActive} onChange={setLastActive}>
                <Radio value="lastHour" label="Last hour" mb="xs" />
                <Radio value="today" label="Today" mb="xs" />
                <Radio value="thisWeek" label="This week" mb="xs" />
                <Radio value="thisMonth" label="This month" mb="xs" />
                <Radio value="thisYear" label="This year" mb="xs" />
              </Radio.Group>

              <Button 
                onClick={resetFilters} 
                fullWidth 
                variant="outline" 
                color="gray" 
                mt="xl"
              >
                Reset Filters
              </Button>
            </Paper>
          </Grid.Col>

          <Grid.Col span={9}>
          <Grid>
            {filteredThreads.map(thread => (
              <Grid.Col key={thread.id} span={4}>
                <Card 
                  shadow="sm" 
                  p="lg" 
                  radius="md" 
                  withBorder 
                  component={Link} 
                  to={`/thread/${thread.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Text fw={500}>{thread.title}</Text>
                  <Text size="sm" color="dimmed" mt="xs">
                    Category: {thread.category}
                  </Text>
                  <Text size="sm" color="dimmed" mt="xs">
                    Last active: {thread.lastActive.toLocaleDateString()}
                  </Text>
                </Card>
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
        </Grid>
      </Container>
    </Layout>
  );
}