import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  try {
    const { hotelId, rating, text } = req.body;

    const review = await Review.create({
      hotelId,
      userId: req.user.id,
      rating,
      text,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name");

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};