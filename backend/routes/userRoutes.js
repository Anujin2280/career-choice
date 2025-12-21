import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  getMe,
  updateProfile,
  updateAvatar,
  getSavedProfessions,
  saveProfession,
  removeSavedProfession,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.put("/me/avatar", protect, upload.single("avatar"), updateAvatar);
router.put("/update", protect, updateProfile);
router.get("/me/saved", protect, getSavedProfessions);
router.post("/me/saved", protect, saveProfession);
router.delete("/me/saved/:id", protect, removeSavedProfession);

export default router;
