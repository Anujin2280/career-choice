import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ mail: "", nuuts_ug: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));

    if (res.meta.requestStatus === "fulfilled") {
      const user = res.payload.user;
      if (user?.role_id === 1) {
        navigate("/admin");
      } else {
        navigate("/profile");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-white relative overflow-hidden font-sans">
      {/* Background Shapes (Зураг дээрх шиг дугуй дүрсүүд) */}
      <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-orange-50/50 -z-10"></div>
      <div className="absolute right-0 bottom-0 w-full h-[50%] bg-orange-50/30 rounded-t-full -z-10"></div>

      <div className="relative flex flex-col md:flex-row items-center justify-center w-full max-w-7xl px-6 gap-12">
        {/* Login Card (Glassmorphism Effect) */}
        <div className="relative w-full max-w-md bg-[#F5D5B9]/70 backdrop-blur-md p-10 md:p-14 rounded-[2.5rem] shadow-xl border border-white/40">
          {/* Close Button (X) */}
          <button
            onClick={() => navigate("/")}
            className="absolute -top-3 -right-3 w-10 h-10 bg-[#E67E43] rounded-xl flex items-center justify-center text-white text-xl font-bold hover:bg-orange-600 transition-all hover:rotate-90 shadow-lg"
          >
            ✕
          </button>

          <h2 className="text-4xl font-black text-center text-slate-800 mb-10 tracking-tight">
            Нэвтрэх
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                placeholder="Нэвтрэх нэр"
                value={form.mail}
                onChange={(e) => setForm({ ...form, mail: e.target.value })}
                className="w-full bg-transparent border-b-2 border-slate-400/50 py-3 focus:outline-none text-slate-800 placeholder:text-slate-500 transition-colors focus:border-[#E67E43]"
              />
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Нууц үг"
                value={form.nuuts_ug}
                onChange={(e) => setForm({ ...form, nuuts_ug: e.target.value })}
                className="w-full bg-transparent border-b-2 border-slate-400/50 py-3 focus:outline-none text-slate-800 placeholder:text-slate-500 transition-colors focus:border-[#E67E43]"
              />
              <p className="text-xs text-slate-600 text-right mt-3 hover:text-[#E67E43] cursor-pointer transition-colors">
                Нууц үгээ мартсан уу?
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E67E43] hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-700/20 active:scale-95 disabled:opacity-70"
            >
              {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
            </button>

            {error && (
              <p className="text-red-500 text-sm text-center font-bold">
                {error}
              </p>
            )}
          </form>

          <p className="text-center text-sm text-slate-800 mt-8 font-medium">
            Хараахан бүртгүүлээгүй байна уу?{" "}
            <Link
              to="/register"
              className="text-[#E67E43] font-bold hover:underline ml-1"
            >
              Бүртгүүлэх
            </Link>
          </p>
        </div>

        {/* Right Side Image & Elements */}
        <div className="hidden md:flex flex-col items-center relative">
          <img
            src="/career-hero.png"
            alt="Career Guidance"
            className="max-w-md lg:max-w-lg object-contain relative z-10"
          />
          {/* Зураг дээрх нэмэлт элементүүдийг илэрхийлэх жижиг дүрсүүд (Floating elements) */}
          <div className="absolute top-10 right-0 w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center animate-bounce -z-10">
            📊
          </div>
          <div className="absolute bottom-20 left-0 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse -z-10">
            💡
          </div>
        </div>
      </div>
    </div>
  );
}
