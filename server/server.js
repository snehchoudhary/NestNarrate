import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import searchRoutes from "./routes/searchRoutes.js";
import hotelRoutes from "./routes/hotelRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js"
import authRoutes from "./routes/authRoutes.js";
import {protect} from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/search", searchRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/api/protected", protect, (req, res) => {
  res.json({
    msg: "You are authorized",
    user: req.user
  });
});

app.get("/", (req, res) => {
    res.send("API running...");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
})
.catch(err => console.log(err));