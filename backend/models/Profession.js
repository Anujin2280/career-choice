import mongoose from "mongoose";

const professionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  skills: [String],
  riasecTypes: [String], // 🧩 Жишээ: ["R", "I", "C"]
});

export default mongoose.model("Profession", professionSchema);
