import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req) {
    const { input } = await req.json();

    const openai = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai"
    });

    try {
        const response = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "system",
                    content: `You are an expert anime assistant for a website that helps users explore anime from the oldest to the most recent. 
            You have deep knowledge about anime titles, genres, characters, studios, release years, and popular fan recommendations. 
            You speak in a friendly and enthusiastic tone like a fellow anime fan. 
            When users ask for recommendations, summaries, comparisons, or history, give accurate and engaging answers. 
            You can also explain anime terms (like shounen, isekai, etc.) and help users discover new shows based on their preferences. 
            Always keep your answers clear, helpful, and tailored to anime lovers.
            
            When providing numbered lists or recommendations, format them clearly with proper line breaks and spacing for better readability.`,
                },
                {
                    role: "user",
                    content: input,
                },
            ]
        });

        let content = response.choices[0].message.content;

        // Enhanced formatting for better readability
        content = content

            .replace(/\*\*/g, '')

            .replace(/\*/g, '')

            .replace(/\\n/g, '\n')

            .replace(/(\d+\.\s)/g, '\n$1')

            .replace(/\n{3,}/g, '\n\n')

            .replace(/([.!?])\s*(\d+\.)/g, '$1\n\n$2')

            .replace(/([^:]):([A-Z])/g, '$1: $2')

            .trim();

        return NextResponse.json({ message: content });
    } catch (err) {
        console.error("AI API Error:", err);
        return NextResponse.json({ error: "Failed to fetch response from AI" }, { status: 500 });
    }
}