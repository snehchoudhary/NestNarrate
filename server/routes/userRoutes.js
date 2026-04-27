import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add to wishlist
router.post("/wishlist/:hotelId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // prevent duplicates (important)
    if (!user.wishlist.includes(req.params.hotelId)) {
      user.wishlist.push(req.params.hotelId);
      await user.save();
    }

    res.json({ msg: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get wishlist (for dashboard later)
router.get("/wishlist", protect, async (req, res) => {
  const user = await User.findById(req.user.id).populate("wishlist");
  res.json(user.wishlist);
});

export default router;