import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  passwordHash: String,
  resetOTP: Number,
  otpExpires: Date,

  // ✅ role should be simple
  role: {
    type: String,
    default: "user"
  },

  // ✅ wishlist OUTSIDE alerts
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel"
    }
  ],

  recentSearches: [String],

  alerts: [
    {
      query: String,
      hotelId: mongoose.Schema.Types.ObjectId,
      threshold: Number
    }
  ],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);