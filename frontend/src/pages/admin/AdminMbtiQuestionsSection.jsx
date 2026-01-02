import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Check, X } from "lucide-react";
import api from "../../api/axios";

const DIMENSION_OPTIONS = ["EI", "SN", "TF", "JP"];
const DEFAULT_TRAITS = {
  EI: { left: "E", right: "I" },
  SN: { left: "S", right: "N" },
  TF: { left: "T", right: "F" },
  JP: { left: "J", right: "P" },
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const buildTraits = (dimension, left, right) => {
  const defaults = DEFAULT_TRAITS[dimension] || { left: "", right: "" };
  return {
    traitLeft: (left || defaults.left || "").toUpperCase(),
    traitRight: (right || defaults.right || "").toUpperCase(),
  };
};

const parseTags = (value) =>
  value
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const getOptionLabel = (options, index) => {
  if (!Array.isArray(options)) return "";
  const option = options[index];
  if (!option) return "";
  if (typeof option === "string") return option;
  if (typeof option === "object") {
    return option.label || option.text || option.name || "";
  }
  return "";
};

const emptyQuestion = {
  name: "",
  prompt: "",
  dimension: "EI",
  traitLeft: "E",
  traitRight: "I",
  descriptionShort: "",
  descriptionLong: "",
  optionLeft: "",
  optionRight: "",
  tags: "",
  version: 1,
  isActive: true,
};

export default function AdminMbtiQuestionsSection({ total, onRefreshSummary }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(emptyQuestion);
  const [newQuestion, setNewQuestion] = useState(emptyQuestion);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/mbti/questions");
      setQuestions(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(
        getErrorMessage(e, "MBTI асуултуудыг татаж чадсангүй.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const startEdit = (q) => {
    const dimension = String(q.dimension || "EI").toUpperCase();
    const traits = buildTraits(dimension, q.traitLeft, q.traitRight);
    setEditingId(q._id);
    setDraft({
      name: q.name || "",
      prompt: q.prompt || "",
      dimension,
      traitLeft: traits.traitLeft,
      traitRight: traits.traitRight,
      descriptionShort: q.descriptionShort || "",
      descriptionLong: q.descriptionLong || "",
      optionLeft: getOptionLabel(q.options, 0),
      optionRight: getOptionLabel(q.options, 1),
      tags: Array.isArray(q.tags) ? q.tags.join(", ") : "",
      version: q.version ?? 1,
      isActive: q.isActive ?? true,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyQuestion);
  };

  const buildPayload = (source) => {
    const traits = buildTraits(source.dimension, source.traitLeft, source.traitRight);
    const options = [];
    if (source.optionLeft?.trim()) {
      options.push({
        label: source.optionLeft.trim(),
        value: traits.traitLeft,
      });
    }
    if (source.optionRight?.trim()) {
      options.push({
        label: source.optionRight.trim(),
        value: traits.traitRight,
      });
    }

    return {
      name: source.name,
      prompt: source.prompt,
      dimension: source.dimension,
      traitLeft: traits.traitLeft,
      traitRight: traits.traitRight,
      descriptionShort: source.descriptionShort,
      descriptionLong: source.descriptionLong,
      options,
      tags: parseTags(source.tags || ""),
      version: Number(source.version) || 1,
      isActive: Boolean(source.isActive),
      category: "MBTI",
    };
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/admin/mbti/questions/${id}`, buildPayload(draft));
      toast.success("MBTI асуулт шинэчлэгдлээ.");
      cancelEdit();
      fetchQuestions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Шинэчлэх үед алдаа гарлаа."));
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Энэ MBTI асуултыг устгах уу?")) return;
    try {
      await api.delete(`/admin/mbti/questions/${id}`);
      toast.success("MBTI асуулт устлаа.");
      fetchQuestions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Устгах үед алдаа гарлаа."));
    }
  };

  const addQuestion = async () => {
    if (!newQuestion.prompt.trim()) {
      toast.error("Асуултын текст оруулна уу.");
      return;
    }
    try {
      await api.post("/admin/mbti/questions", buildPayload(newQuestion));
      toast.success("MBTI асуулт нэмэгдлээ.");
      setNewQuestion(emptyQuestion);
      fetchQuestions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Нэмэх үед алдаа гарлаа."));
    }
  };

  const totalDisplay = total ?? questions.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">MBTI асуултууд</h3>
        <span className="text-sm text-gray-500">Нийт: {totalDisplay}</span>
      </div>

      <div className="bg-white border border-orange-100 rounded-xl shadow-sm p-6 space-y-4">
        <h4 className="font-semibold text-gray-800">
          {editingId ? "MBTI асуулт засах" : "Шинэ MBTI асуулт нэмэх"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={editingId ? draft.name : newQuestion.name}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, name: e.target.value }))
                : setNewQuestion((p) => ({ ...p, name: e.target.value }))
            }
            placeholder="Нэр"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <select
            value={editingId ? draft.dimension : newQuestion.dimension}
            onChange={(e) => {
              const dimension = e.target.value;
              const traits = DEFAULT_TRAITS[dimension] || {
                left: "",
                right: "",
              };
              if (editingId) {
                setDraft((p) => ({
                  ...p,
                  dimension,
                  traitLeft: traits.left,
                  traitRight: traits.right,
                }));
              } else {
                setNewQuestion((p) => ({
                  ...p,
                  dimension,
                  traitLeft: traits.left,
                  traitRight: traits.right,
                }));
              }
            }}
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {DIMENSION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <input
            value={editingId ? draft.traitLeft : newQuestion.traitLeft}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, traitLeft: e.target.value }))
                : setNewQuestion((p) => ({ ...p, traitLeft: e.target.value }))
            }
            placeholder="Trait Left (E/S/T/J)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            value={editingId ? draft.traitRight : newQuestion.traitRight}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, traitRight: e.target.value }))
                : setNewQuestion((p) => ({ ...p, traitRight: e.target.value }))
            }
            placeholder="Trait Right (I/N/F/P)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <textarea
          value={editingId ? draft.prompt : newQuestion.prompt}
          onChange={(e) =>
            editingId
              ? setDraft((p) => ({ ...p, prompt: e.target.value }))
              : setNewQuestion((p) => ({ ...p, prompt: e.target.value }))
          }
          placeholder="Асуултын текст"
          className="w-full border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[90px]"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <textarea
            value={editingId ? draft.descriptionShort : newQuestion.descriptionShort}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, descriptionShort: e.target.value }))
                : setNewQuestion((p) => ({
                    ...p,
                    descriptionShort: e.target.value,
                  }))
            }
            placeholder="Тайлбар (богино)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[80px]"
          />
          <textarea
            value={editingId ? draft.descriptionLong : newQuestion.descriptionLong}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, descriptionLong: e.target.value }))
                : setNewQuestion((p) => ({
                    ...p,
                    descriptionLong: e.target.value,
                  }))
            }
            placeholder="Тайлбар (дэлгэрэнгүй)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            value={editingId ? draft.optionLeft : newQuestion.optionLeft}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, optionLeft: e.target.value }))
                : setNewQuestion((p) => ({ ...p, optionLeft: e.target.value }))
            }
            placeholder="Сонголт 1 (Trait Left)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            value={editingId ? draft.optionRight : newQuestion.optionRight}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, optionRight: e.target.value }))
                : setNewQuestion((p) => ({ ...p, optionRight: e.target.value }))
            }
            placeholder="Сонголт 2 (Trait Right)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={editingId ? draft.tags : newQuestion.tags}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, tags: e.target.value }))
                : setNewQuestion((p) => ({ ...p, tags: e.target.value }))
            }
            placeholder="Тагууд (таслал эсвэл шинэ мөрөөр)"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="number"
            value={editingId ? draft.version : newQuestion.version}
            onChange={(e) =>
              editingId
                ? setDraft((p) => ({ ...p, version: e.target.value }))
                : setNewQuestion((p) => ({ ...p, version: e.target.value }))
            }
            placeholder="Хувилбар"
            className="border rounded-lg px-3 py-2 text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={editingId ? draft.isActive : newQuestion.isActive}
              onChange={(e) =>
                editingId
                  ? setDraft((p) => ({ ...p, isActive: e.target.checked }))
                  : setNewQuestion((p) => ({
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
              onClick={addQuestion}
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
              <th className="px-4 py-3 text-left">Нэр / Асуулт</th>
              <th className="px-4 py-3 text-left w-28">Хэмжээс</th>
              <th className="px-4 py-3 text-left w-28">Trait</th>
              <th className="px-4 py-3 text-left w-24">Идэвх</th>
              <th className="px-4 py-3 text-right w-32">Үйлдэл</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Татаж байна...
                </td>
              </tr>
            )}
            {!loading && questions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  MBTI асуулт байхгүй байна.
                </td>
              </tr>
            )}
            {!loading &&
              questions.map((q) => (
                <tr key={q._id} className="border-t hover:bg-orange-50/30">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">
                      {q.name || "-"}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {q.prompt}
                    </div>
                  </td>
                  <td className="px-4 py-3">{q.dimension}</td>
                  <td className="px-4 py-3">
                    {q.traitLeft}/{q.traitRight}
                  </td>
                  <td className="px-4 py-3">
                    {q.isActive ? "Тийм" : "Үгүй"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => startEdit(q)}
                        className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => deleteQuestion(q._id)}
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
