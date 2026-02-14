import "dotenv/config";
import mongoose from "mongoose";
import Entity from "./models/entityModel.js";

const MONGO_URI = process.env.MONGO_URI;

const entities = [
  { 
    key: "sun", 
    name: "Sun", 
    type: "star", 
    parentKey: "smbh", 
    systemKey: "solarsystem", 
    galaxyKey: "milkyway" 
  },
  { 
    key: "earth", 
    name: "Earth", 
    type: "planet", 
    parentKey: "sun", 
    systemKey: "solarsystem", 
    galaxyKey: "milkyway" 
  },
  { 
    key: "moon", 
    name: "Moon", 
    type: "planet", 
    parentKey: "earth", 
    systemKey: "solarsystem", 
    galaxyKey: "milkyway" 
  },
  { 
    key: "saturn", 
    name: "Saturn", 
    type: "planet", 
    parentKey: "sun", 
    systemKey: "solarsystem", 
    galaxyKey: "milkyway" 
  },
];

async function seed() 
{
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    // Clear existing data (optional)
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
