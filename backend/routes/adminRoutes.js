import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getSummary,
  listUsers,
  updateUser,
  deleteUser,
  listProfessions,
  createProfession,
  updateProfession,
  deleteProfession,
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/summary", getSummary);

router.get("/users", listUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.get("/professions", listProfessions);
router.post("/professions", createProfession);
router.put("/professions/:id", updateProfession);
router.delete("/professions/:id", deleteProfession);

router.get("/questions", listQuestions);
router.post("/questions", createQuestion);
router.put("/questions/:id", updateQuestion);
router.delete("/questions/:id", deleteQuestion);

export default router;
