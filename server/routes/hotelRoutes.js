import express from "express";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";

const router = express.Router();


// ✅ CREATE HOTEL
router.post("/", async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET ALL HOTELS

router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();

    const hotelsWithRatings = await Promise.all(
      hotels.map(async (hotel) => {
        const reviews = await Review.find({
          hotelId: hotel._id,
        });

        const averageRating =
          reviews.length > 0
            ? reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / reviews.length
            : 0;

        return {
          ...hotel.toObject(),
          averageRating,
        };
      })
    );

    res.json(hotelsWithRatings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// 🔥 COMPARE MULTIPLE HOTELS (IMPORTANT: ABOVE /:id)
router.get("/compare", async (req, res) => {
  try {
    const ids = req.query.ids?.split(",");

    if (!ids || ids.length < 2) {
      return res.status(400).json({ msg: "Provide at least 2 hotel IDs" });
    }

    const hotels = await Hotel.find({ _id: { $in: ids } });
    const reviews = await Review.find({ hotelId: { $in: ids } });

    const results = hotels.map((hotel) => {
      const hotelReviews = reviews.filter(
        (r) => r.hotelId.toString() === hotel._id.toString()
      );

      const aspects = {
        wifi: [],
        cleanliness: [],
        staff: [],
        location: [],
        noise: [],
        value: []
      };

      hotelReviews.forEach((r) => {
        const text = (r.text || "").toLowerCase();

        const sentiment =
          typeof r.sentiment === "number"
            ? r.sentiment
            : r.rating
            ? r.rating / 5
            : 0;

        if (text.includes("wifi") || text.includes("wi-fi") || text.includes("internet"))
          aspects.wifi.push(sentiment);

        if (text.includes("clean") || text.includes("dirty"))
          aspects.cleanliness.push(sentiment);

        if (text.includes("staff") || text.includes("service"))
          aspects.staff.push(sentiment);

        if (text.includes("location") || text.includes("area"))
          aspects.location.push(sentiment);

        if (text.includes("noise") || text.includes("loud") || text.includes("quiet"))
          aspects.noise.push(sentiment);

        if (text.includes("value") || text.includes("price"))
          aspects.value.push(sentiment);
      });

      const avg = (arr) =>
        arr.length
          ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
          : 0;

      return {
        _id: hotel._id,
        name: hotel.name,
        aspectScores: {
          WiFi: avg(aspects.wifi),
          Cleanliness: avg(aspects.cleanliness),
          Staff: avg(aspects.staff),
          Location: avg(aspects.location),
          Noise: avg(aspects.noise),
          Value: avg(aspects.value)
        }
      };
    });

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 GET SINGLE HOTEL WITH ASPECT SCORES
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);
    if (!hotel) return res.status(404).json({ msg: "Hotel not found" });

    const reviews = await Review.find({ hotelId: id });

    const aspects = {
      wifi: [],
      cleanliness: [],
      staff: [],
      location: [],
      noise: [],
      value: []
    };

    reviews.forEach((r) => {
      const text = (r.text || "").toLowerCase();

      const sentiment =
        typeof r.sentiment === "number"
          ? r.sentiment
          : r.rating
          ? r.rating / 5
          : 0;

      if (text.includes("wifi") || text.includes("wi-fi") || text.includes("internet"))
        aspects.wifi.push(sentiment);

      if (text.includes("clean") || text.includes("dirty"))
        aspects.cleanliness.push(sentiment);

      if (text.includes("staff") || text.includes("service"))
        aspects.staff.push(sentiment);

      if (text.includes("location") || text.includes("area"))
        aspects.location.push(sentiment);

      if (text.includes("noise") || text.includes("loud") || text.includes("quiet"))
        aspects.noise.push(sentiment);

      if (text.includes("value") || text.includes("price"))
        aspects.value.push(sentiment);
    });

    const avg = (arr) =>
      arr.length
        ? Number((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2))
        : 0;

    const aspectScores = {
      WiFi: avg(aspects.wifi),
      Cleanliness: avg(aspects.cleanliness),
      Staff: avg(aspects.staff),
      Location: avg(aspects.location),
      Noise: avg(aspects.noise),
      Value: avg(aspects.value)
    };

    res.json({
      hotel,
      reviews,
      aspectScores
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;