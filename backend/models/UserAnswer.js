import mongoose from "mongoose";

const userAnswerSchema = new mongoose.Schema(
  {
    testResult: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestResult",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TestQuestion",
      required: true,
    },
    riasecCode: {
      type: String,
      enum: ["R", "I", "A", "S", "E", "C"],
      required: true,
    },
    score: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: false }
);

userAnswerSchema.index({ testResult: 1, question: 1 }, { unique: true });

export default mongoose.model("UserAnswer", userAnswerSchema);
