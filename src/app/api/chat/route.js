import { NextResponse } from 'next/server';

const systemPrompt = ""

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          { role: 'user', content: prompt },
        ],
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data from Llama:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Llama' }, { status: 500 });
  }
}
