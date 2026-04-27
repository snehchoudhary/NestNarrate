import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Review from "../models/Review.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const reviews = [
    {
        hotelId: "69e863e29bb822a928e599be",
        text: "The WiFi was super fast and reliable",
        reviewerName: "Ankaksha",
        rating: 5
    },
    {
        hotelId: "69e863e29bb822a928e599be",
        text: "Rooms were dirty and noisy",
        reviewerName: "Rahul",
        rating: 2
    }
];

const seed = async () => {
    for (let r of reviews) {
        const res = await axios.post("http://localhost:5001/embed", {
            text: r.text
        });

        await Review.create({
            ...r,
            embeddings: res.data.embedding,
            sentiment: r.rating > 3 ? 1 : -1,
            reviewDate: new Date()
        });
    }

    console.log("Seeded!");
    process.exit();
};

seed();