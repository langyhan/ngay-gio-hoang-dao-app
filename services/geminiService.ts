import { GenerateContentResponse } from "@google/genai";

export async function generateReading(cardName: string, isReversed: boolean, question: string): Promise<string> {
    try {
        const response = await fetch('/api/generate-reading', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cardName, isReversed, question }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get a reading from the server.');
        }

        const data: { text: string } = await response.json();
        if (!data.text) {
            throw new Error("Received an empty response from the server.");
        }
        return data.text;

    } catch (error) {
        console.error("Error fetching reading from serverless function:", error);
        throw new Error("Failed to get a reading from the AI.");
    }
}
