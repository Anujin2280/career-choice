import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Pencil, Trash2, Check, X } from "lucide-react";
import api from "../../api/axios";

const RIASEC_OPTIONS = ["R", "I", "A", "S", "E", "C"];

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export default function AdminQuestionsSection({ total, onRefreshSummary }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ text: "", category: "R" });
  const [newQuestion, setNewQuestion] = useState({ text: "", category: "R" });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/questions");
      setQuestions(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(getErrorMessage(e, "Асуулт ачаалж чадсангүй"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const startEdit = (q) => {
    setEditingId(q._id);
    setDraft({ text: q.text || "", category: q.category || "R" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ text: "", category: "R" });
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/admin/questions/${id}`, draft);
      toast.success("Асуулт шинэчлэгдлээ");
      cancelEdit();
      fetchQuestions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Засахад алдаа гарлаа"));
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Энэ асуултыг устгах уу?")) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      toast.success("Устгалаа");
      fetchQuestions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Устгахад алдаа гарлаа"));
    }
  };

  const addQuestion = async () => {
    if (!newQuestion.text.trim()) {
      toast.error("Асуултын текст заавал байна");
      return;
    }
    try {
      await api.post("/admin/questions", newQuestion);
      toast.success("Шинэ асуулт нэмэгдлээ");
      setNewQuestion({ text: "", category: "R" });
      fetchQuestions();
      onRefreshSummary?.();
    } catch (e) {
      toast.error(getErrorMessage(e, "Нэмэхэд алдаа гарлаа"));
    }
  };

  const totalDisplay = total ?? questions.length;

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          Асуултын удирдлага
        </h3>
        <span className="text-sm text-gray-500">Нийт: {totalDisplay}</span>
      </div>

      {/* ADD QUESTION */}
      <div className="bg-white border border-orange-100 rounded-xl shadow-sm p-6">
        <h4 className="font-semibold text-gray-800 mb-4">Шинэ асуулт нэмэх</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            value={newQuestion.text}
            onChange={(e) =>
              setNewQuestion((p) => ({ ...p, text: e.target.value }))
            }
            placeholder="Асуултын текст..."
            className="
              md:col-span-2
              border rounded-lg px-3 py-2
              text-gray-800 placeholder-gray-400
              bg-white
              focus:outline-none focus:ring-2 focus:ring-orange-400
            "
          />

          <select
            value={newQuestion.category}
            onChange={(e) =>
              setNewQuestion((p) => ({ ...p, category: e.target.value }))
            }
            className="
              border rounded-lg px-3 py-2
              text-gray-800 bg-white
              focus:outline-none focus:ring-2 focus:ring-orange-400
            "
          >
            {RIASEC_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <button
            onClick={addQuestion}
            className="rounded-lg bg-orange-500 px-4 py-2 text-white hover:bg-orange-600"
          >
            + Нэмэх
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-orange-100 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left">Асуулт</th>
              <th className="px-4 py-3 text-left w-24">Төрөл</th>
              <th className="px-4 py-3 text-right w-40">Үйлдэл</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  Ачаалж байна...
                </td>
              </tr>
            )}

            {!loading && questions.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                  Асуулт байхгүй
                </td>
              </tr>
            )}

            {!loading &&
              questions.map((q) => {
                const isEdit = editingId === q._id;
                return (
                  <tr key={q._id} className="border-t hover:bg-orange-50/30">
                    <td className="px-4 py-3">
                      {isEdit ? (
                        <input
                          value={draft.text}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              text: e.target.value,
                            }))
                          }
                          className="
                            w-full
                            border rounded-lg px-2 py-1
                            text-gray-800 bg-white
                            focus:outline-none focus:ring-2 focus:ring-orange-400
                          "
                        />
                      ) : (
                        q.text
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {isEdit ? (
                        <select
                          value={draft.category}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              category: e.target.value,
                            }))
                          }
                          className="
                            border rounded px-2 py-1
                            text-gray-800 bg-white
                          "
                        >
                          {RIASEC_OPTIONS.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-block rounded-full bg-orange-100 px-2 py-0.5 text-orange-600 text-xs">
                          {q.category}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      {isEdit ? (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => saveEdit(q._id)}
                            className="p-2 rounded bg-green-500 text-white hover:bg-green-600"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
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
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
