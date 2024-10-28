import React, { useState } from 'react';
import { TextInput, Button, Paper, Container, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Layout, useStyles } from '@/components/layout';

export function ForgotPasswordPage() {
    const styles = useStyles();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/request-reset', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
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
