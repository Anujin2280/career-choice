import UserInfo from "../models/UserInfo.js";
import SavedProfession from "../models/SavedProfession.js";
import Profession from "../models/Profession.js";
import asyncHandler from "../middleware/asyncHandler.js";
import { isEmail, isNonEmptyString } from "../utils/validation.js";

const ROLE_LABELS = {
  0: "user",
  1: "admin",
};

const buildUserResponse = (user) => ({
  _id: user._id,
  user_id: user.user_id,
  ovog: user.ovog,
  ner: user.ner,
  mail: user.mail,
  utas: user.utas,
  avatar_url: user.avatar_url || "",
  role_id: user.role_id,
  role_type: ROLE_LABELS[user.role_id] || "user",
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(buildUserResponse(req.user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await UserInfo.findById(req.user._id).select("+nuuts_ug");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { ovog, ner, mail, utas, nuuts_ug } = req.body;

  if (ovog !== undefined) {
    if (!isNonEmptyString(ovog)) {
      res.status(400);
      throw new Error("Last name must be a non-empty string");
    }
    user.ovog = ovog.trim();
  }

  if (ner !== undefined) {
    if (!isNonEmptyString(ner)) {
      res.status(400);
      throw new Error("First name must be a non-empty string");
    }
    user.ner = ner.trim();
  }

  if (mail !== undefined) {
    if (!isNonEmptyString(mail) || !isEmail(mail)) {
      res.status(400);
      throw new Error("Invalid email");
    }
    const normalizedMail = mail.trim().toLowerCase();
    const existing = await UserInfo.findOne({
      mail: normalizedMail,
      _id: { $ne: user._id },
    });
    if (existing) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.mail = normalizedMail;
  }

  if (utas !== undefined) {
    if (!isNonEmptyString(utas)) {
      res.status(400);
      throw new Error("Phone must be a non-empty string");
    }
    user.utas = utas.trim();
  }

  if (nuuts_ug !== undefined) {
    if (!isNonEmptyString(nuuts_ug) || nuuts_ug.length < 8) {
      res.status(400);
      throw new Error("Password must be at least 8 characters");
    }
    user.nuuts_ug = nuuts_ug;
  }

  const updated = await user.save();
  res.json(buildUserResponse(updated));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("Avatar file is required");
  }

  const user = await UserInfo.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.avatar_url = `/uploads/${req.file.filename}`;
  const updated = await user.save();
  res.json(buildUserResponse(updated));
});

export const getSavedProfessions = asyncHandler(async (req, res) => {
  const saved = await SavedProfession.find({ user: req.user._id })
    .sort({ hadgalsan_ognoo: -1 })
    .populate("profession");
  res.json(saved);
});

export const saveProfession = asyncHandler(async (req, res) => {
  const { professionId } = req.body;
  if (!professionId) {
    res.status(400);
    throw new Error("Profession id is required");
  }

  const profession = await Profession.findById(professionId);
  if (!profession) {
    res.status(404);
    throw new Error("Profession not found");
  }

  const saved = await SavedProfession.findOneAndUpdate(
    { user: req.user._id, profession: professionId },
    { $setOnInsert: { user: req.user._id, profession: professionId } },
    { new: true, upsert: true }
  ).populate("profession");

  res.status(201).json(saved);
});

export const removeSavedProfession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const saved = await SavedProfession.findOne({
    _id: id,
    user: req.user._id,
  });
  if (!saved) {
    res.status(404);
    throw new Error("Saved item not found");
  }
  await saved.deleteOne();
  res.json({ message: "Saved profession deleted" });
});
