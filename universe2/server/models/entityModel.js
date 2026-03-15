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
      default: null,
    },
    systemKey: {
      type: String,
      default: null,
    },
    galaxyKey: {
      type: String,
      default: null,
    },
    size: {
      type: Number,
      required: true,
    },
    axialTilt: {
      type: Number,
      required: true,
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
