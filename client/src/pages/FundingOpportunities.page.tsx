import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Group, NumberInput, TextInput, Title, Text, Grid } from '@mantine/core';

type FundingItem = {
  id: number;
  Title: string;
  TargetAmount: number;
  Major: string;
  DeadlineDate: Date;
};

const FundingOpportunities = () => {
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(100000);
  const [major, setMajor] = useState<string>('');
  const [Deadline, setDeadline] = useState<Date>(new Date());
  const [filteredItems, setFilteredItems] = useState<FundingItem[]>([]);

  // Fetch funding opportunities from backend
  const fetchFundingItems = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/funding?minAmount=${minAmount}&maxAmount=${maxAmount}&major=${major}&deadline=${Deadline.toISOString().split('T')[0]}`
      );
      const data = await response.json();
      setFilteredItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch data when filters are applied
  useEffect(() => {
    fetchFundingItems();
  }, [minAmount, maxAmount, major, Deadline]);

  return (
    <Container>
      <Title style={{ textAlign: 'center' }} mt="xl">Funding Opportunities</Title>

      <Group mt="md">
        <NumberInput
          label="Minimum Amount"
          value={minAmount}
          onChange={(value) => setMinAmount(Number(value))}
          min={0}
          step={500}
          style={{ width: 200 }}
        />
        <NumberInput
          label="Maximum Amount"
          value={maxAmount}
          onChange={(value) => setMaxAmount(Number(value))}
          min={0}
          step={500}
          style={{ width: 200 }}
        />
        <TextInput
          label="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          style={{ width: 200 }}
        />
        <TextInput
          label="Deadline"
          value={Deadline.toISOString().split('T')[0]}
          onChange={(e) => setDeadline(new Date(e.target.value))}
          type="date"
          style={{ width: 200 }}
        />
        <Button onClick={fetchFundingItems} style={{ height: '100%' }}>Filter</Button>
      </Group>

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
                  <strong>Major:</strong> {item.Major}
                </Text>
                <Text mt="xs" size="sm" color="dimmed">
                  <strong>Deadline:</strong> {new Date(item.DeadlineDate).toLocaleDateString()}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FundingOpportunities;
