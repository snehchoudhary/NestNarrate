import mongoose from "mongoose";
import axios from "axios";
import dotenv from "dotenv";
import Review from "../models/Review.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const reviews = [
  {
    hotelId: "69e863e29bb822a928e599be",
    text: "The WiFi was super fast and reliable",
    reviewerName: "Ankaksha",
    rating: 5,
  },
  {
    hotelId: "69e863e29bb822a928e599be",
    text: "Rooms were dirty and noisy",
    reviewerName: "Rahul",
    rating: 2,
  },
];

const seedReviews = async () => {
  try {
    console.log("🌱 Starting review seeding...\n");

    for (const review of reviews) {
      console.log(`Processing: "${review.text}"`);

      const response = await axios.post(
        `${process.env.PYTHON_API_URL}/embed`,
        {
          text: review.text,
        }
      );

      await Review.create({
        ...review,
        embeddings: response.data.embedding,
        sentiment: review.rating >= 4 ? 1 : -1,
        reviewDate: new Date(),
      });

      console.log("✅ Review inserted successfully\n");
    }

    console.log("🎉 All reviews seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error(
      "❌ Error seeding reviews:",
      error.response?.data || error.message
    );
    process.exit(1);
  }
};

seedReviews();
