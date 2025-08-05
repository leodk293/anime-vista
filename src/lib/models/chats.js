import mongoose, { Schema, models } from "mongoose";

const chatSchema = new Schema(
    {
        userRequest: {
            type: String,
            required: true
        },
        aiResponse: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        userName: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

const Chat = models.Chat || mongoose.model("Chat", chatSchema);

export default Chat;