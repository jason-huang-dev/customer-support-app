'use client'

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageSquare, ArrowUp } from "lucide-react";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

const GeminiAI = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (input.trim()) {
      // Add the user's message to the chat
      setMessages([...messages, { text: input, sender: 'user' }]);
  
      try {
        // Generate a response from the Gemini AI with a context-specific prompt
        const prompt = `You are a pantry assistant. Please provide concise and relevant responses about pantry-related tasks. User input: "${input}". Respond briefly.`;
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
    
        // Add the AI's response to the chat
        setMessages([...messages, { text: input, sender: 'user' }, { text: text, sender: 'ai' }]);
      } catch (error) {
        console.error('Error generating content:', error);
        setMessages([...messages, { text: input, sender: 'user' }, { text: 'Error generating response', sender: 'ai' }]);
      }
  
      // Clear the input
      setInput('');
    }
  };
  
  
  return (
    <aside
      className={`border-l transition-all duration-300 ease-in-out`}
    >
      <nav className="h-full flex flex-col max-h-[100vh] overflow-y-auto">
        <div className="p-2 my-1.5 flex justify-between items-center">
          <h2 className={`text-lg mr-4 font-semibold `}>Chat Support</h2>
        </div>

          <div className="flex-grow overflow-y-auto p-4 transition-all duration-300 ease-in-out">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-2 my-2 rounded-md ${
                  message.sender === 'user' ? 'bg-blue-200 self-end' : 'bg-gray-200 self-start'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>

        
          <div className="border-t p-3 flex items-center">
            <input
              className="flex-grow p-2 border rounded-lg"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                }
                }}
            />
            <button
              className="ml-2 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-150 text-lg"
              onClick={handleSend}
            >
              <ArrowUp />
            </button>
          </div>
      </nav>
    </aside>
  );
};

export default GeminiAI;