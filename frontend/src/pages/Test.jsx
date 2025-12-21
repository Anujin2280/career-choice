import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  Check,
  ChevronLeft,
  Save,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react"; // lucide-react сан суулгах хэрэгтэй

// Scale-ийн утгуудыг илүү ойлгомжтой, өнгөлөг болгох
const SCALE = [
  { v: 1, label: "Огт тохирохгүй" },
  { v: 2, label: "Бага зэрэг тохирохгүй" },
  { v: 3, label: "Дундаж" },
  { v: 4, label: "Ихэвчлэн тохирно" },
  { v: 5, label: "Бүрэн тохирно" },
];

const buildScores = (questions, answers) => {
  const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  questions.forEach((q) => {
    const value = Number(answers[q._id] || 0);
    const category = String(q.category || "").toUpperCase();
    if (!Object.prototype.hasOwnProperty.call(scores, category)) return;
    scores[category] += value;
  });
  return scores;
};

const getTopThree = (scores) =>
  Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key);

export default function Test() {
  const { token } = useSelector((state) => state.auth);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // Шилжилт хийх эффектэд зориулсан state

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get("/test");
        setQuestions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Math.round(((step + 1) / questions.length) * 100);
  }, [step, questions.length]);

  const q = questions[step];

  // UX Improvement: Auto-advance
  // Хариулт сонгосны дараа автоматаар дараагийн асуулт руу шилжинэ
  const handleAnswer = (value) => {
    if (!q) return;
    setAnswers({ ...answers, [q._id]: value });

    // Сүүлийн асуулт биш бол автоматаар шилжинэ
    if (step < questions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setIsAnimating(false);
      }, 300); // 300ms хүлээлт үүсгэж хэрэглэгчид сонголтыг нь харуулна
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, questions.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const buildPayload = () =>
    Object.entries(answers).map(([questionId, score]) => ({
      questionId,
      score,
    }));

  const calculateLocal = () => {
    const scores = buildScores(questions, answers);
    const topThree = getTopThree(scores);
    return { scores, topThree };
  };

  const handleSubmit = async () => {
    if (!questions.length) return;
    setSaving(true);
    setError(null);
    try {
      if (token) {
        const res = await api.post("/test/submit", { answers: buildPayload() });
        setResult({
          scores: res.data.scores,
          topThree: res.data.topThree,
          professions: res.data.professions || [],
          createdAt: res.data.createdAt,
          saved: true,
        });
      } else {
        const local = calculateLocal();
        const suggest = await api.post("/test/suggest", {
          topThree: local.topThree,
        });
        setResult({
          ...local,
          professions: suggest.data.professions || [],
          saved: false,
        });
      }
    } catch (err) {
      const local = calculateLocal();
      try {
        const suggest = await api.post("/test/suggest", {
          topThree: local.topThree,
        });
        setResult({
          ...local,
          professions: suggest.data.professions || [],
          saved: false,
        });
      } catch {
        setResult({ ...local, professions: [], saved: false });
      }
      toast.error("Алдаа гарлаа, гэхдээ үр дүнг тооцооллоо.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfession = async (id) => {
    if (!token) return toast.error("Нэвтэрч орно уу.");
    try {
      await api.post("/users/me/saved", { professionId: id });
      toast.success("Амжилттай хадгаллаа!");
    } catch (err) {
      toast.error("Хадгалах үед алдаа гарлаа.");
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-orange-50/50">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">
          Асуултуудыг бэлдэж байна...
        </p>
      </div>
    );
  }

  // --- Error State ---
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

  // --- Result State ---
  if (result) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-white py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Result Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Таны үр дүн бэлэн боллоо!
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Таны хариултанд үндэслэн{" "}
              <span className="text-orange-600 font-bold">RIASEC</span>{" "}
              загвараар дараах мэргэжлүүдийг санал болгож байна.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {result.professions.map((p, idx) => (
              <div
                key={p._id}
                className="group relative flex flex-col bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden"
              >
                {/* Decorative Top Bar */}
                <div
                  className={`h-2 w-full ${
                    idx === 0
                      ? "bg-orange-500"
                      : "bg-gray-200 group-hover:bg-orange-400"
                  } transition-colors`}
                ></div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-xs font-bold tracking-wider text-orange-600 uppercase mb-2 block">
                        {p.category}
                      </span>
                      <h4 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                        {p.name}
                      </h4>
                    </div>
                    {p.riasecCode && (
                      <span className="flex items-center justify-center px-3 py-1 rounded-full bg-orange-50 text-xs font-bold text-orange-700 border border-orange-100">
                        {p.riasecCode}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-8 line-clamp-4">
                    {p.descriptionShort || p.descriptionLong || p.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
                    <Link
                      to={`/profession/${p._id}`}
                      className="inline-flex items-center text-sm font-semibold text-gray-900 hover:text-orange-600 transition-colors"
                    >
                      Дэлгэрэнгүй <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                    <button
                      onClick={() => handleSaveProfession(p._id)}
                      className="p-2.5 rounded-full text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-all active:scale-95"
                      title="Хадгалах"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- Question UI ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-10 px-4 relative overflow-hidden">
      {/* Abstract Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Navigation & Progress */}
        <div className="mb-8 px-2">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={back}
              disabled={step === 0}
              className="group flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 disabled:opacity-0 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow mr-2">
                <ChevronLeft className="w-4 h-4" />
              </div>
              Буцах
            </button>
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Асуулт {step + 1} / {questions.length}
            </span>
          </div>

          {/* Custom Progress Bar */}
          <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-sm">
            <div
              className="h-full bg-orange-500 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`
                bg-white rounded-4xl shadow-2xl shadow-orange-500/5 p-8 md:p-12 
                transition-all duration-300 transform 
                ${
                  isAnimating
                    ? "opacity-50 translate-y-4 scale-[0.98]"
                    : "opacity-100 translate-y-0 scale-100"
                }
            `}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10 leading-snug">
            {q?.text}
          </h2>

          {/* Answer Options */}
          <div className="flex flex-col gap-3">
            {SCALE.map((s) => {
              const isSelected = answers[q._id] === s.v;
              return (
                <button
                  key={s.v}
                  onClick={() => handleAnswer(s.v)}
                  className={`
                            group relative w-full px-6 py-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between
                            ${
                              isSelected
                                ? "bg-orange-50 border-orange-500 text-orange-700 shadow-inner"
                                : "bg-white border-gray-100 text-gray-600 hover:border-orange-200 hover:shadow-md hover:-translate-y-0.5"
                            }
                        `}
                >
                  <div className="flex items-center gap-4">
                    {/* Number Circle */}
                    <span
                      className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors border
                                ${
                                  isSelected
                                    ? "bg-orange-500 text-white border-orange-500"
                                    : "bg-gray-50 text-gray-400 border-gray-200 group-hover:border-orange-300 group-hover:text-orange-500"
                                }
                            `}
                    >
                      {s.v}
                    </span>
                    <span className="font-medium text-base md:text-lg">
                      {s.label}
                    </span>
                  </div>

                  {/* Check Icon */}
                  <div
                    className={`
                            w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
                            ${
                              isSelected
                                ? "opacity-100 scale-100 bg-orange-500 text-white"
                                : "opacity-0 scale-0"
                            }
                        `}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Action */}
        <div className="mt-8 text-center h-14 flex justify-center">
          {step === questions.length - 1 && answers[q._id] && (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center px-8 py-3 rounded-full bg-orange-600 text-white font-bold text-lg shadow-lg hover:bg-orange-700 hover:shadow-xl hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Уншиж
                  байна...
                </>
              ) : (
                <>
                  Тестийг дуусгах <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
