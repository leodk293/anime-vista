import { NextResponse } from "next/server";
import FavoriteList from "@/lib/models/favoriteList";
import { connectMongoDB } from "@/lib/db/connectMongoDb";

export const POST = async (request) => {
    try {
        const { animeId, animeTitle, animePoster, userId } = await request.json();
        if (!animeId || !animeTitle || !animePoster || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        await connectMongoDB();
        const existingAnime = await FavoriteList.findOne({ animeId, userId });
        if (existingAnime) {
            return NextResponse.json({ message: "Anime already added to favorite list" }, { status: 409 });
        }
        const anime = await FavoriteList.create({
            animeId,
            animeTitle,
            animePoster,
            userId
        });
        return NextResponse.json({
            message: "Anime added successfully",
            anime
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding anime:", error);
        return NextResponse.json({ error: "Failed to add anime" }, { status: 500 });
    }
}


export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        if (!userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        await connectMongoDB();
        const anime = await FavoriteList.find({ userId });
        return NextResponse.json({
            message: "Favorite list fetched successfully",
            anime
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching favorite:", error);
        return NextResponse.json({ error: "Failed to fetch anime" }, { status: 500 });
    }
}

export const DELETE = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const animeId = searchParams.get("animeId");
        const userId = searchParams.get("userId");
        if (!animeId || !userId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        await connectMongoDB();
        const anime = await FavoriteList.findOneAndDelete({ animeId, userId });
        return NextResponse.json({
            message: "Anime removed successfully from favorite list",
            anime
        }, { status: 200 });
    } catch (error) {
        console.error("Error removing anime:", error);
        return NextResponse.json({ error: "Failed to remove anime from favorite list " }, { status: 500 });
    }
}