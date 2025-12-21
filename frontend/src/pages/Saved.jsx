import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Bookmark,
  Trash2,
  ChevronRight,
  Briefcase,
  Clock,
  Loader2,
  ExternalLink,
} from "lucide-react";
import api from "../api/axios";

export default function Saved() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/me/saved");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Хадгалсан мэдээлэл ачаалж чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/users/me/saved/${id}`);
      toast.success("Жагсаалтаас устгагдлаа");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      toast.error("Устгах үед алдаа гарлаа.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF8] py-16 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Миний <span className="text-orange-500">Хадгалсан</span>
            </h1>
            <p className="text-slate-500 font-medium">
              Таны сонирхож буй мэргэжлүүдийн цуглуулга
            </p>
          </div>
          <div className="bg-orange-100 text-orange-600 px-4 py-2 rounded-2xl text-sm font-bold flex items-center gap-2">
            <Bookmark size={18} fill="currentColor" />
            Нийт {items.length} мэргэжил
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-40 bg-orange-50/50 animate-pulse rounded-3xl border border-orange-100"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-orange-100 shadow-sm">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bookmark className="text-orange-200" size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Жагсаалт хоосон байна
            </h3>
            <p className="text-slate-500 mb-8">
              Танд одоогоор хадгалсан мэргэжил алга.
            </p>
            <Link
              to="/professions"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200"
            >
              Мэргэжил үзэх <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {items.map((item) => {
              const p = item.profession || {};
              return (
                <div
                  key={item._id}
                  className="group bg-white rounded-4xl border border-orange-100 p-6 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                          {p.category || "Салбар тодорхойгүй"}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-orange-200" />
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                        {p.name || "Мэргэжил"}
                      </h2>
                    </div>
                    {p.riasecCode && (
                      <div className="bg-orange-50 text-orange-600 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm">
                        {p.riasecCode}
                      </div>
                    )}
                  </div>

                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">
                    {p.descriptionShort ||
                      p.description ||
                      "Тайлбар байхгүй байна."}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-orange-50">
                    <Link
                      to={`/profession/${p._id}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-orange-600 transition-colors"
                    >
                      Үзэх <ExternalLink size={14} />
                    </Link>

                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={deletingId === item._id}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      title="Устгах"
                    >
                      {deletingId === item._id ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
