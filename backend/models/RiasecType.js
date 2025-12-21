import mongoose from "mongoose";

const riasecTypeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      uppercase: true,
      enum: ["R", "I", "A", "S", "E", "C"],
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
  },
  { timestamps: false }
);

export default mongoose.model("RiasecType", riasecTypeSchema);
