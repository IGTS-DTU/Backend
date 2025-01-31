import express from 'express';
import { getFinalData, uploadFinalData } from './firebase.js';
import { z } from 'zod';

const router = express.Router();

const schema = z.object({
    Pool: z.number().min(1).max(10)
});

// Function to normalize scores
const normalizeScores = (scores) => {
    if (!scores || scores.length === 0) return [];

    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);
    if (minScore === maxScore) {
        return scores.map(() => 100); // If all scores are the same, everyone gets 100
    }
    
    return scores.map(score => ((score - minScore) / (maxScore - minScore)) * 100);
};

router.get('/', async (req, res) => {
    const schemaResult = schema.safeParse(req.body);
    if (!schemaResult.success) {
        return res.status(400).json({
            message: "Invalid Pool number",
        });
    }

    const { Pool } = schemaResult.data;

    try {
        // Fetch final scores
        let dinersScores = await getFinalData('diners', Pool);
        let ubaScores = await getFinalData('uba', Pool);
        if (!dinersScores || !ubaScores) {
            return res.status(404).json({ message: "Final scores not found for given pool." });
        }

        // Normalize the scores
        let dinersNormalized = normalizeScores(dinersScores);
        let ubaNormalized = normalizeScores(ubaScores);
        const finalScores = dinersNormalized.map((score, index) => {
            const avg = (score + ubaNormalized[index]) / 2;
            return avg;
        });
        console.log(dinersNormalized);
        console.log(ubaNormalized);

        return res.json({ finalScores });
    } catch (error) {
        console.error("Error processing final scores:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.put('/', async (req, res) => {
    const schemaResult = schema.safeParse(req.body);
    if (!schemaResult.success) {
        return res.status(400).json({
            message: "Invalid Pool number",
        });
    }

    const { Pool } = schemaResult.data;

    try {
        // Fetch final scores
        let dinersScores = await getFinalData('diners', Pool);
        let ubaScores = await getFinalData('uba', Pool);
        if (!dinersScores || !ubaScores) {
            return res.status(404).json({ message: "Final scores not found for given pool." });
        }

        // Normalize the scores
        let dinersNormalized = normalizeScores(dinersScores);
        let ubaNormalized = normalizeScores(ubaScores);
        const finalScores = dinersNormalized.map((score, index) => {
            const avg = (score + ubaNormalized[index]) / 2;
            return avg;
        });
        console.log(dinersNormalized);
        console.log(ubaNormalized);
        uploadFinalData(Pool,finalScores);
        return res.json({ message : "Final scores uploaded successfully" });
    } catch (error) {
        console.error("Error processing final scores:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
