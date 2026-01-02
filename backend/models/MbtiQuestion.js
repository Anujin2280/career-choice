import mongoose from "mongoose";

const mbtiQuestionSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "MBTI" },
    categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    dimension: { type: String, required: true, trim: true },
    traitLeft: { type: String, trim: true },
    traitRight: { type: String, trim: true },
    prompt: { type: String, required: true, trim: true },
    descriptionShort: { type: String, trim: true, default: "" },
    descriptionLong: { type: String, trim: true, default: "" },
    options: { type: [mongoose.Schema.Types.Mixed], default: [] },
    tags: { type: [String], default: [] },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "mbty",
  }
);

export default mongoose.model("MbtiQuestion", mbtiQuestionSchema);
