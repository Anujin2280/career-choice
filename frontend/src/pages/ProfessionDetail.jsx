import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  DollarSign,
  TrendingUp,
  Sun,
  Star,
  CheckCircle2,
  Bookmark,
  Share2,
  MapPin,
  Loader2,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../api/axios";

export default function ProfessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [profession, setProfession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfession = async () => {
      try {
        const res = await api.get(`/professions/${id}`);
        setProfession(res.data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Мэдээлэл татахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };
    fetchProfession();
  }, [id]);

  const handleSave = async () => {
    if (!token) {
      toast.error("Хадгалахын тулд нэвтэрнэ үү.");
      return;
    }
    try {
      await api.post("/users/me/saved", { professionId: id });
      toast.success("Мэргэжлийг хадгаллаа.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Хадгалах үед алдаа гарлаа.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <span className="text-gray-500 font-medium">Ачааллаж байна...</span>
      </div>
    );
  }

  if (!profession) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 bg-gray-50">
        Мэргэжил олдсонгүй.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors font-medium"
          >
            <div className="p-2 bg-white rounded-full shadow-sm border border-gray-100 group-hover:border-orange-200">
              <ArrowLeft size={18} />
            </div>
            Буцах
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                  {profession.category}
                </span>
                {profession.riasecCode && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                    RIASEC: {profession.riasecCode}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                {profession.name}
              </h1>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {profession.descriptionShort ||
                  profession.description ||
                  "Тайлбар оруулаагүй байна."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-200"
                >
                  <Bookmark size={20} /> Хадгалах
                </button>
                <Link
                  to={token ? "/tests" : "/login"}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-gray-50 hover:text-orange-600 transition"
                >
                  <CheckCircle2 size={20} /> Тест өгөх
                </Link>
              </div>
            </div>

            {/* Detailed Description */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="text-orange-500" size={24} /> Дэлгэрэнгүй
                мэдээлэл
              </h3>
              <div className="prose prose-orange text-gray-600 leading-relaxed">
                <p>
                  {profession.descriptionLong ||
                    profession.descriptionShort ||
                    "Дэлгэрэнгүй мэдээлэл байхгүй байна."}
                </p>
              </div>

              {/* Duties */}
              {profession.duties && (
                <div className="mt-8">
                  <h4 className="font-bold text-gray-900 mb-3">
                    Ажлын байрны үндсэн үүрэг
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-5 text-gray-700 border border-gray-100">
                    {profession.duties}
                  </div>
                </div>
              )}

              {/* Requirements */}
              {profession.requirements && (
                <div className="mt-6">
                  <h4 className="font-bold text-gray-900 mb-3">
                    Тавигдах шаардлага
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-5 text-gray-700 border border-gray-100">
                    {profession.requirements}
                  </div>
                </div>
              )}
            </div>

            {/* RIASEC Explanation Section - Diagram Trigger */}
            {profession.riasecCode && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  RIASEC Загвар
                </h3>
                <p className="text-gray-600 mb-4">
                  Энэхүү мэргэжил нь дараах зан төлөвийн хэв шинжид тохирно.
                </p>
              </div>
            )}

            {/* Skills Section */}
            {profession.skills && profession.skills.length > 0 && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Шаардлагатай ур чадварууд
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profession.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 rounded-lg bg-orange-50 text-orange-700 text-sm font-medium border border-orange-100 hover:bg-orange-100 transition"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Sidebar Info */}
          <div className="space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Товч мэдээлэл
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Дундаж цалин
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {profession.salary || "Тодорхойгүй"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Эрэлт хэрэгцээ
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {profession.demand || "Тодорхойгүй"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <Star size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Хөгжих боломж
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {profession.opportunities || "Тодорхойгүй"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl">
                    <Sun size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">
                      Ажлын орчин
                    </p>
                    <p className="text-gray-900 font-semibold">
                      {profession.workEnvironment || "Тодорхойгүй"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggestion / Help Card */}
            <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-200">
              <h3 className="font-bold text-xl mb-2">Та эргэлзэж байна уу?</h3>
              <p className="text-orange-100 text-sm mb-4 leading-relaxed">
                Өөрийн зан төлөв, сонирхолд тохирох эсэхийг мэргэжлийн сэтгэл
                зүйн тестээр шалгаарай.
              </p>
              <Link
                to={token ? "/tests" : "/login"}
                className="block w-full text-center py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition"
              >
                Тест өгөх
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
