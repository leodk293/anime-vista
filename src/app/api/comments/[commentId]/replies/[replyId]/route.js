import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db/connectMongoDb";
import Comment from "@/lib/models/comment";
import mongoose from "mongoose";

export const PATCH = async (request, { params }) => {
    try {
        const { commentId, replyId } = await params;
        const body = await request.json();
        const { userId, reply: newReplyText } = body;

        if (!commentId || !replyId || !userId || newReplyText === undefined) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    required: ["commentId", "replyId", "userId", "reply"],
                },
                { status: 400 },
            );
        }

        if (
            !mongoose.Types.ObjectId.isValid(commentId) ||
            !mongoose.Types.ObjectId.isValid(replyId) ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return NextResponse.json(
                { error: "Invalid commentId, replyId or userId format" },
                { status: 400 },
            );
        }

        if (typeof newReplyText !== "string") {
            return NextResponse.json(
                { error: "Invalid data types", details: { reply: "must be string" } },
                { status: 400 },
            );
        }

        const trimmedReply = newReplyText.trim();
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

        const subdoc = comment.replies.id(replyId);
        if (!subdoc) {
            return NextResponse.json({ error: "Reply not found" }, { status: 404 });
        }

        if (subdoc.userId.toString() !== userId) {
            return NextResponse.json(
                { error: "You can only update your own reply" },
                { status: 403 },
            );
        }

        subdoc.reply = trimmedReply;
        await comment.save();

        return NextResponse.json(
            { message: "Reply updated", reply: subdoc },
            { status: 200 },
        );
    } catch (error) {
        console.error("Replies PATCH error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to update reply" },
            { status: 500 },
        );
    }
};

export const DELETE = async (request, { params }) => {
    try {
        const { commentId, replyId } = await params;
        const body = await request.json();
        const { userId } = body;

        if (!commentId || !replyId || !userId) {
            return NextResponse.json(
                {
                    error: "Missing required fields",
                    required: ["commentId", "replyId", "userId"],
                },
                { status: 400 },
            );
        }

        if (
            !mongoose.Types.ObjectId.isValid(commentId) ||
            !mongoose.Types.ObjectId.isValid(replyId) ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return NextResponse.json(
                { error: "Invalid commentId, replyId or userId format" },
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

        const subdoc = comment.replies.id(replyId);
        if (!subdoc) {
            return NextResponse.json({ error: "Reply not found" }, { status: 404 });
        }

        if (subdoc.userId.toString() !== userId) {
            return NextResponse.json(
                { error: "You can only delete your own reply" },
                { status: 403 },
            );
        }

        subdoc.deleteOne();
        await comment.save();

        return NextResponse.json({ message: "Reply deleted" }, { status: 200 });
    } catch (error) {
        console.error("Replies DELETE error:", error.message);
        return NextResponse.json(
            { error: error.message || "Failed to delete reply" },
            { status: 500 },
        );
    }
};

