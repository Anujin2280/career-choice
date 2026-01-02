import MbtiQuestion from "../models/MbtiQuestion.js";
import MbtiType from "../models/MbtiType.js";
import MbtiResult from "../models/MbtiResult.js";
import asyncHandler from "../middleware/asyncHandler.js";

const normalizeCode = (value) => String(value || "").trim().toUpperCase();
const DIMENSIONS = ["EI", "SN", "TF", "JP"];
const DIMENSION_TRAITS = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};
const TRAITS = new Set(["E", "I", "S", "N", "T", "F", "J", "P"]);
const TRAIT_DIMENSION = {
  E: "EI",
  I: "EI",
  S: "SN",
  N: "SN",
  T: "TF",
  F: "TF",
  J: "JP",
  P: "JP",
};

const normalizeDimension = (value) => {
  const normalized = normalizeCode(value);
  if (DIMENSION_TRAITS[normalized]) return normalized;
  const stripped = normalized.replace(/[^A-Z]/g, "");
  if (DIMENSION_TRAITS[stripped]) return stripped;
  if (stripped.length >= 2) {
    const candidate = stripped.slice(0, 2);
    if (DIMENSION_TRAITS[candidate]) return candidate;
  }
  return "";
};

const normalizeTrait = (value) => {
  const normalized = normalizeCode(value);
  return TRAITS.has(normalized) ? normalized : "";
};

export const getMbtiQuestions = asyncHandler(async (req, res) => {
  const questions = await MbtiQuestion.find({ isActive: true })
    .sort({ createdAt: 1 })
    .select(
      "name category dimension traitLeft traitRight prompt descriptionShort descriptionLong options tags version isActive createdAt"
    );
  res.json(questions);
});

export const listMbtiTypes = asyncHandler(async (req, res) => {
  const types = await MbtiType.find({ isActive: true })
    .sort({ type: 1 })
    .select(
      "type name descriptionShort descriptionLong strengths risks bestWorkEnvironment suggestedRoles version isActive createdAt"
    );
  res.json(types);
});

export const getMbtiTypeByCode = asyncHandler(async (req, res) => {
  const code = normalizeCode(req.params.type);
  if (!code) {
    res.status(400);
    throw new Error("Invalid MBTI type");
  }

  const type = await MbtiType.findOne({ type: code, isActive: true }).select(
    "type name descriptionShort descriptionLong strengths risks bestWorkEnvironment suggestedRoles version isActive createdAt"
  );

  if (!type) {
    res.status(404);
    throw new Error("MBTI type not found");
  }

  res.json(type);
});

export const submitMbtiTest = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    res.status(400);
    throw new Error("Answers are required");
  }

  const questionIds = answers
    .map((item) => item?.questionId)
    .filter(Boolean);

  const questions = await MbtiQuestion.find({ _id: { $in: questionIds } })
    .select("dimension traitLeft traitRight");
  const questionMap = new Map(questions.map((q) => [String(q._id), q]));

  const buckets = DIMENSIONS.reduce((acc, dimension) => {
    const [left, right] = DIMENSION_TRAITS[dimension];
    acc[dimension] = {
      dimension,
      left,
      right,
      leftCount: 0,
      rightCount: 0,
      total: 0,
    };
    return acc;
  }, {});

  const seen = new Set();
  let answeredCount = 0;

  for (const item of answers) {
    const questionId = String(item?.questionId || "");
    if (!questionId || seen.has(questionId)) continue;
    seen.add(questionId);

    const question = questionMap.get(questionId);
    const value = normalizeTrait(item?.value);
    if (!value) continue;

    let dimension = "";
    if (question) {
      dimension = normalizeDimension(question.dimension);
      if (!dimension) {
        const leftTrait = normalizeTrait(question.traitLeft);
        const rightTrait = normalizeTrait(question.traitRight);
        if (
          (leftTrait === "E" && rightTrait === "I") ||
          (leftTrait === "I" && rightTrait === "E")
        ) {
          dimension = "EI";
        } else if (
          (leftTrait === "S" && rightTrait === "N") ||
          (leftTrait === "N" && rightTrait === "S")
        ) {
          dimension = "SN";
        } else if (
          (leftTrait === "T" && rightTrait === "F") ||
          (leftTrait === "F" && rightTrait === "T")
        ) {
          dimension = "TF";
        } else if (
          (leftTrait === "J" && rightTrait === "P") ||
          (leftTrait === "P" && rightTrait === "J")
        ) {
          dimension = "JP";
        }
      }
    }

    const valueDimension = TRAIT_DIMENSION[value];
    if (!dimension || !DIMENSION_TRAITS[dimension]) {
      dimension = valueDimension || "";
    }
    if (!dimension) continue;

    const bucket = buckets[dimension];
    if (!bucket) continue;

    if (value !== bucket.left && value !== bucket.right) {
      const fallbackDimension = TRAIT_DIMENSION[value];
      if (fallbackDimension && fallbackDimension !== dimension) {
        const fallbackBucket = buckets[fallbackDimension];
        if (fallbackBucket) {
          if (value === fallbackBucket.left) {
            fallbackBucket.leftCount += 1;
          } else if (value === fallbackBucket.right) {
            fallbackBucket.rightCount += 1;
          }
          fallbackBucket.total += 1;
          answeredCount += 1;
        }
      }
      continue;
    }

    if (value === bucket.left) {
      bucket.leftCount += 1;
    } else if (value === bucket.right) {
      bucket.rightCount += 1;
    } else {
      continue;
    }

    bucket.total += 1;
    answeredCount += 1;
  }

  const breakdown = DIMENSIONS.map((dimension) => {
    const bucket = buckets[dimension];
    const leftPct = bucket.total
      ? Math.round((bucket.leftCount / bucket.total) * 100)
      : 0;
    const rightPct = bucket.total ? 100 - leftPct : 0;
    return {
      dimension,
      left: bucket.left,
      right: bucket.right,
      leftCount: bucket.leftCount,
      rightCount: bucket.rightCount,
      leftPct,
      rightPct,
    };
  });

  const type = breakdown
    .map((item) =>
      item.leftCount >= item.rightCount ? item.left : item.right
    )
    .join("");

  if (!answeredCount) {
    res.status(400);
    throw new Error("No valid answers provided");
  }

  const typeDoc = await MbtiType.findOne({ type, isActive: true }).select(
    "name"
  );

  const result = await MbtiResult.create({
    user: req.user._id,
    type,
    typeName: typeDoc?.name || "",
    breakdown,
  });

  res.json({
    resultId: result._id,
    type: result.type,
    typeName: result.typeName,
    breakdown: result.breakdown,
    createdAt: result.ognoo,
  });
});

export const getMbtiHistory = asyncHandler(async (req, res) => {
  const results = await MbtiResult.find({ user: req.user._id })
    .sort({ ognoo: -1 })
    .select("type typeName breakdown ognoo");
  res.json(results);
});
