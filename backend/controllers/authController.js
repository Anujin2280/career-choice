import UserInfo from "../models/UserInfo.js";
import Role from "../models/Role.js";
import generateToken from "../utils/generateToken.js";
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

const buildAuthResponse = (user) => ({
  user: buildUserResponse(user),
  token: generateToken(user._id),
});

export const registerUser = asyncHandler(async (req, res) => {
  const { ovog, ner, mail, utas, nuuts_ug } = req.body;

  if (
    !isNonEmptyString(ovog) ||
    !isNonEmptyString(ner) ||
    !isNonEmptyString(mail) ||
    !isNonEmptyString(utas) ||
    !isNonEmptyString(nuuts_ug)
  ) {
    res.status(400);
    throw new Error("Last name, first name, email, phone, and password are required");
  }

  if (!isEmail(mail)) {
    res.status(400);
    throw new Error("Invalid email");
  }

  if (nuuts_ug.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const normalizedMail = mail.trim().toLowerCase();
  const userExists = await UserInfo.findOne({ mail: normalizedMail });
  if (userExists) {
    res.status(400);
    throw new Error("Email already in use");
  }

  let userRole = await Role.findOne({ role_id: 0 });
  if (!userRole) {
    userRole = await Role.create({ role_id: 0, type: "user" });
  }

  const user = await UserInfo.create({
    ovog: ovog.trim(),
    ner: ner.trim(),
    mail: normalizedMail,
    utas: utas.trim(),
    nuuts_ug,
    role_id: 0,
  });

  res.status(201).json(buildAuthResponse(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { mail, nuuts_ug } = req.body;

  if (!isNonEmptyString(mail) || !isNonEmptyString(nuuts_ug)) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const normalizedMail = mail.trim().toLowerCase();
  const user = await UserInfo.findOne({ mail: normalizedMail }).select(
    "+nuuts_ug"
  );

  if (!user || !user.nuuts_ug) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  if (!(await user.matchPassword(nuuts_ug))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json(buildAuthResponse(user));
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await UserInfo.findById(req.user._id).select("-nuuts_ug");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(buildUserResponse(user));
});
