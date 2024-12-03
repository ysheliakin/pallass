import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Container, Paper, TextInput, Title } from '@mantine/core';
import { base } from '@/api/base';
import { Layout, useStyles } from '@/components/layout';


export function ForgotPasswordPage() {
    const styles = useStyles();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async () => {
        const response = await fetch(`${base}/request-reset`, {
          method: 'POST',
          body: JSON.stringify({ email }),
        });

        if (response.ok) {
            localStorage.setItem("email", email);
            setError('');
            navigate('/reset-password');
        } else {
            const errorData = await response.json();
            setError(errorData.message)
        }
    };
    
    return (
        <Layout>
            <Link to="/" style={{ textDecoration: 'none', fontWeight: 'bold', color: 'black' }}>
                &lt; Back to Homepage
            </Link>
            
            <Container size="xs" mt={60}>
                <Title order={2} ta="center" mt="xl" style={styles.title}>Enter your email address</Title>
            
                {error && <p style={{ color: "red" }}>{error}</p>}

                <Paper withBorder shadow="md" p={30} mt={30} radius="md">                
                    <TextInput
                        label="Email address"
                        placeholder="hello@example.com"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.currentTarget.value)}
                        styles={{ input: styles.input }}
                    />
                    
                    <Button fullWidth mt="xl" style={styles.primaryButton} onClick={handleSubmit}>Submit</Button>
                </Paper>
            </Container>
        </Layout>
    );
}
