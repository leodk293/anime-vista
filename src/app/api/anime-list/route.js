import { NextResponse } from "next/server";
import AnimeList from "@/lib/models/animeList";
import { connectMongoDB } from "@/lib/db/connectMongoDb";

export async function POST(request) {
    try {
        const { animeName, animeImage, animeId, genres, year, season } = await request.json();

        if (!animeName || !animeImage || !animeId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Check if anime already exists
        const existingAnime = await AnimeList.findOne({ animeId });
        if (existingAnime) {
            return NextResponse.json(
                { message: "Anime already exists" },
                { status: 200 }
            );
        }

        const anime = await AnimeList.create({
            animeName,
            animeImage,
            animeId,
            genres,
            year,
            season
        });

        return NextResponse.json({
            message: "Anime added successfully",
            anime
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding anime:", error);
        return NextResponse.json(
            { error: "Failed to add anime" },
            { status: 500 }
        );
    }
}

export const GET = async (request) => {
    try {
        await connectMongoDB();
        const animeList = await AnimeList.find();
        return NextResponse.json({ animeList });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch anime list" }, { status: 500 });
    }
};