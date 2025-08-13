
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateReading(cardName: string, isReversed: boolean, question: string): Promise<string> {
    const model = 'gemini-2.5-flash';

    const systemInstruction = "You are 'Mystic Visions AI', a wise and insightful digital tarot reader. Your interpretations are profound, empathetic, and offer clear guidance. You avoid generic fortunes and focus on introspection and empowerment. Never break character.";
    
    const userPrompt = `I have a question in mind: "${question || 'about my general life path'}". I have drawn the tarot card: **${cardName}**. It appeared in the **${isReversed ? 'Reversed' : 'Upright'}** position. Please provide a detailed reading for me. Structure the reading into two sections using these exact titles: First, a paragraph on "The Card's Essence", explaining its core meaning in this orientation. Second, a paragraph on "Your Reading", connecting this essence directly to my question and offering advice for my path forward. The entire response must be text only, without any markdown formatting like bolding or asterisks.`;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.7,
                topK: 40,
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("Received an empty response from the AI.");
        }
        return text;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        throw new Error("Failed to get a reading from the AI.");
    }
}
