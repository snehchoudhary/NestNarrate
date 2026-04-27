import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewname: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    sentences: [String],
    embeddings: [Number],
    sentiment: Number,
    aspectTags: [String],

    isFlagged: {
      type: Boolean,
      default: false,
    },

    reviewDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Review", reviewSchema);