import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dataRoutes from "./routes/dataRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import llmRoute from "./routes/llmRoutes.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/data", dataRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/llm", llmRoute);

app.listen(5000, () => console.log("Backend running on port 5000"));
