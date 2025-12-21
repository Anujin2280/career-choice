import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Search,
  Filter,
  Briefcase,
  Banknote,
  TrendingUp,
  Bookmark,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import api from "../api/axios";

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .trim();

export default function Professions() {
  const { token } = useSelector((state) => state.auth);
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchProfessions = async () => {
      setLoading(true);
      try {
        const res = await api.get("/professions");
        setProfessions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error("Мэргэжлийн мэдээлэл ачаалж чадсангүй.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfessions();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(professions.map((p) => p.category).filter(Boolean));
    return ["all", ...Array.from(set)];
  }, [professions]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return professions.filter((p) => {
      const matchesQuery = q
        ? normalize(p.name).includes(q) || normalize(p.category).includes(q)
        : true;
      const matchesCategory =
        category === "all" ? true : p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [professions, query, category]);

  const handleSave = async (id) => {
    if (!token) return toast.error("Хадгалахын тулд нэвтэрнэ үү.");
    setSavingId(id);
    try {
      await api.post("/users/me/saved", { professionId: id });
      toast.success("Мэргэжлийг хадгаллаа.");
    } catch (err) {
      toast.error("Хадгалах үед алдаа гарлаа.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF8] pb-20">
      {/* Header & Filter Section */}
      <div className="bg-white border-b border-orange-100 pt-16 pb-10 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                Карьер хөтөч
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Мэргэжлийн <span className="text-orange-500">Сан</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Өөрийн сонирхолд нийцэх{" "}
                <span className="text-orange-600 font-bold">
                  {filtered.length}
                </span>{" "}
                мэргэжлийг оллоо
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative group flex-1 sm:w-80">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 group-focus-within:text-orange-600 transition-colors"
                  size={20}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Мэргэжил хайх..."
                  className="w-full pl-12 pr-4 py-3.5 bg-orange-50/50 text-black border-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-orange-500/30 focus:outline-none transition-all shadow-sm"
                />
              </div>

              <div className="relative flex-1 sm:w-64">
                <Filter
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400"
                  size={18}
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 bg-orange-50/50 border-2 border-transparent rounded-2xl text-sm appearance-none focus:bg-white focus:border-orange-500/30 focus:outline-none transition-all cursor-pointer font-medium text-slate-700 shadow-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "all" ? "Бүх салбар" : c}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-72 bg-orange-50/50 animate-pulse rounded-[2.5rem] border border-orange-100"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-orange-100 shadow-inner">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="text-orange-300" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Илэрц олдсонгүй
            </h3>
            <p className="text-slate-500">
              Таны хайсан мэргэжил одоогоор манай санд байхгүй байна. <br />
              Өөр түлхүүр үгээр хайж үзнэ үү.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {filtered.map((p) => (
              <ProfessionCard
                key={p._id}
                p={p}
                onSave={handleSave}
                isSaving={savingId === p._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfessionCard({ p, onSave, isSaving }) {
  return (
    <div className="group bg-white rounded-[2.5rem] border border-orange-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-orange-200/40 hover:-translate-y-1.5 transition-all duration-500 relative overflow-hidden">
      {/* Decoration Circle */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-50 rounded-full group-hover:bg-orange-100 transition-colors duration-500" />

      <div className="relative">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className="inline-block px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-widest">
              {p.category}
            </span>
            <h2 className="text-2xl font-black text-slate-900 group-hover:text-orange-600 transition-colors">
              {p.name}
            </h2>
          </div>
          <div className="bg-white w-12 h-12 rounded-2xl shadow-sm border border-orange-100 flex items-center justify-center text-orange-500 font-black text-lg">
            {p.riasecCode || "R"}
          </div>
        </div>

        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">
          {p.descriptionShort ||
            p.description ||
            "Энэхүү мэргэжлийн дэлгэрэнгүй тайлбар, шаардагдах ур чадвар болон бусад мэдээлэл тун удахгүй нэмэгдэх болно."}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <Banknote size={20} />
            </div>
            <div>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter">
                Дундаж цалин
              </p>
              <p className="text-sm font-black text-slate-800">
                {p.salary || "Тодорхойгүй"}
              </p>
            </div>
          </div>
          <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-tighter">
                Зах зээлийн эрэлт
              </p>
              <p className="text-sm font-black text-slate-800">
                {p.demand || "Хэвийн"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-orange-50">
          <Link
            to={`/profession/${p._id}`}
            className="group/btn flex items-center gap-2 text-sm font-black text-orange-600 hover:text-orange-700 transition-colors"
          >
            Дэлгэрэнгүй үзэх
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
              <ChevronRight size={14} />
            </div>
          </Link>

          <button
            onClick={() => onSave(p._id)}
            disabled={isSaving}
            className={`p-3 rounded-2xl border-2 transition-all duration-300 ${
              isSaving
                ? "bg-orange-100 border-orange-100"
                : "border-orange-50 hover:border-orange-200 bg-orange-50/30 text-orange-400 hover:text-orange-600 hover:bg-orange-50 shadow-sm"
            }`}
            title="Хадгалах"
          >
            {isSaving ? (
              <Loader2 size={20} className="animate-spin text-orange-600" />
            ) : (
              <Bookmark size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
