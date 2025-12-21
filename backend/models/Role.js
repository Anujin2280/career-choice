import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  role_id: { type: Number, required: true, unique: true },
  type: { type: String, required: true, enum: ["user", "admin"] },
});

export default mongoose.model("Role", roleSchema, "role");
