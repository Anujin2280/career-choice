import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB холбогдлоо");

    const existingAdmin = await User.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Админ аль хэдийн бүртгэлтэй байна");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin1234", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("🎉 Админ үүссэн:");
    console.log(admin);
    process.exit();
  } catch (error) {
    console.error("❌ Алдаа:", error);
    process.exit(1);
  }
};

seedAdmin();
