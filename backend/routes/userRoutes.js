import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// 🧩 Хэрэглэгчийн мэдээлэл авах
router.get("/me", protect, async (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

// 🧠 Хэрэглэгчийн мэдээлэл шинэчлэх
router.put("/update", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "Хэрэглэгч олдсонгүй" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Хэрвээ нууц үг ирсэн бол шинэчилнэ
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      message: "Мэдээлэл амжилттай шинэчлэгдлээ",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Мэдээлэл шинэчлэхэд алдаа гарлаа" });
  }
});

export default router;
