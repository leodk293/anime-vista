import mongoose, { Schema, models } from "mongoose";

const favoriteListSchema = new Schema(
    {
        animeId: {
            type: String,
            required: true
        },
        animeTitle: {
            type: String,
            required: true
        },
        animePoster: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },


    },
    { timestamps: true }
);

const FavoriteList = models.favoriteList || mongoose.model("FavoriteList", favoriteListSchema);

export default FavoriteList;