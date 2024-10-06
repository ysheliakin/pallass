import React, { useState } from 'react';
import { Button, Container, Group, Paper, Select, Text, Textarea, TextInput, Title } from '@mantine/core';
import { styles } from '@/theme';


export function CreateThread() {
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([
    { value: 'general', label: 'General' },
    { value: 'tech', label: 'Technology' },
    // Add more predefined categories as needed
  ]);

  const handleCreateThread = () => {
    console.log('Thread data:', { title, description, category });
    // Handle thread creation logic here
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.some((c) => c.value === newCategory)) {
      setCategories([...categories, { value: newCategory, label: newCategory }]);
      setCategory(newCategory);
      setNewCategory('');
    }
  };

  return (
    <Container size="sm" mt={30}>
      <Title order={2} ta="center" mt="xl" style={styles.title}>
        Create a Thread
      </Title>

      <Paper
        withBorder
        shadow="md"
        p={30}
        mt={30}
        radius="md"
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

        <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleCreateThread}>
          Create thread
        </Button>
      </Paper>
    </Container>
  );
}
