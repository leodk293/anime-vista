import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDb";
import Chat from "@/lib/models/chats";
import User from "@/lib/models/users";

export const POST = async (request) => {
    try {
        const { userRequest, aiResponse, userId, userName } = await request.json();

        await connectMongoDB();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const chat = new Chat({
            userRequest,
            aiResponse,
            userId,
            userName,
        });

        await chat.save();

        return NextResponse.json({ message: "Chat saved successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error saving chat:", error);
        return NextResponse.json({ error: "Failed to save chat" }, { status: 500 });
    }
};

export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        await connectMongoDB();

        const chats = await Chat.find({ userId }).sort({ createdAt: 1 }); 

        return NextResponse.json({ chats });
    } catch (error) {
        console.error("Error fetching chats:", error);
        return NextResponse.json({ error: "Failed to fetch chats" }, { status: 500 });
    }
};

export const DELETE = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        await connectMongoDB();

        const result = await Chat.deleteMany({ userId });

        return NextResponse.json({
            message: "Chats deleted successfully",
            deletedCount: result.deletedCount
        }, { status: 200 });
    } catch (error) {
        console.error("Error deleting chats:", error);
        return NextResponse.json({ error: "Failed to delete chats" }, { status: 500 });
    }
};