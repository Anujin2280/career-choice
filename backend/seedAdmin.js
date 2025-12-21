import mongoose from "mongoose";
import dotenv from "dotenv";
import UserInfo from "./models/UserInfo.js";
import Role from "./models/Role.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const roles = [
      { role_id: 0, type: "user" },
      { role_id: 1, type: "admin" },
    ];

    for (const role of roles) {
      await Role.updateOne({ role_id: role.role_id }, role, { upsert: true });
    }

    const adminMail = (process.env.ADMIN_EMAIL || "admin@example.com")
      .trim()
      .toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin1234";
    const adminExists = await UserInfo.findOne({ mail: adminMail });

    if (adminExists) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = await UserInfo.create({
      ovog: "Admin",
      ner: "User",
      mail: adminMail,
      utas: "00000000",
      nuuts_ug: adminPassword,
      role_id: 1,
    });

    console.log("Admin created:", admin.mail);
    process.exit();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();
