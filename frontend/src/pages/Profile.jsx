import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Pencil,
  User,
  Mail,
  Phone,
  Shield,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { setUser } from "../redux/authSlice";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [form, setForm] = useState({
    ovog: user?.ovog || "",
    ner: user?.ner || "",
    mail: user?.mail || "",
    utas: user?.utas || "",
    role_id: user?.role_id ?? 0,
  });

  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await api.get("/users/me");
        dispatch(setUser(res.data));
        setForm({
          ovog: res.data.ovog || "",
          ner: res.data.ner || "",
          mail: res.data.mail || "",
          utas: res.data.utas || "",
          role_id: res.data.role_id ?? 0,
        });
      } catch (error) {
        toast.error("Мэдээлэл татахад алдаа гарлаа");
      }
    };
    fetchMe();
  }, [dispatch, token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/users/me", {
        ovog: form.ovog,
        ner: form.ner,
        mail: form.mail,
        utas: form.utas,
      });
      dispatch(setUser(res.data));
      setIsEditing(false);
      toast.success("Хувийн мэдээлэл шинэчлэгдлээ");
    } catch (error) {
      toast.error(error.response?.data?.message || "Хадгалах үед алдаа гарлаа");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.put("/users/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(setUser(res.data));
      toast.success("Профайл зураг шинэчлэгдлээ");
    } catch (error) {
      toast.error("Зураг хуулахад алдаа гарлаа");
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Миний Профайл
          </h1>
          <p className="text-slate-500">
            Та өөрийн хувийн мэдээллээ эндээс удирдаарай.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Avatar Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="relative group">
                <div
                  className={`w-32 h-32 rounded-3xl overflow-hidden border-4 border-orange-50 shadow-inner ${
                    avatarUploading ? "opacity-50" : ""
                  }`}
                >
                  <img
                    src={user?.avatar_url || "/avatar.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                {avatarUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                  </div>
                )}

                <label className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2.5 rounded-2xl cursor-pointer hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 group-hover:scale-110">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Camera size={18} />
                </label>
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  {user?.ner} {user?.ovog}
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider">
                  <Shield size={12} />
                  {user?.role_id === 1 ? "Администратор" : "Хэрэглэгч"}
                </div>
              </div>

              <div className="w-full mt-8 pt-6 border-t border-slate-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Бүртгүүлсэн</span>
                  <span className="text-slate-700 font-medium">2024.10.12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Тест өгсөн</span>
                  <span className="text-slate-700 font-medium">3 удаа</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-4xl p-8 shadow-sm border border-slate-100 h-full">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User size={20} className="text-orange-500" />
                  Хувийн мэдээлэл
                </h3>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-orange-600 font-bold text-sm bg-orange-50 px-4 py-2 rounded-xl hover:bg-orange-100 transition"
                  >
                    <Pencil size={16} /> Засах
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-slate-600"
                    >
                      Цуцлах
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      Хадгалах
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ProfileInput
                  label="Овог"
                  name="ovog"
                  value={form.ovog}
                  isEditing={isEditing}
                  onChange={handleChange}
                  icon={<User size={16} />}
                />
                <ProfileInput
                  label="Нэр"
                  name="ner"
                  value={form.ner}
                  isEditing={isEditing}
                  onChange={handleChange}
                  icon={<User size={16} />}
                />
                <ProfileInput
                  label="И-мэйл хаяг"
                  name="mail"
                  type="email"
                  value={form.mail}
                  isEditing={isEditing}
                  onChange={handleChange}
                  icon={<Mail size={16} />}
                />
                <ProfileInput
                  label="Утасны дугаар"
                  name="utas"
                  value={form.utas}
                  isEditing={isEditing}
                  onChange={handleChange}
                  icon={<Phone size={16} />}
                />
              </div>

              {/* Security Hint */}
              <div className="mt-10 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-3">
                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Таны мэдээлэл нууцлалын стандартын дагуу хадгалагдаж байна.
                  Нэвтрэх нууц үгээ үе үе шинэчилж байхыг зөвлөж байна.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
function ProfileInput({
  label,
  name,
  value,
  isEditing,
  onChange,
  type = "text",
  icon,
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div
        className={`relative flex items-center transition-all ${
          isEditing ? "scale-[1.01]" : ""
        }`}
      >
        <div className="absolute left-4 text-slate-400">{icon}</div>
        {isEditing ? (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-11 pr-4 py-3.5 text-slate-700 focus:border-orange-500/50 focus:outline-none transition-all shadow-sm"
          />
        ) : (
          <div className="w-full bg-slate-50/50 border-2 border-transparent rounded-2xl pl-11 pr-4 py-3.5 text-slate-800 font-semibold cursor-not-allowed">
            {value || "---"}
          </div>
        )}
      </div>
    </div>
  );
}
