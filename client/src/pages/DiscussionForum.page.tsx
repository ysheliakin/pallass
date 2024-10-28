import React, { useState, useEffect } from 'react';
import { Container, Title, Stack, Paper, Image, Group, TextInput, Button, Text } from '@mantine/core';
import { Layout, useStyles } from '../components/layout';

interface WebSocketProps {
    receiverId: String;
}

export function DiscussionForumPage(/*{ receiverId }: WebSocketProps*/) {
    const styles = useStyles();

    // Websocket connection
    useEffect(() => {
        const senderEmail = localStorage.getItem('email')
        console.log("senderEmail: ", senderEmail)
        const ws = new WebSocket(`ws://localhost:8080/ws/${senderEmail}`)

        ws.onopen = () => {
            console.log("Websocket connected");
        }
    })

    return (
        <Layout>
            <Container size="lg">
                <Title order={2} ta="center" mt="xl" style={styles.title}>Discussion forum name 1</Title>
            </Container>
        </Layout>
    );
}