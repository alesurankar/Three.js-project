import express from "express";
import cors from "cors";
import { json } from "express";

// Import routes
import universeRoutes from "./routes/universe.route.js";

const app = express();

// Middleware
app.use(cors({ origin: "*" })); // allow all origins for now
app.use(json());

// API Routes
app.use("/api/universe", universeRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now() });
});

export default app;
