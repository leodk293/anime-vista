import { NextResponse } from "next/server";
import AnimeList from "@/lib/models/animeList";
import { connectMongoDB } from "@/lib/db/connectMongoDb";

export const GET = async (request) => {
    try {
        const url = new URL(request.url);
        const season = url.searchParams.get("season");
        const genre = url.searchParams.get("genre");
        const year = url.searchParams.get("year");
        const search = url.searchParams.get("search");

        await connectMongoDB();

        // Build filter object based on provided parameters
        const filter = {};
        if (season) filter.season = season;
        if (genre) filter["genres.name"] = genre;
        if (year) filter.year = year;
        if (search) filter.animeName = { $regex: search, $options: "i" };

        // If no filters are provided, return all anime
        const animeList = await AnimeList.find(filter);

        return NextResponse.json({ animeList });
    } catch (error) {
        console.error("Error fetching anime list:", error);
        return NextResponse.json({ error: "Failed to fetch anime list" }, { status: 500 });
    }
};