import "dotenv/config";
import mongoose from "mongoose";
import { belts } from "./seed/belts.js";
import { blackholes } from "./seed/blackholes.js";
import { planets } from "./seed/planets.js";
import { probes } from "./seed/probes.js";
import { moons } from "./seed/moons.js";
import { rings } from "./seed/rings.js";
import { stars } from "./seed/stars.js";
import Entity from "./models/entityModel.js";

const MONGO_URI = process.env.MONGO_URI;

const entities = [
  ...belts,
  ...blackholes,
  ...planets,
  ...probes,
  ...moons,
  ...rings,
  ...stars,
];


async function seed() 
{
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    // Clear existing data
    await Entity.deleteMany({});
    console.log("🗑️  Cleared existing entities");

    // Insert seed data
    await Entity.insertMany(entities);
    console.log("🌱 Seed data inserted");

    process.exit(0);
  } 
  catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
