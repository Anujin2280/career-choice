import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("🧭 Auth routes initializing...");

// ❗ Энд protect байх ёсгүй
router.post("/register", registerUser);
router.post("/login", loginUser);

// ❗ Зөвхөн profile route-д protect хэрэглэнэ
router.get("/profile", protect, getUserProfile);

export default router;
