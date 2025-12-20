import mongoose from "mongoose";

const testQuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: {
    type: String,
    enum: ["R", "I", "A", "S", "E", "C"], // Realistic, Investigative, Artistic, Social, Enterprising, Conventional
    required: true,
  },
});

export default mongoose.model("TestQuestion", testQuestionSchema);
