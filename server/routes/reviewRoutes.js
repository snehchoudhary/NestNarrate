import express from "express";
import axios from "axios";
import Review from "../models/Review.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { hotelId, rating, text } = req.body;

    if (!hotelId || !rating || !text) {
      return res.status(400).json({
        msg: "Hotel ID, rating, and review text are required",
      });
    }

    // Generate embedding
    const embedRes = await axios.post(
      "http://localhost:5001/embed",
      { text }
    );

    const embedding = embedRes.data.embedding;

    const newReview = new Review({
      hotelId,
      userId: req.user.id,
      reviewname: req.user.name || "Anonymous",
      rating,
      text,
      embeddings: embedding,
      reviewDate: new Date(),
    });

    await newReview.save();

    const populatedReview = await Review.findById(newReview._id)
      .populate("userId", "name email");

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error("Review Creation Error:", err);
    res.status(500).json({
      msg: "Failed to create review",
      error: err.message,
    });
  }
});

export default router;