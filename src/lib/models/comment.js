import mongoose, { Schema, models } from "mongoose";

const commentSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        userName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        animeId: {
            type: String,
            required: true,
        },
        animeName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const Comment = models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
