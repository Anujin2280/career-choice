import mongoose from "mongoose";

const breakdownSchema = new mongoose.Schema(
  {
    dimension: { type: String, required: true, trim: true },
    left: { type: String, required: true, trim: true },
    right: { type: String, required: true, trim: true },
    leftCount: { type: Number, default: 0 },
    rightCount: { type: Number, default: 0 },
    leftPct: { type: Number, default: 0 },
    rightPct: { type: Number, default: 0 },
  },
  { _id: false }
);

const mbtiResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "UserInfo", required: true },
    type: { type: String, required: true, trim: true, uppercase: true },
    typeName: { type: String, trim: true, default: "" },
    breakdown: { type: [breakdownSchema], default: [] },
  },
  {
    timestamps: { createdAt: "ognoo", updatedAt: false },
    versionKey: false,
  }
);

mbtiResultSchema.index({ user: 1, ognoo: -1 });

export default mongoose.model("MbtiResult", mbtiResultSchema);
