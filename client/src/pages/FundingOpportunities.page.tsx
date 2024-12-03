import React, { useEffect, useState } from 'react';
import { Button, Card, Center, Group, Loader, Text, Title } from '@mantine/core';
import { getFundingOpportunities } from '@/api/funding';
import { Layout } from '@/components/layout';
import { Link } from 'react-router-dom';

type FundingItem = {
  Title: string;
  Description: string;
  TargetAmount: number;
  Link: string;
  DeadlineDate: Date;
};

export const FundingOpportunities = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<FundingItem[]>([]);

  useEffect(() => {
    getFundingOpportunities().then((results) => {
      setItems(results as unknown as FundingItem[]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>
      
      <br />
      <Center>
        <Title>Funding Opportunities</Title>
      </Center>
      <br />
      {items.map((x) => (
        <Card key={x.Title} m="5 auto 0" w={400} shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="xs">
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
