import express from "express";
import Profession from "../models/Profession.js";

const router = express.Router();

// ... /api/test асуултууд route хэвээр үлдэнэ

// 🧩 Тестийн оноо дээр үндэслэн мэргэжил санал болгох
router.post("/suggest", async (req, res) => {
  try {
    const { topThree } = req.body; // ["I", "A", "S"]

    if (!topThree || !Array.isArray(topThree)) {
      return res.status(400).json({ message: "RIASEC өгөгдөл буруу байна" });
    }

    // Энэ төрлүүдтэй тохирох мэргэжлүүдийг хайна
    const professions = await Profession.find({
      riasecTypes: { $in: topThree },
    })
      .limit(15)
      .select("name category description");

    res.json({ topThree, professions });
  } catch (err) {
    console.error("❌ Suggest error:", err);
    res.status(500).json({ message: "Мэргэжил санал болгоход алдаа гарлаа" });
  }
});

export default router;
