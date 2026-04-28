import express from "express";
import axios from "axios";
import Review from "../models/Review.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { hotelId, rating, text } = req.body;

    // Validation
    if (!hotelId || !rating || !text?.trim()) {
      return res.status(400).json({
        msg: "Hotel ID, rating, and review text are required",
      });
    }

    // Generate embedding using deployed AI service
    const embedRes = await axios.post(
      `${process.env.PYTHON_API_URL}/embed`,
      {
        text: text.trim(),
      }
    );

    const embedding = embedRes.data.embedding;

    // Save review
    const newReview = new Review({
      hotelId,
      userId: req.user.id,
      reviewname: req.user.name || "Anonymous",
      rating: Number(rating),
      text: text.trim(),
      embeddings: embedding,
      reviewDate: new Date(),
    });

    await newReview.save();

    // Populate user details
    const populatedReview = await Review.findById(newReview._id)
      .populate("userId", "name email");

    res.status(201).json(populatedReview);
  } catch (err) {
    console.error(
      "Review Creation Error:",
      err.response?.data || err.message
    );

    res.status(500).json({
      msg: "Failed to create review",
      error: err.response?.data || err.message,
    });
  }
});

export default router;
