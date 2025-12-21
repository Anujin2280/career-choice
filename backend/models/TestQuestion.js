import mongoose from "mongoose";

const testQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ["R", "I", "A", "S", "E", "C"],
    required: true,
  },
  riasecRef: { type: mongoose.Schema.Types.ObjectId, ref: "RiasecType" },
});

export default mongoose.model("TestQuestion", testQuestionSchema);
