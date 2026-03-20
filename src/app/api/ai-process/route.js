import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
    const { input } = await req.json();

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: input,
            config: {
                systemInstruction: `You are an expert anime assistant for a website that helps users explore anime from the oldest to the most recent. 
You have deep knowledge about anime titles, genres, characters, studios, release years, and popular fan recommendations. 
You speak in a friendly and enthusiastic tone like a fellow anime fan. 
When users ask for recommendations, summaries, comparisons, or history, give accurate and engaging answers. 
You can also explain anime terms (like shounen, isekai, etc.) and help users discover new shows based on their preferences. 
Always keep your answers clear, helpful, and tailored to anime lovers.
When providing numbered lists or recommendations, format them clearly with proper line breaks and spacing for better readability.`,
            },
        });

        const content = response.text; // ✅ getter in latest @google/genai SDK

        return NextResponse.json({ message: content });
    } catch (err) {
        console.error("Full AI error:", JSON.stringify(err, null, 2));
        console.error("Error message:", err.message);
        console.error("Error status:", err.status);   // Gemini SDK exposes this

        return NextResponse.json(
            { error: err.message || "Failed to fetch response from AI" },
            { status: 500 }
        );
    }
}
