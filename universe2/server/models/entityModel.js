import mongoose from "mongoose";

const entitySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    system: {
      type: String,
      required: true,
    },

    galaxy: {
      type: String,
      required: true,
    },
  },
  //{
  //  timestamps: true,
  //}
);

export default mongoose.model("Entity", entitySchema);
