import mongoose from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import UserInfo from "../models/UserInfo.js";
import Profession from "../models/Profession.js";
import TestQuestion from "../models/TestQuestion.js";
import Category from "../models/Category.js";
import RiasecType from "../models/RiasecType.js";
import MbtiQuestion from "../models/MbtiQuestion.js";
import MbtiType from "../models/MbtiType.js";
import { isEmail, isNonEmptyString } from "../utils/validation.js";

const ALLOWED_TYPES = new Set(["R", "I", "A", "S", "E", "C"]);
const MBTI_DIMENSIONS = new Set(["EI", "SN", "TF", "JP"]);
const MBTI_TRAITS = new Set(["E", "I", "S", "N", "T", "F", "J", "P"]);
const MBTI_DIMENSION_TRAITS = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};
const MBTI_TYPE_POSITION = [
  new Set(["E", "I"]),
  new Set(["S", "N"]),
  new Set(["T", "F"]),
  new Set(["J", "P"]),
];

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

const normalizeMbtiDimension = (value) => {
  const normalized = String(value || "").trim().toUpperCase();
  return MBTI_DIMENSIONS.has(normalized) ? normalized : "";
};

const normalizeMbtiTrait = (value, fallback = "") => {
  const normalized = String(value || "").trim().toUpperCase();
  if (MBTI_TRAITS.has(normalized)) return normalized;
  return MBTI_TRAITS.has(String(fallback || "").trim().toUpperCase())
    ? String(fallback || "").trim().toUpperCase()
    : "";
};

const normalizeStringList = (items) =>
  Array.isArray(items)
    ? items.map((item) => String(item || "").trim()).filter(Boolean)
    : [];

const normalizeMbtiOptions = (options, leftTrait, rightTrait) => {
  if (!Array.isArray(options)) return [];
  const fallback = [leftTrait, rightTrait];
  return options
    .map((option, index) => {
      const fallbackValue = fallback[index] || fallback[0] || "";
      if (typeof option === "string") {
        const label = option.trim();
        return {
          label,
          value: normalizeMbtiTrait(fallbackValue),
        };
      }
      if (option && typeof option === "object") {
        const label = String(
          option.label ?? option.text ?? option.name ?? ""
        ).trim();
        const rawValue = option.value ?? option.code ?? option.trait ?? fallbackValue;
        const value = normalizeMbtiTrait(rawValue, fallbackValue);
        return { label, value };
      }
      return null;
    })
    .filter((option) => option && (option.label || option.value))
    .slice(0, 2)
    .map((option, index) => ({
      label: option.label || fallback[index] || "",
      value: option.value || normalizeMbtiTrait(fallback[index]),
    }));
};

const normalizeMbtiTypeCode = (value) => {
  const normalized = String(value || "").trim().toUpperCase();
  if (normalized.length !== 4) return "";
  if (![...normalized].every((c) => MBTI_TRAITS.has(c))) return "";
  const isValidOrder = MBTI_TYPE_POSITION.every(
    (set, index) => set.has(normalized[index])
  );
  if (!isValidOrder) return "";
  return normalized;
};

export const getSummary = asyncHandler(async (req, res) => {
  const [users, professions, questions, mbtiQuestions, mbtiTypes] =
    await Promise.all([
      UserInfo.countDocuments(),
      Profession.countDocuments(),
      TestQuestion.countDocuments(),
      MbtiQuestion.countDocuments(),
      MbtiType.countDocuments(),
    ]);

  res.json({ users, professions, questions, mbtiQuestions, mbtiTypes });
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

export const listMbtiQuestions = asyncHandler(async (req, res) => {
  const questions = await MbtiQuestion.find().sort({ createdAt: -1 });
  res.json(questions);
});

export const createMbtiQuestion = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    dimension,
    traitLeft,
    traitRight,
    prompt,
    descriptionShort,
    descriptionLong,
    options,
    tags,
    version,
    isActive,
  } = req.body;

  if (!isNonEmptyString(prompt)) {
    res.status(400);
    throw new Error("Prompt is required");
  }

  const normalizedDimension = normalizeMbtiDimension(dimension);
  if (!normalizedDimension) {
    res.status(400);
    throw new Error("Invalid dimension");
  }

  const [defaultLeft, defaultRight] = MBTI_DIMENSION_TRAITS[normalizedDimension];
  const normalizedLeft = normalizeMbtiTrait(traitLeft, defaultLeft);
  const normalizedRight = normalizeMbtiTrait(traitRight, defaultRight);

  if (!normalizedLeft || !normalizedRight || normalizedLeft === normalizedRight) {
    res.status(400);
    throw new Error("Invalid traits");
  }

  const normalizedCategory = isNonEmptyString(category) ? category.trim() : "MBTI";
  const categoryDoc = await ensureCategory(normalizedCategory);

  const normalizedOptions = normalizeMbtiOptions(
    options,
    normalizedLeft,
    normalizedRight
  );
  const normalizedTags = normalizeStringList(tags);

  const parsedVersion = Number(version);
  const normalizedVersion = Number.isFinite(parsedVersion) ? parsedVersion : 1;

  const normalizedDescriptionShort = isNonEmptyString(descriptionShort)
    ? descriptionShort.trim()
    : "";
  const normalizedDescriptionLong = isNonEmptyString(descriptionLong)
    ? descriptionLong.trim()
    : normalizedDescriptionShort;

  const question = await MbtiQuestion.create({
    name: isNonEmptyString(name) ? name.trim() : "",
    category: normalizedCategory,
    categoryRef: categoryDoc?._id,
    dimension: normalizedDimension,
    traitLeft: normalizedLeft,
    traitRight: normalizedRight,
    prompt: prompt.trim(),
    descriptionShort: normalizedDescriptionShort,
    descriptionLong: normalizedDescriptionLong,
    options: normalizedOptions,
    tags: normalizedTags,
    version: normalizedVersion,
    isActive: typeof isActive === "boolean" ? isActive : true,
  });

  res.status(201).json(question);
});

export const updateMbtiQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid MBTI question id");
  }

  const question = await MbtiQuestion.findById(id);
  if (!question) {
    res.status(404);
    throw new Error("MBTI question not found");
  }

  const {
    name,
    category,
    dimension,
    traitLeft,
    traitRight,
    prompt,
    descriptionShort,
    descriptionLong,
    options,
    tags,
    version,
    isActive,
  } = req.body;

  const currentDimension = normalizeMbtiDimension(question.dimension);
  const incomingDimension =
    dimension !== undefined ? normalizeMbtiDimension(dimension) : "";
  if (dimension !== undefined && !incomingDimension) {
    res.status(400);
    throw new Error("Invalid dimension");
  }

  const nextDimension = incomingDimension || currentDimension;
  const [defaultLeft, defaultRight] = MBTI_DIMENSION_TRAITS[nextDimension];
  const dimensionChanged =
    incomingDimension && incomingDimension !== currentDimension;

  const nextLeft =
    traitLeft !== undefined
      ? normalizeMbtiTrait(traitLeft, defaultLeft)
      : normalizeMbtiTrait(
          dimensionChanged ? defaultLeft : question.traitLeft,
          defaultLeft
        );
  const nextRight =
    traitRight !== undefined
      ? normalizeMbtiTrait(traitRight, defaultRight)
      : normalizeMbtiTrait(
          dimensionChanged ? defaultRight : question.traitRight,
          defaultRight
        );

  if (!nextLeft || !nextRight || nextLeft === nextRight) {
    res.status(400);
    throw new Error("Invalid traits");
  }

  if (name !== undefined) {
    question.name = isNonEmptyString(name) ? name.trim() : "";
  }

  if (category !== undefined) {
    const normalizedCategory = isNonEmptyString(category) ? category.trim() : "";
    if (!normalizedCategory) {
      res.status(400);
      throw new Error("Category is required");
    }
    question.category = normalizedCategory;
    question.categoryRef = (await ensureCategory(normalizedCategory))?._id;
  }

  if (incomingDimension) {
    question.dimension = incomingDimension;
  }

  question.traitLeft = nextLeft;
  question.traitRight = nextRight;

  if (prompt !== undefined) {
    if (!isNonEmptyString(prompt)) {
      res.status(400);
      throw new Error("Prompt is required");
    }
    question.prompt = prompt.trim();
  }

  if (descriptionShort !== undefined) {
    question.descriptionShort = isNonEmptyString(descriptionShort)
      ? descriptionShort.trim()
      : "";
  }

  if (descriptionLong !== undefined) {
    question.descriptionLong = isNonEmptyString(descriptionLong)
      ? descriptionLong.trim()
      : "";
  }

  if (
    descriptionLong === undefined &&
    descriptionShort !== undefined &&
    !question.descriptionLong
  ) {
    question.descriptionLong = question.descriptionShort || "";
  }

  const traitsChanged =
    dimensionChanged || traitLeft !== undefined || traitRight !== undefined;

  if (options !== undefined) {
    question.options = normalizeMbtiOptions(options, nextLeft, nextRight);
  } else if (traitsChanged) {
    question.options = normalizeMbtiOptions(
      question.options,
      nextLeft,
      nextRight
    );
  }

  if (tags !== undefined) {
    question.tags = normalizeStringList(tags);
  }

  if (version !== undefined) {
    const parsedVersion = Number(version);
    if (!Number.isFinite(parsedVersion)) {
      res.status(400);
      throw new Error("Invalid version");
    }
    question.version = parsedVersion;
  }

  if (isActive !== undefined) {
    question.isActive = Boolean(isActive);
  }

  const updated = await question.save();
  res.json(updated);
});

export const deleteMbtiQuestion = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid MBTI question id");
  }

  const question = await MbtiQuestion.findById(id);
  if (!question) {
    res.status(404);
    throw new Error("MBTI question not found");
  }

  await question.deleteOne();
  res.json({ message: "MBTI question deleted" });
});

export const listMbtiTypes = asyncHandler(async (req, res) => {
  const types = await MbtiType.find().sort({ type: 1 });
  res.json(types);
});

export const createMbtiType = asyncHandler(async (req, res) => {
  const {
    type,
    name,
    descriptionShort,
    descriptionLong,
    strengths,
    risks,
    bestWorkEnvironment,
    suggestedRoles,
    version,
    isActive,
  } = req.body;

  const normalizedType = normalizeMbtiTypeCode(type);
  if (!normalizedType) {
    res.status(400);
    throw new Error("Invalid MBTI type");
  }

  if (!isNonEmptyString(name)) {
    res.status(400);
    throw new Error("Name is required");
  }

  const normalizedDescriptionShort = isNonEmptyString(descriptionShort)
    ? descriptionShort.trim()
    : "";
  const normalizedDescriptionLong = isNonEmptyString(descriptionLong)
    ? descriptionLong.trim()
    : normalizedDescriptionShort;

  const parsedVersion = Number(version);
  const normalizedVersion = Number.isFinite(parsedVersion) ? parsedVersion : 1;

  const typeDoc = await MbtiType.create({
    type: normalizedType,
    name: name.trim(),
    descriptionShort: normalizedDescriptionShort,
    descriptionLong: normalizedDescriptionLong,
    strengths: normalizeStringList(strengths),
    risks: normalizeStringList(risks),
    bestWorkEnvironment: normalizeStringList(bestWorkEnvironment),
    suggestedRoles: normalizeStringList(suggestedRoles),
    version: normalizedVersion,
    isActive: typeof isActive === "boolean" ? isActive : true,
  });

  res.status(201).json(typeDoc);
});

export const updateMbtiType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid MBTI type id");
  }

  const typeDoc = await MbtiType.findById(id);
  if (!typeDoc) {
    res.status(404);
    throw new Error("MBTI type not found");
  }

  const {
    type,
    name,
    descriptionShort,
    descriptionLong,
    strengths,
    risks,
    bestWorkEnvironment,
    suggestedRoles,
    version,
    isActive,
  } = req.body;

  if (type !== undefined) {
    const normalizedType = normalizeMbtiTypeCode(type);
    if (!normalizedType) {
      res.status(400);
      throw new Error("Invalid MBTI type");
    }
    typeDoc.type = normalizedType;
  }

  if (name !== undefined) {
    if (!isNonEmptyString(name)) {
      res.status(400);
      throw new Error("Name is required");
    }
    typeDoc.name = name.trim();
  }

  if (descriptionShort !== undefined) {
    typeDoc.descriptionShort = isNonEmptyString(descriptionShort)
      ? descriptionShort.trim()
      : "";
  }

  if (descriptionLong !== undefined) {
    typeDoc.descriptionLong = isNonEmptyString(descriptionLong)
      ? descriptionLong.trim()
      : "";
  }

  if (
    descriptionLong === undefined &&
    descriptionShort !== undefined &&
    !typeDoc.descriptionLong
  ) {
    typeDoc.descriptionLong = typeDoc.descriptionShort || "";
  }

  if (strengths !== undefined) {
    typeDoc.strengths = normalizeStringList(strengths);
  }

  if (risks !== undefined) {
    typeDoc.risks = normalizeStringList(risks);
  }

  if (bestWorkEnvironment !== undefined) {
    typeDoc.bestWorkEnvironment = normalizeStringList(bestWorkEnvironment);
  }

  if (suggestedRoles !== undefined) {
    typeDoc.suggestedRoles = normalizeStringList(suggestedRoles);
  }

  if (version !== undefined) {
    const parsedVersion = Number(version);
    if (!Number.isFinite(parsedVersion)) {
      res.status(400);
      throw new Error("Invalid version");
    }
    typeDoc.version = parsedVersion;
  }

  if (isActive !== undefined) {
    typeDoc.isActive = Boolean(isActive);
  }

  const updated = await typeDoc.save();
  res.json(updated);
});

export const deleteMbtiType = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    res.status(400);
    throw new Error("Invalid MBTI type id");
  }

  const typeDoc = await MbtiType.findById(id);
  if (!typeDoc) {
    res.status(404);
    throw new Error("MBTI type not found");
  }

  await typeDoc.deleteOne();
  res.json({ message: "MBTI type deleted" });
});
