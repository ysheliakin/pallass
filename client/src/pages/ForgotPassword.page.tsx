import React, { useState } from 'react';
import { TextInput, Button, Paper } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Layout, useStyles } from '../components/layout';

export function ForgotPasswordPage() {
    const styles = useStyles();
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async () => {
        const response = await fetch('http://localhost:5000/checkemail', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            console.log("Email associated with an account");
            console.log("Email: ", email);

            navigate('/reset-password');

            const response = await fetch('http://localhost:5000/request-reset', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                console.log("Email (request-reset response): ", email);
                localStorage.setItem("email", email)
                navigate('/reset-code');
            } else {
                console.log("Not able to send reset code");
            }
        } else {
            console.log("No email associated with account");
        }
    };

    return (
        <div>
            <Layout>
                <Paper>                
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
            </Layout>
        </div>
    );
}
