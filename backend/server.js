import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dataRoutes from "./routes/dataRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import llmRoute from "./routes/llmRoutes.js";

const app = express();

// ✅ Configure CORS properly for Render + Vercel + localhost
app.use(cors({
  origin: [
    "https://secure-cloud-agri.vercel.app", // your deployed frontend
    "http://localhost:5173"                 // local development
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(bodyParser.json());

// ✅ Handle preflight OPTIONS automatically
app.options("*", cors());

// ✅ Register all routes
app.use("/api/data", dataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/llm", llmRoute);

// ✅ Server listener
app.listen(5000, () => console.log("Backend running on port 5000"));
