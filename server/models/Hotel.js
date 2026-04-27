import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    name: String,
    city: String,
    country: String,
    starRating: Number,
    images: [String],
    aspectScores: {
        wifi: Number,
        cleanliness: Number,
        staff: Number,
        location: Number,
        noise: Number,
        value: Number
    },
    totalReviews: Number,
    overallSentiment: Number,
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model("Hotel", hotelSchema);