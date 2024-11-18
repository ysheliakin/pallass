import React, { useState } from 'react';
import { Button, Card, Container, Group, NumberInput, TextInput, Title, Text, Grid } from '@mantine/core';

// Sample funding items
const fundingItems = [
  { id: 1, Title: 'AI Research Grant', TargetAmount: 10000, major: 'Computer Science', deadlineDate: new Date('2024-12-31') },
  { id: 2, Title: 'Biology Scholarship', TargetAmount: 5000, major: 'Biology', deadlineDate: new Date('2024-11-30') },
  { id: 3, Title: 'Mathematics Fellowship', TargetAmount: 20000, major: 'Mathematics', deadlineDate: new Date('2025-01-15') },
  { id: 4, Title: 'Data Science Fellowship', TargetAmount: 12000, major: 'Computer Science', deadlineDate: new Date('2024-12-15') },
];

type FundingItem = {
  id: number;
  Title: string;
  TargetAmount: number;
  major: string;
  deadlineDate: Date;
};

const FundingOpportunities = () => {
  // State for input fields
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(100000);
  const [major, setMajor] = useState<string>('');
  const [deadline, setDeadline] = useState<Date>(new Date());
  const [filteredItems, setFilteredItems] = useState<FundingItem[]>(fundingItems);

  // Filter function
  const filterFundingItems = () => {
    const filtered = fundingItems.filter(item =>
      item.TargetAmount >= minAmount &&
      item.TargetAmount <= maxAmount &&
      item.major.toLowerCase().includes(major.toLowerCase()) &&
      item.deadlineDate <= deadline
    );
    setFilteredItems(filtered);
  };

  // Handle form input changes
  const handleMinAmountChange = (value: string | number) => setMinAmount(Number(value));
  const handleMaxAmountChange = (value: string | number) => setMaxAmount(Number(value));
  const handleMajorChange = (e: React.ChangeEvent<HTMLInputElement>) => setMajor(e.target.value);
  const handleDeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => setDeadline(new Date(e.target.value));

  return (
    <Container>
      <Title style={{ textAlign: 'center' }} mt="xl">Funding Opportunities</Title>

      {/* Filter form */}
      <Group mt="md">
        <NumberInput 
          label="Minimum Amount" 
          value={minAmount} 
          onChange={handleMinAmountChange} 
          min={0}
          step={500}
          style={{ width: 200 }} 
        />
        <NumberInput 
          label="Maximum Amount" 
          value={maxAmount} 
          onChange={handleMaxAmountChange} 
          min={0}
          step={500}
          style={{ width: 200 }} 
        />
        <TextInput 
          label="Major" 
          value={major} 
          onChange={handleMajorChange} 
          style={{ width: 200 }} 
        />
        <TextInput 
          label="Deadline" 
          value={deadline.toISOString().split('T')[0]} 
          onChange={handleDeadlineChange} 
          type="date"
          style={{ width: 200 }} 
        />
        <Button onClick={filterFundingItems} style={{ height: '100%' }}>Filter</Button>
      </Group>

      {/* Display filtered items */}
      {filteredItems.length === 0 ? (
        <Text style={{ textAlign: 'center' }} mt="md">No funding opportunities found with the given criteria.</Text>
      ) : (
        <Grid mt="xl">
          {filteredItems.map(item => (
            <Grid.Col key={item.id} span={4}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3}>{item.Title}</Title>
                <Text mt="md" size="sm" color="dimmed">
                  <strong>Amount:</strong> ${item.TargetAmount}
                </Text>
                <Text mt="xs" size="sm" color="dimmed">
                  <strong>Major:</strong> {item.major}
                </Text>
                <Text mt="xs" size="sm" color="dimmed">
                  <strong>Deadline:</strong> {item.deadlineDate.toLocaleDateString()}
                </Text>
                <Button 
                  color="blue" 
                  fullWidth 
                  mt="md" 
                  radius="md" 
                  component="a" 
                  href="#" // Add actual link here
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Opportunity
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FundingOpportunities;
