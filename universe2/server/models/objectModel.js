import mongoose from "mongoose";

const objectSchema = new mongoose.Schema(
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

    // type: {
    //   type: String,
    //   default: "object",
    // },
  },
  //{
  //  timestamps: true,
  //}
);

export default mongoose.model("Object", objectSchema);
