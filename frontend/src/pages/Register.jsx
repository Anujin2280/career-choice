import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    ovog: "",
    ner: "",
    mail: "",
    utas: "",
    nuuts_ug: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === "fulfilled") navigate("/profile");
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-white relative overflow-hidden font-sans">
      {/* Background Shapes (Арын чимэглэл дүрсүүд) */}
      <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-orange-50/50 -z-10"></div>
      <div className="absolute right-0 bottom-0 w-full h-[50%] bg-orange-50/30 rounded-t-full -z-10"></div>

      <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-6 gap-12">
        {/* Register Card (Glassmorphism Effect) */}
        <div className="relative w-full max-w-lg bg-[#F5D5B9]/70 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-white/40">
          {/* Close Button (X) */}
          <button
            onClick={() => navigate("/")}
            className="absolute -top-3 -right-3 w-10 h-10 bg-[#E67E43] rounded-xl flex items-center justify-center text-white text-xl font-bold hover:bg-orange-600 transition-all hover:rotate-90 shadow-lg"
          >
            ✕
          </button>

          <h2 className="text-4xl font-black text-center text-slate-800 mb-8 tracking-tight">
            Бүртгүүлэх
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Овог"
                value={form.ovog}
                onChange={(e) => setForm({ ...form, ovog: e.target.value })}
                className="w-full bg-transparent border-b-2 border-slate-400/50 py-2 focus:outline-none text-slate-800 placeholder:text-slate-500 transition-colors focus:border-[#E67E43]"
              />
              <input
                type="text"
                placeholder="Нэр"
                value={form.ner}
                onChange={(e) => setForm({ ...form, ner: e.target.value })}
                className="w-full bg-transparent border-b-2 border-slate-400/50 py-2 focus:outline-none text-slate-800 placeholder:text-slate-500 transition-colors focus:border-[#E67E43]"
              />
            </div>

            <input
              type="email"
              placeholder="И-мэйл"
              value={form.mail}
              onChange={(e) => setForm({ ...form, mail: e.target.value })}
              className="w-full bg-transparent border-b-2 border-slate-400/50 py-2 focus:outline-none text-slate-800 placeholder:text-slate-500 transition-colors focus:border-[#E67E43]"
            />

            <input
              type="tel"
              placeholder="Утасны дугаар"
              value={form.utas}
              onChange={(e) => setForm({ ...form, utas: e.target.value })}
              className="w-full bg-transparent border-b-2 border-slate-400/50 py-2 focus:outline-none text-slate-800 placeholder:text-slate-500 transition-colors focus:border-[#E67E43]"
            />

            <input
              type="password"
              placeholder="Нууц үг"
              value={form.nuuts_ug}
              onChange={(e) => setForm({ ...form, nuuts_ug: e.target.value })}
              className="w-full bg-transparent border-b-2 border-slate-400/50 py-2 focus:outline-none text-slate-800 placeholder:text-slate-500 transition-colors focus:border-[#E67E43]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#E67E43] hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-700/20 active:scale-95 disabled:opacity-70"
            >
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center font-bold">
                {error}
              </p>
            )}
          </form>

          <p className="text-center text-sm text-slate-800 mt-8 font-medium">
            Аль хэдийн бүртгэлтэй юу?{" "}
            <Link
              to="/login"
              className="text-[#E67E43] font-bold hover:underline ml-1"
            >
              Нэвтрэх
            </Link>
          </p>
        </div>

        {/* Right Side Image Section */}
        <div className="hidden md:flex flex-col items-center relative">
          <img
            src="/career-hero.png"
            alt="Career Guidance"
            className="max-w-md lg:max-w-lg object-contain relative z-10"
          />
          {/* Floating decorative icons (Зураг дээрх жижиг дүрсүүд) */}
          <div className="absolute top-10 right-0 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce -z-10">
            📝
          </div>
          <div className="absolute bottom-20 left-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse -z-10">
            ✨
          </div>
        </div>
      </div>
    </div>
  );
}
