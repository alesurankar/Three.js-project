import mongoose from "mongoose";

const objectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },
  },
  //{
  //  timestamps: true,
  //}
);

export default mongoose.model("Object", objectSchema);