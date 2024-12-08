import React, { useState } from 'react';
import { IconCheck } from '@tabler/icons-react';
import {
  Alert,
  Button,
  Container,
  Notification,
  NumberInput,
  Paper,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { createFundingOpportunity } from '@/api/funding';
import { Layout, useStyles } from '@/components/layout';
import { Link } from 'react-router-dom';

export function CreateFunding() {
  const styles = useStyles();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [amount, setAmount] = useState(0);
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    const result = await createFundingOpportunity(title, description, amount, link, deadline);
    if (result.error || !result.ID) {
      return setError(result.error || 'Internal Server Error');
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <Layout>
        <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
          &lt; Back to Your Dashboard
        </Link>
        
        <Alert variant="light" color="green" title="Confirmation" icon={<IconCheck />}>
          Added successfully!
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Link to="/dashboard" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
        &lt; Back to Your Dashboard
      </Link>

      {error !== '' && (
        <Notification color="red" title="Oops!" onClick={() => setError('')}>
          {error}
        </Notification>
      )}
      <Container size="sm" mt={30}>
        <Title order={2} ta="center" mt="xl" style={styles.title}>
          Add a Grant or Funding Opportunity
        </Title>

        <Paper
          withBorder
          shadow="md"
          p={30}
          mt={30}
          radius="md"
          style={{ ...styles.formContainer, backgroundColor: 'white' }}
        >
          <TextInput
            label="Title"
            placeholder="Enter title"
            required
            value={title}
            onChange={(event) => setTitle(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <Textarea
            label="Description"
            placeholder="Enter description"
            required
            mt="md"
            minRows={4}
            value={description}
            onChange={(event) => setDescription(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <TextInput
            label="Reference Link"
            placeholder="Enter the URL"
            required
            value={link}
            onChange={(event) => setLink(event.currentTarget.value)}
            styles={{ input: styles.input }}
          />

          <NumberInput
            label="Amount"
            placeholder="Enter dollar amount"
            allowNegative={false}
            thousandSeparator=","
            styles={{ input: styles.input }}
            value={amount}
            onChange={(val) => setAmount(Number.parseFloat(val.toString()))}
            prefix="$ "
            required
          />

          <DateInput
            label="Submission deadline"
            placeholder="Enter the date and time (optional)"
            value={deadline}
            onChange={(val) => setDeadline(val)}
            styles={{ input: styles.input }}
            required
          />

          <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleCreate}>
            Submit
          </Button>
        </Paper>
      </Container>
    </Layout>
  );
}
