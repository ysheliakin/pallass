import React from 'react';
import { Container, Group, Image, Paper, Stack, Title } from '@mantine/core';
import logo from '../../logo.svg';
import { Layout, useStyles } from '../components/layout';
import fundingOpportunitiesImage from '../images/funding_opportunities_example.png';
import groupImage from '../images/group_example.svg';
import threadImage from '../images/thread_example.svg';

export function HomePage() {
  const styles = useStyles();

  return (
    <Layout>
      <Container size="lg">
        <img src={logo} alt="Logo" style={{ display: 'block', margin: '0 auto' }} />
        <Title order={2} ta="center" mt="xl" style={styles.title}>
          Communicate with fellow researchers for free
        </Title>

        <Stack gap="xl" mt="xl">
          <Paper shadow="sm" p="md">
            <Group>
              <div style={{ flex: 1 }}>
                <Title order={3}>Create and join Groups to work on projects</Title>
              </div>
              <Image src={groupImage} alt="Group example" width={417} height={200} />
            </Group>
          </Paper>

          <Paper shadow="sm" p="md">
            <Group>
              <Image
                src={threadImage}
                alt="Discussion Forum thread example"
                width={417}
                height={200}
              />
              <div style={{ flex: 1 }}>
                <Title order={3}>Create and follow threads in the Discussion Forum</Title>
              </div>
            </Group>
          </Paper>

          <Paper shadow="sm" p="md">
            <Group>
              <div style={{ flex: 1 }}>
                <Title order={3}>Create and discover Funding Opportunities</Title>
              </div>
              <Image
                src={fundingOpportunitiesImage}
                alt="Funding opportunity example"
                width={417}
                height={200}
              />
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Layout>
  );
}
