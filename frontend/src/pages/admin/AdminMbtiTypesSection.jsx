import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Check, X } from "lucide-react";
import api from "../../api/axios";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const parseList = (value) =>
  value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const listToText = (items) =>
  Array.isArray(items) ? items.filter(Boolean).join("\n") : "";

const emptyType = {
  type: "",
  name: "",
  descriptionShort: "",
  descriptionLong: "",
  strengths: "",
  risks: "",
  bestWorkEnvironment: "",
  suggestedRoles: "",
  version: 1,
  isActive: true,
};

export default function AdminMbtiTypesSection({ total, onRefreshSummary }) {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyType);
  const [newType, setNewType] = useState(emptyType);

  const fetchTypes = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/mbti/types");
      setTypes(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(getErrorMessage(e, "MBTI төрлүүдийг татаж чадсангүй."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setDraft({
      type: item.type || "",
      name: item.name || "",
      descriptionShort: item.descriptionShort || "",
      descriptionLong: item.descriptionLong || "",
      strengths: listToText(item.strengths),
      risks: listToText(item.risks),
      bestWorkEnvironment: listToText(item.bestWorkEnvironment),
      suggestedRoles: listToText(item.suggestedRoles),
      version: item.version ?? 1,
      isActive: item.isActive ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyType);
  };

  const buildPayload = (source) => ({
    type: source.type,
    name: source.name,
    descriptionShort: source.descriptionShort,
    descriptionLong: source.descriptionLong,
    strengths: parseList(source.strengths || ""),
    risks: parseList(source.risks || ""),
    bestWorkEnvironment: parseList(source.bestWorkEnvironment || ""),
    suggestedRoles: parseList(source.suggestedRoles || ""),
    version: Number(source.version) || 1,
    isActive: Boolean(source.isActive),
  });

  const saveEdit = async (id) => {
    try {
      await api.put(`/admin/mbti/types/${id}`, buildPayload(draft));
      toast.success("MBTI төрөл шинэчлэгдлээ.");
      cancelEdit();
      fetchTypes();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Шинэчлэх үед алдаа гарлаа."));
    }
  };

  const deleteType = async (id) => {
    if (!window.confirm("Энэ MBTI төрлийг устгах уу?")) return;
    try {
      await api.delete(`/admin/mbti/types/${id}`);
      toast.success("MBTI төрөл устлаа.");
      fetchTypes();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Устгах үед алдаа гарлаа."));
    }
  };

  const addType = async () => {
    if (!newType.type.trim() || !newType.name.trim()) {
      toast.error("MBTI код болон нэр шаардлагатай.");
      return;
    }
    try {
      await api.post("/admin/mbti/types", buildPayload(newType));
      toast.success("MBTI төрөл нэмэгдлээ.");
      setNewType(emptyType);
      fetchTypes();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Нэмэх үед алдаа гарлаа."));
    }
  };

  const totalDisplay = total ?? types.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">MBTI төрлүүд</h3>
        <span className="text-sm text-gray-500">Нийт: {totalDisplay}</span>
      </div>

      <div className="bg-white border border-orange-100 rounded-xl shadow-sm p-6 space-y-4">
        <h4 className="font-semibold text-gray-800">
          {editingId ? "MBTI төрөл засах" : "Шинэ MBTI төрөл нэмэх"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={editingId ? draft.type : newType.type}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, type: e.target.value }))
                : setNewType((p) => ({ ...p, type: e.target.value }))
            }
            placeholder="MBTI код (ж: ENFJ)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            value={editingId ? draft.name : newType.name}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, name: e.target.value }))
                : setNewType((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="Төрлийн нэр"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={editingId ? draft.descriptionShort : newType.descriptionShort}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, descriptionShort: e.target.value }))
                : setNewType((p) => ({
                    ...p,
                    descriptionShort: e.target.value,
                  }))
            }
            placeholder="Тайлбар (богино)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[80px]"
          />
          <textarea
            value={editingId ? draft.descriptionLong : newType.descriptionLong}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, descriptionLong: e.target.value }))
                : setNewType((p) => ({
                    ...p,
                    descriptionLong: e.target.value,
                  }))
            }
            placeholder="Тайлбар (дэлгэрэнгүй)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={editingId ? draft.strengths : newType.strengths}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, strengths: e.target.value }))
                : setNewType((p) => ({ ...p, strengths: e.target.value }))
            }
            placeholder="Давуу талууд (шинэ мөрөөр)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[90px]"
          />
          <textarea
            value={editingId ? draft.risks : newType.risks}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, risks: e.target.value }))
                : setNewType((p) => ({ ...p, risks: e.target.value }))
            }
            placeholder="Сорилтууд (шинэ мөрөөр)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[90px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={
              editingId ? draft.bestWorkEnvironment : newType.bestWorkEnvironment
            }
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({
                    ...p,
                    bestWorkEnvironment: e.target.value,
                  }))
                : setNewType((p) => ({
                    ...p,
                    bestWorkEnvironment: e.target.value,
                  }))
            }
            placeholder="Тохиромжтой орчин (шинэ мөрөөр)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[90px]"
          />
          <textarea
            value={editingId ? draft.suggestedRoles : newType.suggestedRoles}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, suggestedRoles: e.target.value }))
                : setNewType((p) => ({
                    ...p,
                    suggestedRoles: e.target.value,
                  }))
            }
            placeholder="Тохирох ажлын чиглэл (шинэ мөрөөр)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[90px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="number"
            value={editingId ? draft.version : newType.version}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, version: e.target.value }))
                : setNewType((p) => ({ ...p, version: e.target.value }))
            }
            placeholder="Хувилбар"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={editingId ? draft.isActive : newType.isActive}
              onChange={(e) =>
                editingId
                  ? setDraft((p) => ({ ...p, isActive: e.target.checked }))
                  : setNewType((p) => ({
                      ...p,
                      isActive: e.target.checked,
                    }))
              }
            />
            Идэвхтэй
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          {editingId ? (
            <>
              <button
                onClick={() => saveEdit(editingId)}
                className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
              >
                <Check size={16} className="inline-block mr-2" />
                Хадгалах
              </button>
              <button
                onClick={cancelEdit}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
              >
                <X size={16} className="inline-block mr-2" />
                Болих
              </button>
            </>
          ) : (
            <button
              onClick={addType}
              className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
            >
              + Нэмэх
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-orange-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Төрөл</th>
              <th className="px-4 py-3 text-left">Нэр</th>
              <th className="px-4 py-3 text-left w-24">Идэвх</th>
              <th className="px-4 py-3 text-right w-32">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Татаж байна...
                </td>
              </tr>
            )}
            {!loading && types.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  MBTI төрөл байхгүй байна.
                </td>
              </tr>
            )}
            {!loading &&
              types.map((item) => (
                <tr key={item._id} className="border-t hover:bg-orange-50/30">
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {item.type}
                  </td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">
                    {item.isActive ? "Тийм" : "Үгүй"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteType(item._id)}
                        className="p-2 rounded bg-red-500 text-white hover:bg-red-600"
                      >
                        <Trash2 size={16} />
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
