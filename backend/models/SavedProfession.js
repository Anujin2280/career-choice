import mongoose from "mongoose";

const savedProfessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserInfo",
      required: true,
    },
    profession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profession",
      required: true,
    },
  },
  {
    timestamps: { createdAt: "hadgalsan_ognoo", updatedAt: false },
  }
);

savedProfessionSchema.index({ user: 1, profession: 1 }, { unique: true });

export default mongoose.model("SavedProfession", savedProfessionSchema);
