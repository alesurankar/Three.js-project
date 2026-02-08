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
      required: true,
    },

    systemKey: {
      type: String,
      required: true,
    },

    galaxyKey: {
      type: String,
      required: true,
    },
  },
  //{
  //  timestamps: true,
  //}
);

export default mongoose.model("Entity", entitySchema);
