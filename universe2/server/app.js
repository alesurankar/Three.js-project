/**
 * Main Express Application Configuration
 * This file sets up the core Express server with middleware, routes, and deployment settings
 */

import express from "express";
import cors from "cors";

import objectRoutes from "./routes/objectRoutes.js";

const app = express();

// CORS setup
app.use(cors({
    origin: "http://localhost:3000", // your frontend URL
    credentials: true,               // allow cookies to be sent
}));

// JSON middleware
app.use(express.json());

// API Routes
app.use("/api/v1/objects", objectRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

export default app;
