import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

router.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await client.responses.create({
      model: "openai/gpt-oss-20b",
      input: prompt,
    });

    res.json({ output: response.output_text });
  } catch (err) {
    console.error("LLM Error:", err);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

export default router;
