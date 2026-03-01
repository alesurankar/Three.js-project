import "dotenv/config";
import mongoose from "mongoose";
import EntityModel from "../models/entityModel.js";

import { belts } from "../seed/belts.js";
import { blackHoles } from "../seed/blackHoles.js";
import { gravityCenters } from "../seed/gravityCenters.js";
import { planets } from "../seed/planets.js";
import { probes } from "../seed/probes.js";
import { moons } from "../seed/moons.js";
import { rings } from "../seed/rings.js";
import { stars } from "../seed/stars.js";

const MONGO_URI = process.env.MONGO_URI;
const USE_LOCAL_DATA = process.env.USE_LOCAL_DATA === "true";

const localEntities = [
  ...belts,
  ...blackHoles,
  ...gravityCenters,
  ...planets,
  ...probes,
  ...moons,
  ...rings,
  ...stars,
];


// Function to connect to MongoDB
async function connectMongo() {
  if (!MONGO_URI) throw new Error("MONGO_URI not set!");
  if (mongoose.connection.readyState === 1) return; // Already connected
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");
}

// Main function to get entities
export async function getEntities() {
  if (USE_LOCAL_DATA) {
    console.log("📦 Using local seed data");
    return localEntities;
  }

  try {
    await connectMongo();
    const entities = await EntityModel.find().lean();
    
    // Fallback to local if DB is empty
    if (!entities || entities.length === 0) {
      console.warn("⚠️ MongoDB returned no entities");
      console.log("📦 Falling back to local seed");
      return localEntities;
    }

    console.log("🌍 Fetched entities from MongoDB");
    return entities;
  } 
  catch (err) {
    console.error("⚠️ Could not fetch from MongoDB, falling back to local seed:", err.message);
    return localEntities;
  }
}