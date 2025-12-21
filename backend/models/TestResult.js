import mongoose from "mongoose";

const scoreSchema = new mongoose.Schema(
  {
    R: { type: Number, default: 0 },
    I: { type: Number, default: 0 },
    A: { type: Number, default: 0 },
    S: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    C: { type: Number, default: 0 },
  },
  { _id: false }
);

const testResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", required: true },
    scores: { type: scoreSchema, default: () => ({}) },
    topThree: [{ type: String, enum: ["R", "I", "A", "S", "E", "C"] }],
    topType: { type: String, enum: ["R", "I", "A", "S", "E", "C"] },
  },
  {
    timestamps: { createdAt: "ognoo", updatedAt: false },
  }
);

testResultSchema.index({ user: 1, ognoo: -1 });

export default mongoose.model("TestResult", testResultSchema);
