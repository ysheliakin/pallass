import React, { useEffect, useState } from 'react';
import { Button, Card, Center, Group, Loader, Text, Title } from '@mantine/core';
import { getFundingOpportunities } from '@/api/funding';
import { Layout } from '@/components/layout';

/*type FundingItem = {
  Title: string;
  Description: string;
  TargetAmount: number;
  Link: string;
  DeadlineDate: Date;
}; */

type FundingItem = {
  Title: string;
  TargetAmount: number;  // Dollar amount
  major: string;         // Major (e.g., "Computer Science")
  deadlineDate: Date;    // Deadline date
};

const fundingItems: FundingItem[] = [
  { Title: 'AI Research Grant', TargetAmount: 10000, major: 'Computer Science', deadlineDate: new Date('2024-12-31') },
  { Title: 'Biology Scholarship', TargetAmount: 5000, major: 'Biology', deadlineDate: new Date('2024-11-30') },
  { Title: 'Mathematics Fellowship', TargetAmount: 20000, major: 'Mathematics', deadlineDate: new Date('2025-01-15') },
  { Title: 'Data Science Fellowship', TargetAmount: 12000, major: 'Computer Science', deadlineDate: new Date('2024-12-15') },
];

// Function to filter funding items by dollar amount, major, and deadline
const filterFundingItems = (
  minAmount: number,
  maxAmount: number,
  major: string,
  deadline: Date
): FundingItem[] => {
  return FundingItem.filter(item => 
    item.targetAmount >= minAmount && 
    item.targetAmount <= maxAmount && 
    item.major.toLowerCase().includes(major.toLowerCase()) && 
    item.deadlineDate <= deadline
  );


export const FundingOpportunities = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FundingItem[]>([]);

  useEffect(() => {
    getFundingOpportunities().then((results) => {
      setItems(results as unknown as FundingItem[]);
      setLoading(false);
    });
  }, []);

  if (!loading) { // set back to loading
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <br />
      <Center>
        <Title>Funding Opportunities</Title>
      </Center>
      <br />
      {items.map((x) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mt="md" mb="xs">
            <Text fw={500}>{x.Title}</Text>
          </Group>

          <Text size="sm" c="dimmed" lineClamp={3}>
            {x.Description}
          </Text>

          <Button color="blue" fullWidth mt="md" radius="md">
            <a
              style={{ textDecoration: 'none' }}
              href={x.Link}
              target="_blank"
              rel="noopener noreferrer"
            >
              View
            </a>
          </Button>
        </Card>
      ))}
    </Layout>
  );
};
