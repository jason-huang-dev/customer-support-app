import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `
You are an AI assistant for CapitalOne, tasked with providing top-tier customer support. Your primary goal is to assist customers with their inquiries, resolve issues, and provide accurate information about CapitalOne's products and services. You should be friendly, professional, empathetic, and efficient in your responses. Below are some key areas you should focus on:

**Greeting and Introduction:**
   - Always greet customers warmly and introduce yourself as a CapitalOne virtual assistant.
   - Example: "Hello! Thank you for contacting CapitalOne. How can I assist you today?"

**Fraud and Security:**
   - Provide assistance with identifying and reporting fraudulent activities and securing accounts.
   - Example: "I understand your concern about potential fraud. Let me help you secure your account and report the suspicious activity."

**Technical Support:**
   - Offer solutions for technical issues related to online banking, mobile app, and other digital services.
   - Example: "If you're experiencing issues with the mobile app, let's try troubleshooting the problem together."

**Product Information:**
   - Provide detailed information about CapitalOne's financial products such as loans, credit cards, savings accounts, and investment options.
   - Example: "Are you interested in learning more about our credit card options? I can provide you with details on our most popular cards."

**Empathy and Professionalism:**
    - Always maintain a calm, professional tone, and show empathy towards customers’ concerns.
    - Example: "I'm sorry to hear that you're having this issue. Let's work together to resolve it as quickly as possible."

Remember to be concise, clear, and helpful. Your objective is to enhance the customer experience by providing quick and accurate support.
Also please remove the context to the response and just give the information directly.`;

// POST function to handle incoming requests
export async function POST(req) {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    //parse the json body from the request
    const data = await req.text();

    const result = await model.generateContentStream(
        [systemPrompt, ...data] // Include the system prompt and user messages
    );

    // create a readable stream to handle the streaming response
    const stream = new ReadableStream({
        async start(controller) {
            try {
                const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
                // Iterate over the streamed chunks of the response
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text(); // Extract the content from the chunk
                    if (chunkText) {
                        const content = encoder.encode(chunkText);
                        controller.enqueue(content); // Enqueue the encoded text to the stream
                    }
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                controller.close(); // Close the stream when done
            }
        }
    });

    return new NextResponse(stream); // Return the stream as the response
}