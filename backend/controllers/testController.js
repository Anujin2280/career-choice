import Profession from "../models/Profession.js";
import TestQuestion from "../models/TestQuestion.js";
import TestResult from "../models/TestResult.js";
import UserAnswer from "../models/UserAnswer.js";
import RiasecType from "../models/RiasecType.js";
import asyncHandler from "../middleware/asyncHandler.js";

const ALLOWED_TYPES = new Set(["R", "I", "A", "S", "E", "C"]);

const normalizeTypes = (values) => [
  ...new Set(
    values
      .map((item) => String(item || "").trim().toUpperCase())
      .filter((item) => ALLOWED_TYPES.has(item))
  ),
];

const buildScores = () => ({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });

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

export const getTestQuestions = asyncHandler(async (req, res) => {
  const questions = await TestQuestion.find()
    .sort({ _id: 1 })
    .select("text category");
  res.json(questions);
});

export const suggestProfessions = asyncHandler(async (req, res) => {
  const { topThree } = req.body;

  if (!Array.isArray(topThree)) {
    res.status(400);
    throw new Error("topThree must be an array");
  }

  const normalized = normalizeTypes(topThree);

  if (normalized.length === 0) {
    res.status(400);
    throw new Error("No valid RIASEC types provided");
  }

  const professions = await Profession.find({
    $or: [
      { riasecCode: { $in: normalized } },
      { riasecTypes: { $in: normalized } },
    ],
  })
    .limit(15)
    .select(
      "name category descriptionShort descriptionLong salary demand riasecCode"
    );

  res.json({ topThree: normalized, professions });
});

export const submitTest = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  if (!Array.isArray(answers) || answers.length === 0) {
    res.status(400);
    throw new Error("Answers are required");
  }

  const questionIds = answers
    .map((item) => item?.questionId)
    .filter(Boolean);

  const questions = await TestQuestion.find({ _id: { $in: questionIds } }).select(
    "category riasecRef"
  );
  const questionMap = new Map(
    questions.map((q) => [String(q._id), q])
  );

  const scores = buildScores();
  const answerDocs = [];

  for (const item of answers) {
    const questionId = String(item?.questionId || "");
    const question = questionMap.get(questionId);
    if (!question) continue;
    const score = Number(item?.score);
    if (!Number.isFinite(score) || score < 1 || score > 5) continue;

    const category = String(question.category || "").toUpperCase();
    if (!ALLOWED_TYPES.has(category)) continue;

    scores[category] += score;
    answerDocs.push({
      question: question._id,
      riasecCode: category,
      score,
    });
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topThree = sorted.slice(0, 3).map(([key]) => key);

  if (topThree.length === 0) {
    res.status(400);
    throw new Error("No valid answers provided");
  }

  const testResult = await TestResult.create({
    user: req.user._id,
    scores,
    topThree,
    topType: topThree[0],
  });

  if (answerDocs.length > 0) {
    await UserAnswer.insertMany(
      answerDocs.map((item) => ({ ...item, testResult: testResult._id }))
    );
  }

  await Promise.all(topThree.map((code) => ensureRiasecType(code)));

  const professions = await Profession.find({
    $or: [
      { riasecCode: { $in: topThree } },
      { riasecTypes: { $in: topThree } },
    ],
  })
    .limit(15)
    .select(
      "name category descriptionShort descriptionLong salary demand riasecCode"
    );

  res.json({
    resultId: testResult._id,
    scores,
    topThree,
    professions,
    createdAt: testResult.ognoo,
  });
});

export const getHistory = asyncHandler(async (req, res) => {
  const results = await TestResult.find({ user: req.user._id })
    .sort({ ognoo: -1 })
    .select("scores topThree topType ognoo");
  res.json(results);
});
