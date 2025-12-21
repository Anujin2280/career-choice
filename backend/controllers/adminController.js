import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import UserInfo from "../models/UserInfo.js";
import Profession from "../models/Profession.js";
import TestQuestion from "../models/TestQuestion.js";
import Category from "../models/Category.js";
import RiasecType from "../models/RiasecType.js";
import { isEmail, isNonEmptyString } from "../utils/validation.js";

const ALLOWED_TYPES = new Set(["R", "I", "A", "S", "E", "C"]);

const ensureCategory = async (name) => {
  const normalized = String(name || "").trim();
  if (!normalized) return null;
  const existing = await Category.findOne({ name: normalized });
  if (existing) return existing;
  return Category.create({ name: normalized });
};

const ensureRiasecType = async (code) => {
  const normalized = String(code || "").trim().toUpperCase();
  if (!ALLOWED_TYPES.has(normalized)) return null;
  const existing = await RiasecType.findOne({ code: normalized });
  if (existing) return existing;
  const names = {
    R: "Бодит",
    I: "Судлаач",
    A: "Урлагийн",
    S: "Нийгмийн",
    E: "Санаачлагч",
    C: "Дүрэмтэй",
  };
  return RiasecType.create({ code: normalized, name: names[normalized] || normalized });
};

export const getSummary = asyncHandler(async (req, res) => {
  const [users, professions, questions] = await Promise.all([
    UserInfo.countDocuments(),
    Profession.countDocuments(),
    TestQuestion.countDocuments(),
  ]);

  res.json({ users, professions, questions });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await UserInfo.find()
    .sort({ uusgesen_ognoo: -1 })
    .select("user_id ovog ner mail utas role_id avatar_url uusgesen_ognoo");
  res.json(users);
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid user id");
  }

  const user = await UserInfo.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { ovog, ner, mail, utas, role_id } = req.body;

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

  if (role_id !== undefined) {
    const parsedRole = Number(role_id);
    if (![0, 1].includes(parsedRole)) {
      res.status(400);
      throw new Error("Invalid role");
    }
    user.role_id = parsedRole;
  }

  const updated = await user.save();
  res.json({
    _id: updated._id,
    user_id: updated.user_id,
    ovog: updated.ovog,
    ner: updated.ner,
    mail: updated.mail,
    utas: updated.utas,
    role_id: updated.role_id,
    avatar_url: updated.avatar_url || "",
    uusgesen_ognoo: updated.uusgesen_ognoo,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid user id");
  }

  const user = await UserInfo.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.deleteOne();
  res.json({ message: "User deleted" });
});

export const listProfessions = asyncHandler(async (req, res) => {
  const professions = await Profession.find()
    .sort({ name: 1 })
    .populate("categoryRef", "name")
    .populate("riasecRef", "code name");
  res.json(professions);
});

export const createProfession = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    description,
    descriptionShort,
    descriptionLong,
    opportunities,
    salary,
    demand,
    duties,
    requirements,
    workEnvironment,
    skills,
    riasecCode,
    riasecTypes,
  } = req.body;

  if (!isNonEmptyString(name) || !isNonEmptyString(category)) {
    res.status(400);
    throw new Error("Name and category are required");
  }

  const normalizedCode = isNonEmptyString(riasecCode)
    ? String(riasecCode).trim().toUpperCase()
    : Array.isArray(riasecTypes)
    ? String(riasecTypes[0] || "").trim().toUpperCase()
    : "";

  const riasecTypeList = Array.isArray(riasecTypes)
    ? riasecTypes
        .map((t) => String(t).trim().toUpperCase())
        .filter((t) => ALLOWED_TYPES.has(t))
    : normalizedCode
    ? [normalizedCode]
    : [];

  if (normalizedCode && !ALLOWED_TYPES.has(normalizedCode)) {
    res.status(400);
    throw new Error("Invalid RIASEC code");
  }

  const categoryDoc = await ensureCategory(category);
  const riasecDoc = await ensureRiasecType(normalizedCode);

  const normalizedDescription = isNonEmptyString(description)
    ? description.trim()
    : "";
  const normalizedDescriptionLong = isNonEmptyString(descriptionLong)
    ? descriptionLong.trim()
    : normalizedDescription;

  const profession = await Profession.create({
    name: name.trim(),
    category: category.trim(),
    categoryRef: categoryDoc?._id,
    description: normalizedDescription,
    descriptionShort: isNonEmptyString(descriptionShort)
      ? descriptionShort.trim()
      : "",
    descriptionLong: normalizedDescriptionLong,
    opportunities: isNonEmptyString(opportunities) ? opportunities.trim() : "",
    salary: isNonEmptyString(salary) ? salary.trim() : "",
    demand: isNonEmptyString(demand) ? demand.trim() : "",
    duties: isNonEmptyString(duties) ? duties.trim() : "",
    requirements: isNonEmptyString(requirements) ? requirements.trim() : "",
    workEnvironment: isNonEmptyString(workEnvironment)
      ? workEnvironment.trim()
      : "",
    skills: Array.isArray(skills)
      ? skills.map((s) => String(s).trim()).filter(Boolean)
      : [],
    riasecCode: normalizedCode || undefined,
    riasecTypes: riasecTypeList,
    riasecRef: riasecDoc?._id,
  });

  res.status(201).json(profession);
});

export const updateProfession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid profession id");
  }

  const profession = await Profession.findById(id);
  if (!profession) {
    res.status(404);
    throw new Error("Profession not found");
  }

  const {
    name,
    category,
    description,
    descriptionShort,
    descriptionLong,
    opportunities,
    salary,
    demand,
    duties,
    requirements,
    workEnvironment,
    skills,
    riasecCode,
    riasecTypes,
  } = req.body;

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      res.status(400);
      throw new Error("Name must be a non-empty string");
    }
    profession.name = name.trim();
  }

  if (category !== undefined) {
    if (!isNonEmptyString(category)) {
      res.status(400);
      throw new Error("Category must be a non-empty string");
    }
    profession.category = category.trim();
    const categoryDoc = await ensureCategory(category);
    profession.categoryRef = categoryDoc?._id;
  }

  if (description !== undefined) {
    profession.description = isNonEmptyString(description) ? description.trim() : "";
  }

  if (descriptionShort !== undefined) {
    profession.descriptionShort = isNonEmptyString(descriptionShort)
      ? descriptionShort.trim()
      : "";
  }

  if (descriptionLong !== undefined) {
    profession.descriptionLong = isNonEmptyString(descriptionLong)
      ? descriptionLong.trim()
      : "";
  }

  if (opportunities !== undefined) {
    profession.opportunities = isNonEmptyString(opportunities)
      ? opportunities.trim()
      : "";
  }

  if (salary !== undefined) {
    profession.salary = isNonEmptyString(salary) ? salary.trim() : "";
  }

  if (demand !== undefined) {
    profession.demand = isNonEmptyString(demand) ? demand.trim() : "";
  }

  if (duties !== undefined) {
    profession.duties = isNonEmptyString(duties) ? duties.trim() : "";
  }

  if (requirements !== undefined) {
    profession.requirements = isNonEmptyString(requirements)
      ? requirements.trim()
      : "";
  }

  if (workEnvironment !== undefined) {
    profession.workEnvironment = isNonEmptyString(workEnvironment)
      ? workEnvironment.trim()
      : "";
  }

  if (skills !== undefined) {
    profession.skills = Array.isArray(skills)
      ? skills.map((s) => String(s).trim()).filter(Boolean)
      : [];
  }

  if (riasecTypes !== undefined) {
    profession.riasecTypes = Array.isArray(riasecTypes)
      ? riasecTypes
          .map((t) => String(t).trim().toUpperCase())
          .filter((t) => ALLOWED_TYPES.has(t))
      : [];
  }

  if (riasecCode !== undefined) {
    const normalized = String(riasecCode || "").trim().toUpperCase();
    if (normalized && !ALLOWED_TYPES.has(normalized)) {
      res.status(400);
      throw new Error("Invalid RIASEC code");
    }
    profession.riasecCode = normalized || undefined;
    if (normalized) {
      profession.riasecRef = (await ensureRiasecType(normalized))?._id;
      if (!profession.riasecTypes?.length) {
        profession.riasecTypes = [normalized];
      }
    }
  }

  const updated = await profession.save();
  res.json(updated);
});

export const deleteProfession = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid profession id");
  }

  const profession = await Profession.findById(id);
  if (!profession) {
    res.status(404);
    throw new Error("Profession not found");
  }

  await profession.deleteOne();
  res.json({ message: "Profession deleted" });
});

export const listQuestions = asyncHandler(async (req, res) => {
  const questions = await TestQuestion.find().sort({ _id: 1 });
  res.json(questions);
});

export const createQuestion = asyncHandler(async (req, res) => {
  const { text, category } = req.body;

  if (!isNonEmptyString(text)) {
    res.status(400);
    throw new Error("Question text is required");
  }

  const normalizedCategory = String(category || "").trim().toUpperCase();
  if (!ALLOWED_TYPES.has(normalizedCategory)) {
    res.status(400);
    throw new Error("Invalid category");
  }

  const riasecDoc = await ensureRiasecType(normalizedCategory);
  const question = await TestQuestion.create({
    text: text.trim(),
    category: normalizedCategory,
    riasecRef: riasecDoc?._id,
  });

  res.status(201).json(question);
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid question id");
  }

  const question = await TestQuestion.findById(id);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  const { text, category } = req.body;

  if (text !== undefined) {
    if (!isNonEmptyString(text)) {
      res.status(400);
      throw new Error("Question text is required");
    }
    question.text = text.trim();
  }

  if (category !== undefined) {
    const normalizedCategory = String(category || "").trim().toUpperCase();
    if (!ALLOWED_TYPES.has(normalizedCategory)) {
      res.status(400);
      throw new Error("Invalid category");
    }
    question.category = normalizedCategory;
    question.riasecRef = (await ensureRiasecType(normalizedCategory))?._id;
  }

  const updated = await question.save();
  res.json(updated);
});

export const deleteQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid question id");
  }

  const question = await TestQuestion.findById(id);
  if (!question) {
    res.status(404);
    throw new Error("Question not found");
  }

  await question.deleteOne();
  res.json({ message: "Question deleted" });
});
