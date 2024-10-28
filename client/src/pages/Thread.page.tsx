import React, { useState, useEffect, useRef } from 'react';
import { Container, Title, Stack, Paper, Image, Group, TextInput, Button, Text } from '@mantine/core';
import { Layout, useStyles } from '@/components/layout';

interface WebSocketProps {
    receiverId: String;
}

// Modify interface
interface Message {
    sender: string;
    content: string;
}

export function ThreadPage(/*{ receiverId }: WebSocketProps*/) {
    const styles = useStyles();
    // Modify const lines
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const senderEmail = localStorage.getItem('email');
    const ws = useRef<WebSocket | null>(null); // Use a ref for the WebSocket instance

    // Websocket connection
    useEffect(() => {
        console.log("senderEmail: ", senderEmail)
        ws.current = new WebSocket(`ws://localhost:5000/ws/${senderEmail}`)

        ws.current.onopen = () => {
            console.log("Websocket connected");
        }

        // Modify lines
        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, message]);
        };

        ws.current.onerror = (event) => {
            console.error("WebSocket error observed:", event);
        };

        return () => {
            ws.current?.close();
        };
    }, [senderEmail])

    const sendMessage = () => {
        const message = { sender: senderEmail, content: inputValue };
        
        if (ws.current) { // Check if ws.current is defined
            ws.current.send(JSON.stringify(message));
            setInputValue('');
        } else {
            console.error("WebSocket is not initialized.");
        }
    };

    {/*<Layout>
            <Container size="lg">
                <Title order={2} ta="center" mt="xl" style={styles.title}>Discussion forum name 1</Title>
            </Container>
        </Layout>*/}

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>  
    );
}