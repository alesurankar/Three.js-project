import mongoose from "mongoose";

const entitySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    parentKey: {
      type: String,
    },
    systemKey: {
      type: String,
    },
    galaxyKey: {
      type: String,
    },
    size: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
    },
    axialTilt: {
      type: Number,
    },
    axialPeriod: {
      type: Number,
    },
    orbitalTilt: {
      type: Number,
    },
    orbitalPeriod: {
      type: Number,
    },
  },
);

export default mongoose.model("Entity", entitySchema);
