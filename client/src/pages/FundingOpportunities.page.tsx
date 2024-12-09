import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Button,
  Card,
  Container,
  Grid,
  Group,
  NumberInput,
  Paper,
  Radio,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { base } from '@/api/base';
import { Layout, useStyles } from '@/components/layout';

type FundingItem = {
  ID: number;
  Title: string;
  Description: string;
  TargetAmount: number;
  Link: string;
  DeadlineDate: Date;
};

export function FundingOpportunities() {
  const styles = useStyles();

  const [fundingOpportunityName, setFundingOpportunityName] = useState('');
  const [filteredItems, setFilteredItems] = useState<FundingItem[]>([]);
  const [sortBy, setSortBy] = useState('highestAmount');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(100000);

  const token = localStorage.getItem('token');

  // Fetch funding opportunities from backend
  const fetchFundingItems = async () => {
    setError('Please enter the earliest and latest deadlines you want.');
  };

  // Fetch data when filters are applied
  useEffect(() => {
    fetchFundingItems();
  }, []);

  // Handle amount sorting selection
  const handleSortByAmount = async (sortByAmount: string) => {
    // If "Highest amount" is chosen, set sortBy to 'highestAmount'
    // Otherwise, set sortBy to 'lowestAmount'
    if (sortByAmount == 'highestAmount') {
      setSortBy('highestAmount');
    } else {
      setSortBy('lowestAmount');
    }
  };

  const handleFilter = async (title: string, sortByUpvotes: string) => {
    setError('');

    if (!startDate && !endDate) {
      setError('Please enter the earliest and latest deadlines you want.');
      return;
    } else if (!startDate) {
      setError('Please enter the earliest deadline you want.');
      return;
    } else if (!endDate) {
      setError('Please enter the latest deadline you want.');
      return;
    }

    console.log('fundingOpportunityName: ', fundingOpportunityName);
    if (fundingOpportunityName != '') {
      if (sortByUpvotes == 'highestAmount') {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        const min_amount = String(minAmount)
        const max_amount = String(maxAmount)

        // Display the funding oppportunities sorted by the highest amount, whose title contains the input entered by the user, between the minimum and maximum amounts and between the earliest and latest deadlines inputted by the user
        const response = await fetch(
          `${base}/getFundingOpportunitiesByNameSortedByHighestAmount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          {
            method: 'POST',
            body: JSON.stringify({ title, min_amount, max_amount }),
          }
        );

        // Check if the response is ok
        if (!response.ok) {
          const responseData = await response.json();
          setError(responseData.message);
          return;
        }

        const responseData = await response.json();
        console.log('responseData: ', responseData);

        setFilteredItems(responseData);
      } else {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        const min_amount = String(minAmount)
        const max_amount = String(maxAmount)

        // Display the funding oppportunities sorted by the lowest amount, whose title contains the input entered by the user, between the minimum and maximum amounts and between the earliest and latest deadlines inputted by the user
        const response = await fetch(
          `${base}/getFundingOpportunitiesByNameSortedByLowestAmount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, min_amount, max_amount }),
          }
        );

        // Check if the response is ok
        if (!response.ok) {
          const responseData = await response.json();
          setError(responseData.message);
          return;
        }

        const responseData = await response.json();
        console.log('responseData: ', responseData);
        setFilteredItems(responseData);
      }
    } else {
      if (sortByUpvotes == 'highestAmount') {
        console.log('startDate: ', startDate);
        console.log('startDate: ', startDate);

        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        const min_amount = String(minAmount)
        const max_amount = String(maxAmount)

        // Show all of the funding oppportunities sorted by the highest amount between the minimum and maximum amounts and between the earliest and latest deadlines inputted by the user
        const response = await fetch(
          `${base}/getFundingOpportunitiesSortedByHighestAmount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ min_amount, max_amount }),
          }
        );

        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error in the response');
        }

        const responseData = await response.json();
        setFilteredItems(responseData);
      } else {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        const min_amount = String(minAmount)
        const max_amount = String(maxAmount)

        // Show all of the funding oppportunities sorted by the lowest amount between the minimum and maximum amounts and between the earliest and latest deadlines inputted by the user
        const response = await fetch(
          `${base}/getFundingOpportunitiesSortedByLowestAmount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ min_amount, max_amount }),
          }
        );

        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error in the response');
        }

        const responseData = await response.json();
        setFilteredItems(responseData);
      }
    }
  };

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>

      <Container size="xl" mt={30}>
        <Title order={2} ta="left" mt="xl" style={{ color: '#AB4D7C', textDecoration: 'none', marginLeft: 600 }}>
          Discover Funding Opportunities
        </Title>

        <Grid mt={30}>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Title order={4} mb="md">
                Filters
              </Title>

              <TextInput
                label="Grant Name"
                placeholder="Search by name"
                value={fundingOpportunityName}
                onChange={(event) => setFundingOpportunityName(event.currentTarget.value)}
                mt="md"
                styles={{ input: styles.input }}
              />

              <Group style={{ marginTop: 50, marginBottom: 50 }}>
                <DateInput
                  label="Earliest Deadline"
                  value={startDate}
                  required
                  onChange={setStartDate}
                  placeholder="Enter the earliest deadline"
                />

                <DateInput
                  label="Latest Deadline"
                  value={endDate}
                  required
                  onChange={setEndDate}
                  placeholder="Enter the latest deadline"
                />
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
              </Group>

              {/* Sort the funding oppportunities by highest amount or by lowest amount */}
              <Text fw={500} mt="md" mb="xs">
                Sort by
              </Text>
              <Radio.Group value={sortBy}>
                <Radio
                  value="highestAmount"
                  label="Highest amount"
                  mb="xs"
                  onClick={() => handleSortByAmount('highestAmount')}
                />
                <Radio
                  value="lowestAmount"
                  label="Lowest amount"
                  mb="xs"
                  onClick={() => handleSortByAmount('lowestAmount')}
                />
              </Radio.Group>

              <Button
                onClick={() => handleFilter(fundingOpportunityName, sortBy)}
                fullWidth
                variant="outline"
                color="gray"
                mt="xl"
              >
                Save
              </Button>
            </Paper>
          </Grid.Col>

          {/* Display the funding oppportunities based on the filters selected */}

          <Grid.Col span={9}>
            {error && (
              <Text style={{ fontWeight: 500, letterSpacing: '1px', marginLeft: 30 }}>{error}</Text>
            )}

            {filteredItems ? (
              <Grid>
                {filteredItems.map((filteredItem) => (
                  <Grid.Col key={filteredItem.ID} span={6}>
                    <Card
                      shadow="sm"
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Text fw={700}>{filteredItem.Title}</Text>
                      <Text size="md" mt="xs" style={{ marginBottom: 20 }}>
                        {filteredItem.Description}
                      </Text>
                      <Text size="sm" mt="xs">
                        <span style={{ fontWeight: 350 }}>Target Amount:</span> $
                        {filteredItem.TargetAmount}
                      </Text>
                      <Text size="sm" mt="xs">
                        <span style={{ fontWeight: 350 }}>Deadline:</span>{' '}
                        {new Date(filteredItem.DeadlineDate + 'T00:00:00Z').toLocaleDateString('en-US', { timeZone: 'UTC' })}
                      </Text>
                      <div style={{ marginTop: 30 }}>
                        {filteredItem.Link.startsWith('http://') ||
                        filteredItem.Link.startsWith('https://') ? (
                          <Button 
                            component="a"
                            href={filteredItem.Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="blue" 
                            fullWidth 
                            mt="md" 
                            radius="md"
                            style={{ textDecoration: 'none' }}
                          >
                            View
                          </Button>
                        ) : (
                          <Button 
                            component="a"
                            href={`http://${filteredItem.Link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="blue" 
                            fullWidth 
                            mt="md" 
                            radius="md"
                            style={{ textDecoration: 'none' }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <div>
                {error ? (
                  <Text
                    style={{
                      fontWeight: 500,
                      letterSpacing: '1px',
                      marginLeft: 30,
                    }}
                  >
                    {error}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontWeight: 500,
                      letterSpacing: '1px',
                      marginLeft: 30,
                    }}
                  >
                    No funding opportunities were found.
                  </Text>
                )}
              </div>
            )}
          </Grid.Col>
        </Grid>
      </Container>
    </Layout>
  );
}
