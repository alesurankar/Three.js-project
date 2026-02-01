import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
let cached = global.mongoose;

if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then((mongoose) => {
        console.log("Mongoose connected");
        return mongoose;
      })
      .catch((err) => {
        console.error("Mongoose connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
