import express from "express";
import Profession from "../models/Profession.js";
const router = express.Router();

// 1️⃣ Хайлтын автокомплит
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.json([]);

    const professions = await Profession.find({
      name: { $regex: query, $options: "i" },
    })
      .limit(10)
      .select("name category");

    res.json(professions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Хайлтын алдаа гарлаа" });
  }
});

// 2️⃣ Сонгосон мэргэжлийн салбарын бусад мэргэжил
router.get("/related/:name", async (req, res) => {
  try {
    const profession = await Profession.findOne({ name: req.params.name });
    if (!profession) return res.status(404).json({ message: "Мэргэжил олдсонгүй" });

    const related = await Profession.find({
      category: profession.category,
      name: { $ne: profession.name },
    })
      .limit(12)
      .select("name category");

    res.json({ main: profession, related });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Салбарын мэдээлэл татахад алдаа гарлаа" });
  }
});

router.get("/:id", async (req, res) => {
    try {
      const profession = await Profession.findById(req.params.id);
      if (!profession) return res.status(404).json({ message: "Мэргэжил олдсонгүй" });
      res.json(profession);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Мэргэжлийн мэдээлэл татахад алдаа гарлаа" });
    }
  });

export default router;
