import express from "express";
import {
  searchProfessions,
  getRelatedProfessions,
  getAllProfessions,
  getProfessionById,
} from "../controllers/professionController.js";

const router = express.Router();

router.get("/search", searchProfessions);
router.get("/related/:name", getRelatedProfessions);
router.get("/", getAllProfessions);
router.get("/:id", getProfessionById);

export default router;
