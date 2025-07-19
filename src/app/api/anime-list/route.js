import { NextResponse } from "next/server";
import AnimeList from "@/lib/models/animeList";
import { connectMongoDB } from "@/lib/db/connectMongoDb";

export const GET = async (request) => {
    try {
        await connectMongoDB();
        const animeList = await AnimeList.find();
        return NextResponse.json({ animeList });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch anime list" }, { status: 500 });
    }
};