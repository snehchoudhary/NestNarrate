import express from "express";
import { register, login } from "../controllers/authController.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import User from "../models/User.js"; // ✅ FIX
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
});

// 🔐 SEND OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    user.resetOTP = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // ✅ EMAIL CONFIG (use env in real apps)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`
    });

    res.json({ msg: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error sending OTP" });
  }
});


// 🔁 RESET PASSWORD
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetOTP !== Number(otp) ||
      user.otpExpires < Date.now()
    ) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.otpExpires = null;

    await user.save();

    res.json({ msg: "Password reset successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error resetting password" });
  }
});


// 🔑 AUTH
router.post("/register", register);
router.post("/login", login);

export default router;