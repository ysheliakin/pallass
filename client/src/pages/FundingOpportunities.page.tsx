import React, { useState, useEffect } from 'react';
import { Button, Card, Container, Group, NumberInput, TextInput, Title, Text, Grid, Paper, Radio, Anchor } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Layout, useStyles } from '@/components/layout';
import { Link } from 'react-router-dom';
import { base } from '@/api/base';

type FundingItem = {
  ID: number;
  Title: string;
  Description: string,
  TargetAmount: number;
  Link: string;
  DeadlineDate: Date;
};

export function FundingOpportunities() {
  const styles = useStyles();

  const [fundingOpportunityName, setFundingOpportunityName] = useState('')
  const [filteredItems, setFilteredItems] = useState<FundingItem[]>([]);
  const [sortBy, setSortBy] = useState('highestAmount');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [minAmount, setMinAmount] = useState<number>(0);
  const [maxAmount, setMaxAmount] = useState<number>(100000);

  const token = localStorage.getItem('token')

  // Fetch funding opportunities from backend
  const fetchFundingItems = async () => {
    setError("Please enter the earliest and latest deadlines you want.");
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
      setSortBy('highestAmount')
    } else {
      setSortBy('lowestAmount')
    }
  };

  const handleFilter = async (title: string, sortByUpvotes: string) => {
    setError('')

    console.log("startDate: ", startDate)
    console.log("endDate: ", endDate)

    if (!startDate && !endDate) {
      setError("Please enter the earliest and latest deadlines you want.");
      return;
    } else if (!startDate) {
      setError("Please enter the earliest deadline you want.");
      return;
    } else if (!endDate) {
      setError("Please enter the latest deadline you want.");
      return;
    } 

    console.log("fundingOpportunityName: ", fundingOpportunityName)
    if (fundingOpportunityName != '') {
      // Display the funding oppportunities, sorted by the most upvotes, whose title contains the input entered by the user
      if (sortByUpvotes == 'highestAmount') {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        const response = await fetch(`http://${base}/getFundingOpportunitiesByNameSortedByHighestAmount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title }),
        });
    
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error in the response');
        }
  
        const responseData = await response.json();
        console.log("responseData: ", responseData)

        // Filter the fetched opportunities by minAmount and maxAmount
        const filteredByAmount = responseData.filter(
          (item: FundingItem) => item.TargetAmount >= minAmount && item.TargetAmount <= maxAmount
        );

      setFilteredItems(filteredByAmount);
      } else {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        // Display the funding oppportunities, sorted by the least upvotes, whose title contains the input entered by the user
        const response = await fetch(`http://${base}/getFundingOpportunitiesByNameSortedByLowestAmount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title }),
        });
    
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error in the response');
        }
  
        const responseData = await response.json();
        console.log("responseData: ", responseData)
        setFilteredItems(responseData);
      }
    } else {
      if (sortByUpvotes == 'highestAmount') {
        console.log("startDate: ", startDate)
        console.log("startDate: ", startDate)

        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        // Show all of the funding oppportunities sorted by the most upvotes
        const response = await fetch(`http://${base}/getFundingOpportunitiesSortedByHighestAmount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
    
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error in the response');
        }
  
        const responseData = await response.json();
        setFilteredItems(responseData);
      } else {
        const formattedStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '';
        const formattedEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';

        // Show all of the funding oppportunities sorted by the least upvotes
        const response = await fetch(`http://${base}/getFundingOpportunitiesSortedByLowestAmount?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
    
        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error in the response');
        }
  
        const responseData = await response.json();
        setFilteredItems(responseData);
      }
    }
  }


  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>

      <Container size="xl" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>Discover Funding Opportunities</Title>
        
        <Grid mt={30}>
          <Grid.Col span={3}>
            <Paper p="md" withBorder>
              <Title order={4} mb="md">Filters</Title>

              <TextInput
                label="Grant Name (optional)"
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
                  onChange={setStartDate}
                  placeholder="Enter the earliest deadline"
                />

                <DateInput
                  label="Latest Deadline"
                  value={endDate}
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
              <Text fw={500} mt="md" mb="xs">Sort by</Text>
              <Radio.Group value={sortBy}>
                <Radio value="highestAmount" label="Highest amount" mb="xs" onClick={() => handleSortByAmount("highestAmount")} />
                <Radio value="lowestAmount" label="Lowest amount" mb="xs" onClick={() => handleSortByAmount("lowestAmount")} />
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
            {error && <Text style={{ fontWeight: 500, letterSpacing: '1px', marginLeft: 30 }}>{error}</Text>}

            {filteredItems ? (
              <Grid>
                {filteredItems.map(filteredItem => (
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
                      <Text size="sm" mt="xs"><span style={{ fontWeight: 350 }}>Target Amount:</span> ${filteredItem.TargetAmount}</Text>
                      <Text size="sm" mt="xs"><span style={{ fontWeight: 350 }}>Deadline:</span> {new Date(filteredItem.DeadlineDate).toLocaleDateString()}</Text>
                      <div style={{ marginTop: 30 }}>
                        <Text fw={350} size="sm" mt="xs" component="span">Link: </Text>

                        {filteredItem.Link.startsWith('http://') || filteredItem.Link.startsWith('https://') ? (
                          <Anchor
                            href={filteredItem.Link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'blue' }}
                          >
                            {filteredItem.Link}
                          </Anchor>
                        ): (
                          <Anchor
                            href={`http://${filteredItem.Link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'blue' }}
                          >
                            {filteredItem.Link}
                          </Anchor>
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
                      marginLeft: 30 ,
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
