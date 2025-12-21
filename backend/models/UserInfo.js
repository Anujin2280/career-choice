import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Counter from "./Counter.js";

const userInfoSchema = new mongoose.Schema(
  {
    ovog: { type: String, required: true, trim: true },
    ner: { type: String, required: true, trim: true },
    mail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"],
    },
    utas: { type: String, required: true, trim: true },
    nuuts_ug: { type: String, required: true, minlength: 8, select: false },
    user_id: { type: Number, required: true, unique: true, index: true },
    avatar_url: { type: String, default: "" },
    role_id: { type: Number, required: true, enum: [0, 1], default: 0 },
  },
  {
    timestamps: { createdAt: "uusgesen_ognoo", updatedAt: false },
  }
);

userInfoSchema.pre("validate", async function () {
  if (this.user_id !== undefined && this.user_id !== null) return;
  const counter = await Counter.findOneAndUpdate(
    { name: "user_id" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  this.user_id = counter.seq;
});

userInfoSchema.pre("save", async function () {
  if (!this.isModified("nuuts_ug")) return;
  const salt = await bcrypt.genSalt(10);
  this.nuuts_ug = await bcrypt.hash(this.nuuts_ug, salt);
});

userInfoSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.nuuts_ug);
};

export default mongoose.model("UserInfo", userInfoSchema, "user_info");
