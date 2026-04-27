import express from "express";
import axios from "axios";
import Review from "../models/Review.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

const router = express.Router();

async function performSearch(query, res) {
    try {
        //1. get query embedding from python
        const embedRes = await axios.post("http://localhost:5001/embed", {
            text: query
        });

        console.log("Embed API response:", embedRes.data);

        const queryVector = embedRes.data.embedding;

        //debug1:
        console.log("Query Vector Length:", queryVector?.length);

        //2. get all reviews
        const reviews = await Review.find();

        console.log("Total reviews:", reviews.length);
        //debug2: check missing embeddings
        reviews.forEach(r => {
            console.log(
                "Review ID:",
                r._id,
                "Embedding length:",
                r.embeddings?.length
            );
        });

        //3. compute similarity
        const scored = reviews
            .filter(r =>
                r.embeddings &&
                queryVector &&
                r.embeddings.length === queryVector.length
            )
            .map(r => ({
                ...r.toObject(),
                score: cosineSimilarity(
                    queryVector,
                    r.embeddings
                )
            }));

        //4. sort
        scored.sort((a,b) => b.score - a.score);

        //5. return top5
        res.json(scored.slice(0, 5));
    } catch (err) {
        console.error("FULL ERROR:",err);
        res.status(500).json({ error: err.message });
    }
}

router.post("/", async (req,res) => {
    const { query } = req.body;
    await performSearch(query, res);
});

router.get("/", async (req,res) => {
    const query = req.query.query;
    await performSearch(query, res);
});

export default router;