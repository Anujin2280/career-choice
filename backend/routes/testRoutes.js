import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getTestQuestions,
  suggestProfessions,
  submitTest,
  getHistory,
} from "../controllers/testController.js";

const router = express.Router();

router.get("/", getTestQuestions);
router.post("/suggest", suggestProfessions);
router.post("/submit", protect, submitTest);
router.get("/history", protect, getHistory);

export default router;
