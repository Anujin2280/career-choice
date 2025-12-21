import mongoose from "mongoose";
import Profession from "../models/Profession.js";
import asyncHandler from "../middleware/asyncHandler.js";
import escapeRegex from "../utils/escapeRegex.js";

export const searchProfessions = asyncHandler(async (req, res) => {
  const query = String(req.query.q || "").trim();

  if (query.length < 2) {
    return res.json([]);
  }

  if (query.length > 64) {
    res.status(400);
    throw new Error("Query too long");
  }

  const regex = new RegExp(escapeRegex(query), "i");
  const professions = await Profession.find({ name: regex })
    .limit(10)
    .select("name category");

  res.json(professions);
});

export const getRelatedProfessions = asyncHandler(async (req, res) => {
  const name = String(req.params.name || "").trim();
  if (!name) {
    res.status(400);
    throw new Error("Name is required");
  }

  const profession = await Profession.findOne({ name });
  if (!profession) {
    res.status(404);
    throw new Error("Profession not found");
  }

  const related = await Profession.find({
    category: profession.category,
    name: { $ne: profession.name },
  })
    .limit(12)
    .select("name category");

  res.json({ main: profession, related });
});

export const getAllProfessions = asyncHandler(async (req, res) => {
  const professions = await Profession.find()
    .sort({ name: 1 })
    .select(
      "name category description descriptionShort descriptionLong salary demand opportunities skills riasecCode riasecTypes"
    );

  res.json(professions);
});

export const getProfessionById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid id");
  }

  const profession = await Profession.findById(id)
    .populate("categoryRef", "name")
    .populate("riasecRef", "code name");
  if (!profession) {
    res.status(404);
    throw new Error("Profession not found");
  }

  res.json(profession);
});
