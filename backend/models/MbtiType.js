import mongoose from "mongoose";

const mbtiTypeSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, trim: true, uppercase: true },
    name: { type: String, required: true, trim: true },
    descriptionShort: { type: String, trim: true, default: "" },
    descriptionLong: { type: String, trim: true, default: "" },
    strengths: { type: [String], default: [] },
    risks: { type: [String], default: [] },
    bestWorkEnvironment: { type: [String], default: [] },
    suggestedRoles: { type: [String], default: [] },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "mbtitypes",
  }
);

export default mongoose.model("MbtiType", mbtiTypeSchema);
