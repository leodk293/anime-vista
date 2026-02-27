import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDb";
import Comment from "@/lib/models/comment";
import mongoose from "mongoose";

export const POST = async (request, { params }) => {
    try {
        const { commentId } = await params;
        const body = await request.json();
        const { userId, userName, avatar, reply } = body;

        if (!commentId || !userId || !userName || !avatar || reply === undefined) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    required: ["commentId", "userId", "userName", "avatar", "reply"],
                },
                { status: 400 },
            );
        }

        if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid commentId or userId format" },
                { status: 400 },
            );
        }

        if (
            typeof userName !== "string" ||
            typeof avatar !== "string" ||
            typeof reply !== "string"
        ) {
            return NextResponse.json(
                {
                    error: "Invalid data types",
                    details: {
                        userName: "must be string",
                        avatar: "must be string",
                        reply: "must be string",
                    },
                },
                { status: 400 },
            );
        }

        const trimmedReply = reply.trim();
        if (!trimmedReply) {
            return NextResponse.json(
                { error: "Reply cannot be empty" },
                { status: 400 },
            );
        }

        await connectMongoDB();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        }

        if (!Array.isArray(comment.replies)) {
            comment.replies = [];
        }

        comment.replies.push({
            userId: new mongoose.Types.ObjectId(userId),
            userName: userName.trim(),
            avatar: avatar.trim(),
            reply: trimmedReply,
        });

        await comment.save();

        const createdReply = comment.replies[comment.replies.length - 1];

        return NextResponse.json(
            { message: "Reply created", reply: createdReply },
            { status: 201 },
        );
    } catch (error) {
        console.error("Replies POST error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to create reply" },
            { status: 500 },
        );
    }
};

