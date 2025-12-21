import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const RIASEC_OPTIONS = ["R", "I", "A", "S", "E", "C"];

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const toCommaList = (list) =>
  Array.isArray(list) ? list.filter(Boolean).join(", ") : "";

const parseCommaList = (value) =>
  String(value || "")
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

const emptyDraft = {
  name: "",
  category: "",
  riasecCode: "R",
  descriptionShort: "",
  descriptionLong: "",
  opportunities: "",
  salary: "",
  demand: "",
  duties: "",
  requirements: "",
  workEnvironment: "",
  skills: "",
};

export default function AdminProfessionsSection({ total, onRefreshSummary }) {
  const [professions, setProfessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [search, setSearch] = useState("");

  const fetchProfessions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/professions");
      setProfessions(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(getErrorMessage(e, "Мэргэжил ачаалж чадсангүй"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfessions();
  }, []);

  const filteredProfessions = useMemo(() => {
    const q = search.toLowerCase();
    return professions.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [professions, search]);

  const startEdit = (p) => {
    setEditingId(p._id);
    setDraft({
      name: p.name || "",
      category: p.category || "",
      riasecCode: p.riasecCode || p.riasecTypes?.[0] || "R",
      descriptionShort: p.descriptionShort || "",
      descriptionLong: p.descriptionLong || p.description || "",
      opportunities: p.opportunities || "",
      salary: p.salary || "",
      demand: p.demand || "",
      duties: p.duties || "",
      requirements: p.requirements || "",
      workEnvironment: p.workEnvironment || "",
      skills: toCommaList(p.skills),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft);
  };

  const saveProfession = async () => {
    try {
      await api.put(`/admin/professions/${editingId}`, {
        ...draft,
        skills: parseCommaList(draft.skills),
      });
      toast.success("Амжилттай хадгаллаа");
      cancelEdit();
      fetchProfessions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Хадгалах үед алдаа гарлаа"));
    }
  };

  const addProfession = async () => {
    if (!draft.name.trim() || !draft.category.trim()) {
      toast.error("Нэр болон ангилал заавал байна");
      return;
    }
    try {
      await api.post("/admin/professions", {
        ...draft,
        skills: parseCommaList(draft.skills),
      });
      toast.success("Амжилттай нэмлээ");
      setDraft(emptyDraft);
      fetchProfessions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Нэмэх үед алдаа гарлаа"));
    }
  };

  const deleteProfession = async (id) => {
    if (!window.confirm("Энэ мэргэжлийг устгах уу?")) return;
    try {
      await api.delete(`/admin/professions/${id}`);
      toast.success("Амжилттай устгалаа");
      fetchProfessions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Устгах үед алдаа гарлаа"));
    }
  };

  const totalDisplay = total ?? professions.length;
  const isEditing = Boolean(editingId);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800">
          Мэргэжлийн удирдлага
        </h3>
        <span className="text-sm text-gray-500">Нийт: {totalDisplay}</span>
      </div>

      {/* FORM */}
      <div
        className={`bg-white border rounded-xl shadow-sm p-6 space-y-4 ${
          isEditing ? "border-orange-300" : "border-orange-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-gray-800">
            {isEditing ? "Мэргэжил засах" : "Шинэ мэргэжил нэмэх"}
          </h4>
          {isEditing && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">
              Засаж байна
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="input-base"
            placeholder="Нэр"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <input
            className="input-base"
            placeholder="Ангилал"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
          />
          <select
            className="input-base"
            value={draft.riasecCode}
            onChange={(e) => setDraft({ ...draft, riasecCode: e.target.value })}
          >
            {RIASEC_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <input
            className="input-base"
            placeholder="Ур чадвар (таслалаар)"
            value={draft.skills}
            onChange={(e) => setDraft({ ...draft, skills: e.target.value })}
          />
          <input
            className="input-base"
            placeholder="Цалин"
            value={draft.salary}
            onChange={(e) => setDraft({ ...draft, salary: e.target.value })}
          />
          <input
            className="input-base"
            placeholder="Эрэлт"
            value={draft.demand}
            onChange={(e) => setDraft({ ...draft, demand: e.target.value })}
          />
        </div>
        <div className="flex gap-5">
          <textarea
            className="textarea-base"
            placeholder="Богино тайлбар"
            value={draft.descriptionShort}
            onChange={(e) =>
              setDraft({ ...draft, descriptionShort: e.target.value })
            }
          />
          <textarea
            className="textarea-base min-h-30"
            placeholder="Дэлгэрэнгүй тайлбар"
            value={draft.descriptionLong}
            onChange={(e) =>
              setDraft({ ...draft, descriptionLong: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <textarea
            className="textarea-base"
            placeholder="Ажлын байрны үүрэг"
            value={draft.duties}
            onChange={(e) => setDraft({ ...draft, duties: e.target.value })}
          />
          <textarea
            className="textarea-base"
            placeholder="Шаардлага"
            value={draft.requirements}
            onChange={(e) =>
              setDraft({ ...draft, requirements: e.target.value })
            }
          />
          <textarea
            className="textarea-base"
            placeholder="Боломж"
            value={draft.opportunities}
            onChange={(e) =>
              setDraft({ ...draft, opportunities: e.target.value })
            }
          />
          <textarea
            className="textarea-base"
            placeholder="Ажлын орчин"
            value={draft.workEnvironment}
            onChange={(e) =>
              setDraft({ ...draft, workEnvironment: e.target.value })
            }
          />
        </div>

        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={saveProfession} className="btn-success">
                Хадгалах
              </button>
              <button onClick={cancelEdit} className="btn-secondary">
                Болих
              </button>
            </>
          ) : (
            <button onClick={addProfession} className="btn-primary">
              Нэмэх
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-orange-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 flex justify-between items-center">
          <h4 className="font-semibold text-gray-800">Мэргэжлийн жагсаалт</h4>
          <input
            className="input-base w-64"
            placeholder="Нэр / Ангиллаар хайх…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="min-w-full text-sm text-gray-800">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Нэр</th>
              <th className="px-4 py-3 text-left">Ангилал</th>
              <th className="px-4 py-3 text-left">RIASEC</th>
              <th className="px-4 py-3 text-left">Цалин</th>
              <th className="px-4 py-3 text-left">Эрэлт</th>
              <th className="px-4 py-3 text-left">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Ачаалж байна...
                </td>
              </tr>
            )}

            {!loading && filteredProfessions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-400"
                >
                  Мэдээлэл олдсонгүй
                </td>
              </tr>
            )}

            {!loading &&
              filteredProfessions.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-orange-50/40 transition"
                >
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                      {p.riasecCode || p.riasecTypes?.[0] || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{p.salary || "-"}</td>
                  <td className="px-4 py-3">{p.demand || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="btn-info btn-sm"
                      >
                        Засах
                      </button>
                      <button
                        onClick={() => deleteProfession(p._id)}
                        className="btn-danger btn-sm"
                      >
                        Устгах
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
