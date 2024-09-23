import { useNavigate } from 'react-router-dom';
import { Container, Group, Title, Text, Grid, Button } from '@mantine/core';

export const HomePage = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/signup");
  }

  const handleLoginClick = () => {
    navigate("/login");
  }

  return (
    <Container>
      <header  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Title order={1}>Pallas's Hub</Title>

        <Group>
          <Button variant="filled" onClick={handleLoginClick}>Log In</Button>
          <Button variant="outline" onClick={handleSignUpClick}>Sign Up</Button>
        </Group>
      </header>

      <Title order={1}>Welcome to Pallas's Hub, a communication hub for researchers</Title>

      <Grid>
        <Grid.Col span={5}>
          <Text>Create and join Groups to work on projects</Text>
        </Grid.Col>
        <Grid.Col span={5}>
          <img src="" alt="Image of a group example" />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={5}>
          <img src="" alt="Image of a Discussion Thread example" />
        </Grid.Col>
        <Grid.Col span={5}>
          <Text>Create and follow threads in the Discussion Forum</Text>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={5}>
          <Text>Join and host Expert Q&A sessions</Text>
        </Grid.Col>
        <Grid.Col span={5}>
        <img src="" alt="Image of an Expert Q&A session example" />
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={5}>
        <img src="" alt="Image of a Learn topic example" />
        </Grid.Col>
        <Grid.Col span={5}>
          <Text>Learn about a topic written by an expert / Write about a topic you are an expert in</Text>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={5}>
          <Text>Send direct messages</Text>
        </Grid.Col>
        <Grid.Col span={5}>
        <img src="" alt="Image of a direct message example" />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
