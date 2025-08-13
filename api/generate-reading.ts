import { GoogleGenAI } from "@google/genai";

// This function will be deployed as a Vercel Serverless Function
// It runs in a Node.js environment, so process.env is available.

// Vercel will automatically handle the request and response objects.
// The syntax is similar to Express.js but is framework-agnostic.
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        response.status(500).json({ error: "API_KEY environment variable not set on the server" });
        return;
    }

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    try {
        const { cardName, isReversed, question } = request.body;

        if (!cardName) {
             response.status(400).json({ error: "Missing cardName in request body" });
             return;
        }

        const model = 'gemini-2.5-flash';
        const systemInstruction = "You are 'Mystic Visions AI', a wise and insightful digital tarot reader. Your interpretations are profound, empathetic, and offer clear guidance. You avoid generic fortunes and focus on introspection and empowerment. Never break character.";
        const userPrompt = `I have a question in mind: "${question || 'about my general life path'}". I have drawn the tarot card: **${cardName}**. It appeared in the **${isReversed ? 'Reversed' : 'Upright'}** position. Please provide a detailed reading for me. Structure the reading into two sections using these exact titles: First, a paragraph on "The Card's Essence", explaining its core meaning in this orientation. Second, a paragraph on "Your Reading", connecting this essence directly to my question and offering advice for my path forward. The entire response must be text only, without any markdown formatting like bolding or asterisks.`;

        const geminiResponse = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topK: 40,
            }
        });
        
        const text = geminiResponse.text;

        if (!text) {
             response.status(500).json({ error: "Received an empty response from the AI." });
             return;
        }
        
        // Send the successful response back to the client
        response.status(200).json({ text });

    } catch (error) {
        console.error("Error in serverless function:", error);
        response.status(500).json({ error: "Failed to get a reading from the AI." });
    }
}
