import { NextResponse } from "next/server";
import FavoriteList from "@/lib/models/favoriteList";
import { connectMongoDB } from "@/lib/db/connectMongoDb";

export const POST = async (request) => {
    try {
        // Add more detailed logging
        console.log("POST request received");

        const body = await request.json();
        console.log("Request body:", body);

        const { animeId, animeTitle, animePoster, userId, userName } = body;

        if (!animeId || !animeTitle || !animePoster || !userId || !userName) {
            console.log("Missing required fields:", { animeId, animeTitle, animePoster, userId, userName });
            return NextResponse.json({
                error: "Missing required fields",
                required: ["animeId", "animeTitle", "animePoster", "userId", "userName"]
            }, { status: 400 });
        }

        if (typeof animeId !== 'string' || typeof animeTitle !== 'string' ||
            typeof animePoster !== 'string' || typeof userId !== 'string' || typeof userName !== 'string') {
            console.log("Invalid data types:", {
                animeId: typeof animeId,
                animeTitle: typeof animeTitle,
                animePoster: typeof animePoster,
                userId: typeof userId,
                userName: typeof userName
            });
            return NextResponse.json({
                error: "Invalid data types. All fields must be strings"
            }, { status: 400 });
        }

        console.log("Connecting to MongoDB...");
        await connectMongoDB();
        console.log("Connected to MongoDB successfully");

        console.log("Checking for existing anime...");
        const existingAnime = await FavoriteList.findOne({ animeId, userId });

        if (existingAnime) {
            console.log("Anime already exists in favorites");
            return NextResponse.json({
                message: "Anime already added to favorite list",
                anime: existingAnime
            }, { status: 409 });
        }

        console.log("Creating new favorite anime entry...");
        const anime = await FavoriteList.create({
            animeId,
            animeTitle,
            animePoster,
            userId,
            userName
        });

        console.log("Anime created successfully:", anime);
        return NextResponse.json({
            message: "Anime added successfully",
            anime
        }, { status: 201 });

    } catch (error) {
        console.error("Detailed error in POST /api/favorite-list:", error);
        console.error("Error stack:", error.stack);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);

        if (error.name === 'ValidationError') {
            return NextResponse.json({
                error: "Invalid data format",
                details: error.message
            }, { status: 400 });
        }

        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            return NextResponse.json({
                error: "Database error",
                details: error.message
            }, { status: 500 });
        }

        // Check for JSON parsing errors
        if (error.name === 'SyntaxError') {
            return NextResponse.json({
                error: "Invalid JSON format"
            }, { status: 400 });
        }

        return NextResponse.json({
            error: "Failed to add anime",
            details: error.message
        }, { status: 500 });
    }
};

export const GET = async (request) => {
    try {
        console.log("GET request received");

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        console.log("UserId from params:", userId);

        if (!userId) {
            return NextResponse.json({
                error: "Missing userId parameter"
            }, { status: 400 });
        }

        if (typeof userId !== 'string' || userId.trim() === '') {
            return NextResponse.json({
                error: "Invalid userId format"
            }, { status: 400 });
        }

        console.log("Connecting to MongoDB...");
        await connectMongoDB();

        console.log("Fetching anime list for user:", userId);
        const animeList = await FavoriteList.find({ userId }).sort({ createdAt: -1 });

        console.log("Fetched anime list:", animeList.length, "items");
        return NextResponse.json({
            message: "Favorite list fetched successfully",
            count: animeList.length,
            animeList
        }, { status: 200 });

    } catch (error) {
        console.error("Detailed error in GET /api/favorite-list:", error);
        console.error("Error stack:", error.stack);

        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            return NextResponse.json({
                error: "Database error",
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json({
            error: "Failed to fetch anime list",
            details: error.message
        }, { status: 500 });
    }
};

export const DELETE = async (request) => {
    try {
        console.log("DELETE request received");

        const { searchParams } = new URL(request.url);
        const animeId = searchParams.get("animeId");
        const userId = searchParams.get("userId");

        console.log("Delete params:", { animeId, userId });

        if (!animeId || !userId) {
            return NextResponse.json({
                error: "Missing required parameters",
                required: ["animeId", "userId"]
            }, { status: 400 });
        }

        if (typeof animeId !== 'string' || typeof userId !== 'string' ||
            animeId.trim() === '' || userId.trim() === '') {
            return NextResponse.json({
                error: "Invalid parameter format"
            }, { status: 400 });
        }

        console.log("Connecting to MongoDB...");
        await connectMongoDB();

        console.log("Deleting anime from favorites...");
        const deletedAnime = await FavoriteList.findOneAndDelete({ animeId, userId });

        if (!deletedAnime) {
            console.log("Anime not found in favorites");
            return NextResponse.json({
                error: "Anime not found in favorite list"
            }, { status: 404 });
        }

        console.log("Anime deleted successfully:", deletedAnime);
        return NextResponse.json({
            message: "Anime removed successfully from favorite list",
            anime: deletedAnime
        }, { status: 200 });

    } catch (error) {
        console.error("Detailed error in DELETE /api/favorite-list:", error);
        console.error("Error stack:", error.stack);

        if (error.name === 'MongoError' || error.name === 'MongoServerError') {
            return NextResponse.json({
                error: "Database error",
                details: error.message
            }, { status: 500 });
        }

        return NextResponse.json({
            error: "Failed to remove anime from favorite list",
            details: error.message
        }, { status: 500 });
    }
};