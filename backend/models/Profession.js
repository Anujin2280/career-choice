import mongoose from "mongoose";

const professionSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  categoryRef: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  description: { type: String, default: "" },
  descriptionShort: { type: String, default: "" },
  descriptionLong: { type: String, default: "" },
  opportunities: { type: String, default: "" },
  salary: { type: String, default: "" },
  demand: { type: String, default: "" },
  duties: { type: String, default: "" },
  requirements: { type: String, default: "" },
  workEnvironment: { type: String, default: "" },
  skills: [{ type: String, trim: true }],
  riasecCode: { type: String, enum: ["R", "I", "A", "S", "E", "C"] },
  riasecTypes: [{ type: String, enum: ["R", "I", "A", "S", "E", "C"] }],
  riasecRef: { type: mongoose.Schema.Types.ObjectId, ref: "RiasecType" },
});

professionSchema.index({ name: 1, category: 1 });

export default mongoose.model("Profession", professionSchema);
