import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined in .env");
}

export async function connectDatabase() {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log("✅ Mongoose connected");
    return conn;
  } catch (err) {
    console.error("❌ Mongoose connection error:", err);
    throw err;
  }
}
