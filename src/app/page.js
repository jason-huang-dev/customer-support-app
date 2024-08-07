'use client';
import { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';

export default function Home() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(''); // To display errors

  const fetchResponse = async () => {
    setResponse('');
    setError('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: 'Hello, Llama!' }),
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
  
      const result = await res.json();
      // Assuming the API returns the response text in result.text or result.data.text
      setResponse(result.text || result.data?.text || 'No response text found');
    } catch (error) {
      console.error('Failed to fetch response:', error);
      setError('Failed to fetch response');
    }
  };

  return (
    <Container>
      <Button variant="contained" onClick={fetchResponse}>
        Get Llama Response
      </Button>
      {error && <Typography variant="body2" color="error">{error}</Typography>}
      <Typography variant="body2">{response}</Typography>
    </Container>
  );
}
