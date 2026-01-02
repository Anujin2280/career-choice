import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Loader2,
  RotateCcw,
} from "lucide-react";
import api from "../api/axios";

const DIMENSION_ORDER = ["EI", "SN", "TF", "JP"];
const DIMENSION_TRAITS = {
  EI: ["E", "I"],
  SN: ["S", "N"],
  TF: ["T", "F"],
  JP: ["J", "P"],
};
const TRAIT_SET = new Set(["E", "I", "S", "N", "T", "F", "J", "P"]);

const TRAIT_LABELS = {
  E: {
    label: "Гадагш чиглэсэн",
    detail: "Хүмүүстэй харилцах, үйл ажиллагаанаас эрч хүч авдаг.",
  },
  I: {
    label: "Дотогш чиглэсэн",
    detail: "Нам гүм төвлөрлөөс эрч хүч авдаг.",
  },
  S: {
    label: "Мэдрэхүй",
    detail: "Баримт, нарийн ширийн, бодит зүйлд төвлөрнө.",
  },
  N: {
    label: "Зөн совин",
    detail: "Хэв маяг, санаа, боломжид төвлөрнө.",
  },
  T: {
    label: "Бодлогч",
    detail: "Логик, бодит үнэлгээг баримтална.",
  },
  F: {
    label: "Мэдрэмж",
    detail: "Үнэ цэнэ, хүний нөлөөг чухалчилна.",
  },
  J: {
    label: "Шийдэмгий",
    detail: "Төлөвлөлт, бүтэц, шийдвэрийг илүүд үзнэ.",
  },
  P: {
    label: "Уян хатан",
    detail: "Уян хатан, сонголттой байхыг илүүд үзнэ.",
  },
};

const normalizeCode = (value) => String(value || "").trim().toUpperCase();

const traitInfo = (code) =>
  TRAIT_LABELS[code] || { label: code || "-", detail: "" };

const getTraitsForQuestion = (question) => {
  const dimension = normalizeCode(question?.dimension);
  const fallback = DIMENSION_TRAITS[dimension] || [];
  const left = normalizeCode(question?.traitLeft) || fallback[0] || "";
  const right = normalizeCode(question?.traitRight) || fallback[1] || "";
  return { dimension, left, right };
};

const normalizeOptions = (question) => {
  const { left, right } = getTraitsForQuestion(question);
  const rawOptions = Array.isArray(question?.options) ? question.options : [];
  const mapped = rawOptions
    .map((option, index) => {
      const fallbackValue = index === 0 ? left : right;
      if (typeof option === "string") {
        return { label: option.trim(), value: fallbackValue };
      }
      if (option && typeof option === "object") {
        const label = String(
          option.label ?? option.text ?? option.name ?? ""
        ).trim();
        const value = normalizeCode(
          option.value ?? option.code ?? option.trait ?? fallbackValue
        );
        const normalizedValue = TRAIT_SET.has(value) ? value : fallbackValue;
        return { label, value: normalizedValue };
      }
      return null;
    })
    .filter((option) => option && (option.label || option.value))
    .slice(0, 2);

  if (mapped.length === 2) {
    return mapped.map((option, index) => ({
      label:
        option.label || traitInfo(index === 0 ? left : right).label || "",
      value: option.value || (index === 0 ? left : right),
    }));
  }

  return [
    { label: traitInfo(left).label, value: left },
    { label: traitInfo(right).label, value: right },
  ];
};

const buildResult = (questions, answers) => {
  const stats = {};

  questions.forEach((question) => {
    const selected = normalizeCode(answers?.[question?._id]);
    const { dimension, left, right } = getTraitsForQuestion(question);
    if (!dimension || !left || !right) return;

    if (!stats[dimension]) {
      stats[dimension] = {
        left,
        right,
        leftCount: 0,
        rightCount: 0,
        total: 0,
      };
    }

    const bucket = stats[dimension];
    bucket.left = left;
    bucket.right = right;

    if (selected === left) {
      bucket.leftCount += 1;
    } else if (selected === right) {
      bucket.rightCount += 1;
    }

    if (selected) {
      bucket.total += 1;
    }
  });

  const breakdown = DIMENSION_ORDER.filter((dimension) => stats[dimension]).map(
    (dimension) => {
      const bucket = stats[dimension];
      const leftInfo = traitInfo(bucket.left);
      const rightInfo = traitInfo(bucket.right);
      const leftPct = bucket.total
        ? Math.round((bucket.leftCount / bucket.total) * 100)
        : 0;
      const rightPct = bucket.total ? 100 - leftPct : 0;
      const chosen =
        bucket.leftCount >= bucket.rightCount ? leftInfo : rightInfo;

      return {
        key: dimension,
        left: leftInfo,
        right: rightInfo,
        leftPct,
        rightPct,
        chosen,
        leftCode: bucket.left,
        rightCode: bucket.right,
        leftCount: bucket.leftCount,
        rightCount: bucket.rightCount,
      };
    }
  );

  const type = breakdown
    .map((item) =>
      item.leftCount >= item.rightCount ? item.leftCode : item.rightCode
    )
    .join("");

  return { type, breakdown, preferences: breakdown.map((item) => item.chosen) };
};

export default function MbtiTest() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [error, setError] = useState(null);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [typeProfile, setTypeProfile] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data } = await api.get("/mbti/questions");
        setQuestions(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const total = questions.length;
  const question = questions[step];
  const answeredCount = Object.keys(answers).length;

  const progress = useMemo(() => {
    if (!total) return 0;
    return Math.round(((step + 1) / total) * 100);
  }, [step, total]);

  const buildPayload = () =>
    Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

  const handleAnswer = (value) => {
    if (!question) return;
    const questionId = question?._id || question?.id;
    if (!questionId) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (step < total - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 260);
    }
  };

  const handleFinish = async () => {
    if (!questions.length) return;
    const computed = buildResult(questions, answers);
    setResult(computed);
    setTypeProfile(null);

    try {
      await api.post("/mbti/submit", { answers: buildPayload() });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "MBTI үр дүнг хадгалж чадсангүй."
      );
    }

    if (!computed.type) return;

    setLoadingProfile(true);
    try {
      const { data } = await api.get(`/mbti/types/${computed.type}`);
      setTypeProfile(data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "MBTI төрлийн мэдээлэл олдсонгүй."
      );
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    setTypeProfile(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50/50">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Асуултуудыг татаж байна...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-red-500">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">!</span>
          </div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 text-gray-500">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md text-center">
          MBTI асуулт олдсонгүй.
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-orange-100 shadow-xl rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full">
                MBTI үр дүн
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-6">
                {result.type || "----"}
              </h2>
              <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
                Таны сонголтууд таны эрч хүчээ хаанаас авч, мэдээлэл хэрхэн
                хүлээн авч, шийдвэр гаргалт болон амьдралаа хэрхэн зохион
                байгуулдгийг харуулна.
              </p>
            </div>

            {typeProfile && (
              <div className="mt-10 border border-orange-100 rounded-2xl p-6 bg-orange-50/30">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-orange-600 font-semibold">
                      {typeProfile.type}
                    </p>
                    <h3 className="text-2xl font-bold text-slate-900">
                      {typeProfile.name}
                    </h3>
                  </div>
                  {loadingProfile && (
                    <span className="text-sm text-gray-400">
                      Төрлийн мэдээлэл татаж байна...
                    </span>
                  )}
                </div>
                {(typeProfile.descriptionShort || typeProfile.descriptionLong) && (
                  <p className="mt-3 text-slate-600">
                    {typeProfile.descriptionShort || typeProfile.descriptionLong}
                  </p>
                )}
              </div>
            )}
            {loadingProfile && !typeProfile && (
              <div className="mt-6 text-center text-sm text-gray-400">
                Төрлийн мэдээлэл татаж байна...
              </div>
            )}

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {result.breakdown.map((item) => (
                <div
                  key={item.key}
                  className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5"
                >
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                    <span>{item.left.label}</span>
                    <span className="text-slate-400">
                      {item.leftPct}% / {item.rightPct}%
                    </span>
                    <span>{item.right.label}</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${item.leftPct}%` }}
                    />
                  </div>
                  <p className="mt-4 text-sm text-slate-600">
                    {item.chosen.label}: {item.chosen.detail}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-white border border-orange-100 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-slate-800">
                Таны үндсэн хандлага
              </h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {result.preferences.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-orange-50/60 border border-orange-100 p-4"
                  >
                    <p className="text-sm font-semibold text-orange-700">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm text-slate-600">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {typeProfile && (
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {Array.isArray(typeProfile.strengths) &&
                  typeProfile.strengths.length > 0 && (
                    <div className="rounded-2xl border border-orange-100 p-5">
                      <h4 className="text-base font-bold text-slate-800">
                        Давуу тал
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                        {typeProfile.strengths.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {Array.isArray(typeProfile.risks) &&
                  typeProfile.risks.length > 0 && (
                    <div className="rounded-2xl border border-orange-100 p-5">
                      <h4 className="text-base font-bold text-slate-800">
                        Сорилт
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                        {typeProfile.risks.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {Array.isArray(typeProfile.bestWorkEnvironment) &&
                  typeProfile.bestWorkEnvironment.length > 0 && (
                    <div className="rounded-2xl border border-orange-100 p-5">
                      <h4 className="text-base font-bold text-slate-800">
                        Тохиромжтой орчин
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                        {typeProfile.bestWorkEnvironment.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {Array.isArray(typeProfile.suggestedRoles) &&
                  typeProfile.suggestedRoles.length > 0 && (
                    <div className="rounded-2xl border border-orange-100 p-5">
                      <h4 className="text-base font-bold text-slate-800">
                        Тохирох ажлын чиглэл
                      </h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                        {typeProfile.suggestedRoles.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            )}

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={handleRestart}
                className="inline-flex items-center gap-2 rounded-full border-2 border-orange-200 px-6 py-2 text-orange-700 font-semibold hover:bg-orange-50 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Дахин өгөх
              </button>
              <Link
                to="/professions"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-2 text-white font-semibold shadow-lg shadow-orange-200 hover:bg-orange-700 transition"
              >
                Мэргэжлүүд үзэх <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const optionItems = normalizeOptions(question);
  const activeQuestionId = question?._id || question?.id;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-3xl relative z-10">
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setStep((prev) => Math.max(prev - 1, 0))}
              disabled={step === 0}
              className="group flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 disabled:opacity-0 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow mr-2">
                <ChevronLeft className="w-4 h-4" />
              </div>
              Буцах
            </button>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Асуулт {step + 1} / {total}
            </div>
          </div>
          <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-sm">
            <div
              className="h-full bg-orange-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div
          className={`bg-white rounded-4xl shadow-2xl shadow-orange-500/5 p-8 md:p-12 transition-all duration-300 transform ${
            isAnimating
              ? "opacity-60 translate-y-4 scale-[0.98]"
              : "opacity-100 translate-y-0 scale-100"
          }`}
        >
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-full">
              MBTI үнэлгээ
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-6 leading-snug">
              {question?.prompt}
            </h2>
            {question?.descriptionShort && (
              <p className="mt-3 text-gray-500">{question.descriptionShort}</p>
            )}
            {!question?.descriptionShort && (
              <p className="mt-3 text-gray-500">
                Танд илүү тохирох өгүүлбэрийг сонгоно уу.
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-4">
            {optionItems.map((option) => {
              const isSelected = answers[activeQuestionId] === option.value;
              return (
                <button
                  key={`${activeQuestionId}-${option.value}`}
                  onClick={() => handleAnswer(option.value)}
                  className={`group relative w-full px-6 py-4 rounded-2xl border-2 transition-all duration-200 text-left flex items-center justify-between ${
                    isSelected
                      ? "bg-orange-50 border-orange-500 text-orange-700 shadow-inner"
                      : "bg-white border-gray-100 text-gray-600 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors border ${
                        isSelected
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-gray-50 text-gray-400 border-gray-200 group-hover:border-orange-300 group-hover:text-orange-500"
                      }`}
                    >
                      {option.value}
                    </span>
                    <span className="font-medium text-base md:text-lg">
                      {option.label}
                    </span>
                  </div>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isSelected
                        ? "opacity-100 scale-100 bg-orange-500 text-white"
                        : "opacity-0 scale-0"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center h-14 flex justify-center items-center gap-4">
          <span className="text-sm text-gray-500">
            Хариулсан {answeredCount} / {total}
          </span>
          {step === total - 1 && answers[activeQuestionId] && (
            <button
              onClick={handleFinish}
              className="inline-flex items-center px-8 py-3 rounded-full bg-orange-600 text-white font-bold text-lg shadow-lg hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              Үр дүнг харах <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
