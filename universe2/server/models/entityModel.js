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
  },
  //{
  //  timestamps: true,
  //}
);

export default mongoose.model("Entity", entitySchema);
