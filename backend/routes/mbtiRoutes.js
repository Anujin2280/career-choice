import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMbtiQuestions,
  listMbtiTypes,
  getMbtiTypeByCode,
  submitMbtiTest,
  getMbtiHistory,
} from "../controllers/mbtiController.js";

const router = express.Router();

router.get("/questions", getMbtiQuestions);
router.get("/types", listMbtiTypes);
router.get("/types/:type", getMbtiTypeByCode);
router.post("/submit", protect, submitMbtiTest);
router.get("/history", protect, getMbtiHistory);

export default router;
