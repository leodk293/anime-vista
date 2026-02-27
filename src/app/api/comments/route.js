import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDb";
import Comment from "@/lib/models/comment";
import mongoose from "mongoose";

export const GET = async (request) => {
    try {
        const { searchParams } = new URL(request.url);
        const animeId = searchParams.get("animeId");

        await connectMongoDB();

        const filter = animeId ? { animeId } : {};
        const comments = await Comment.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(
            { comments, total: comments.length },
            { status: 200 }
        );
    } catch (error) {
        console.error("Comments GET error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to fetch comments" },
            { status: 500 }
        );
    }
};

export const POST = async (request) => {
    try {
        const body = await request.json();
        const { userId, userName, avatar, comment, animeId, animeName } = body;

        // Validate required fields
        if (!userId || !userName || !avatar || !comment || !animeId || !animeName) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    required: ["userId", "userName", "avatar", "comment", "animeId", "animeName"],
                },
                { status: 400 }
            );
        }

        // Validate types
        if (
            typeof userId !== "string" ||
            typeof userName !== "string" ||
            typeof avatar !== "string" ||
            typeof comment !== "string" ||
            typeof animeId !== "string" ||
            typeof animeName !== "string"
        ) {
            return NextResponse.json(
                {
                    error: "Invalid data types",
                    details: {
                        userId: "must be string",
                        userName: "must be string",
                        avatar: "must be string",
                        comment: "must be string",
                        animeId: "must be string",
                        animeName: "must be string",
                    },
                },
                { status: 400 }
            );
        }

        // Validate userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid userId format" },
                { status: 400 }
            );
        }

        // Optional: trim and reject empty comment text
        const trimmedComment = comment.trim();
        if (!trimmedComment) {
            return NextResponse.json(
                { error: "Comment cannot be empty" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const newComment = await Comment.create({
            userId: new mongoose.Types.ObjectId(userId),
            userName: userName.trim(),
            avatar: avatar.trim(),
            comment: trimmedComment,
            animeId,
            animeName: animeName.trim(),
        });

        return NextResponse.json(
            { message: "Comment created", comment: newComment },
            { status: 201 }
        );
    } catch (error) {
        console.error("Comments POST error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to create comment" },
            { status: 500 }
        );
    }
};

export const PUT = async (request) => {
    try {
        const body = await request.json();
        const { commentId, userId, comment: newCommentText } = body;

        if (!commentId || !userId || newCommentText === undefined) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    required: ["commentId", "userId", "comment"],
                },
                { status: 400 }
            );
        }

        if (typeof newCommentText !== "string") {
            return NextResponse.json(
                { error: "Invalid data types", details: { comment: "must be string" } },
                { status: 400 }
            );
        }

        const trimmedComment = newCommentText.trim();
        if (!trimmedComment) {
            return NextResponse.json(
                { error: "Comment cannot be empty" },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid commentId or userId format" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.userId.toString() !== userId) {
            return NextResponse.json(
                { error: "You can only update your own comment" },
                { status: 403 }
            );
        }

        comment.comment = trimmedComment;
        const updatedComment = await comment.save();

        return NextResponse.json(
            { message: "Comment updated", comment: updatedComment },
            { status: 200 }
        );
    } catch (error) {
        console.error("Comments PUT error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to update comment" },
            { status: 500 }
        );
    }
};

export const DELETE = async (request) => {
    try {
        const body = await request.json();
        const { commentId, userId } = body;

        if (!commentId || !userId) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    required: ["commentId", "userId"],
                },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: "Invalid commentId or userId format" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return NextResponse.json(
                { error: "Comment not found" },
                { status: 404 }
            );
        }

        if (comment.userId.toString() !== userId) {
            return NextResponse.json(
                { error: "You can only delete your own comment" },
                { status: 403 }
            );
        }

        await Comment.findByIdAndDelete(commentId);

        return NextResponse.json(
            { message: "Comment deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Comments DELETE error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to delete comment" },
            { status: 500 }
        );
    }
};