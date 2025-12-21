import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("mn-MN");
};

export default function AdminUsersSection({ total, onRefreshSummary }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userDraft, setUserDraft] = useState({
    ovog: "",
    ner: "",
    mail: "",
    utas: "",
    role_id: 0,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Хэрэглэгчдийн мэдээлэл ачаалж чадсангүй.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setUserDraft({
      ovog: user.ovog || "",
      ner: user.ner || "",
      mail: user.mail || "",
      utas: user.utas || "",
      role_id: user.role_id ?? 0,
    });
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
    setUserDraft({ ovog: "", ner: "", mail: "", utas: "", role_id: 0 });
  };

  const saveUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}`, {
        ovog: userDraft.ovog,
        ner: userDraft.ner,
        mail: userDraft.mail,
        utas: userDraft.utas,
        role_id: userDraft.role_id,
      });
      toast.success("Амжилттай засагдлаа.");
      cancelEditUser();
      fetchUsers();
      onRefreshSummary?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Хэрэглэгч засахад алдаа гарлаа."));
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Энэ хэрэглэгчийг устгах уу?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("Амжилттай устгалаа.");
      fetchUsers();
      onRefreshSummary?.();
    } catch (error) {
      toast.error(getErrorMessage(error, "Хэрэглэгч устгахад алдаа гарлаа."));
    }
  };

  const totalDisplay = total ?? users.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Хэрэглэгчид</h3>
        <span className="text-sm text-gray-500">Нийт: {totalDisplay}</span>
      </div>

      <div className="bg-white border border-orange-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-orange-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Овог</th>
                <th className="text-left px-4 py-3">Нэр</th>
                <th className="text-left px-4 py-3">И-мэйл</th>
                <th className="text-left px-4 py-3">Утас</th>
                <th className="text-left px-4 py-3">Төрөл</th>
                <th className="text-left px-4 py-3">Огноо</th>
                <th className="text-left px-4 py-3">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-4 text-gray-500" colSpan={8}>
                    Ачааллаж байна...
                  </td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td className="px-4 py-4 text-gray-500" colSpan={8}>
                    Мэдээлэл алга.
                  </td>
                </tr>
              )}
              {!loading &&
                users.map((user) => {
                  const isEditing = editingUserId === user._id;
                  return (
                    <tr key={user._id} className="border-t">
                      <td className="px-4 py-3 text-gray-700">
                        {user.user_id}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={userDraft.ovog}
                            onChange={(e) =>
                              setUserDraft((prev) => ({
                                ...prev,
                                ovog: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          user.ovog
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={userDraft.ner}
                            onChange={(e) =>
                              setUserDraft((prev) => ({
                                ...prev,
                                ner: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          user.ner
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={userDraft.mail}
                            onChange={(e) =>
                              setUserDraft((prev) => ({
                                ...prev,
                                mail: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          user.mail
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <input
                            className="w-full border rounded px-2 py-1"
                            value={userDraft.utas}
                            onChange={(e) =>
                              setUserDraft((prev) => ({
                                ...prev,
                                utas: e.target.value,
                              }))
                            }
                          />
                        ) : (
                          user.utas
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <select
                            className="w-full border rounded px-2 py-1"
                            value={userDraft.role_id}
                            onChange={(e) =>
                              setUserDraft((prev) => ({
                                ...prev,
                                role_id: Number(e.target.value),
                              }))
                            }
                          >
                            <option value={0}>Хэрэглэгч</option>
                            <option value={1}>Админ</option>
                          </select>
                        ) : user.role_id === 1 ? (
                          "Админ"
                        ) : (
                          "Хэрэглэгч"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(user.uusgesen_ognoo)}
                      </td>
                      <td className="px-4 py-3">
                        {isEditing ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveUser(user._id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            >
                              Хадгалах
                            </button>
                            <button
                              onClick={cancelEditUser}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded"
                            >
                              Болих
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEditUser(user)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                            >
                              Засах
                            </button>
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                            >
                              Устгах
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
    </div>
  );
}
