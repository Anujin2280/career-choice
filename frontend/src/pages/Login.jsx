import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
  
    if (res.meta.requestStatus === "fulfilled") {
      const user = res.payload.user;
  
      // ✅ Хэрэглэгчийн role шалгах
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  };
  

  return (
    <div className="flex flex-col md:flex-row justify-between items-center min-h-screen bg-white relative overflow-hidden">

      {/* Зүүн талын нэвтрэх хайрцаг */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 md:px-0">
        <div className="bg-[#FBEFE6] p-10 rounded-2xl shadow-md w-full max-w-sm relative">
          {/* Хаах товч */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-5 text-white text-3xl font-extrabold hover:text-black transition-transform hover:scale-125"
          >
            X
          </button>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Нэвтрэх</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Нэвтрэх нэр"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent border-b border-gray-400 py-2 focus:outline-none text-gray-700"
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Нууц үг"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent border-b border-gray-400 py-2 focus:outline-none text-gray-700"
              />
              <p className="text-sm text-gray-600 text-right mt-1 hover:text-orange-600 cursor-pointer">
                Нууц үгээ мартсан уу?
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-md font-semibold transition"
            >
              {loading ? "Нэвтэрч байна..." : "Нэвтрэх"}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <p className="text-center text-sm text-gray-700 mt-4">
            Хараахан бүртгүүлээгүй байна уу?{" "}
            <Link to="/register" className="text-orange-500 font-semibold hover:underline">
              Бүртгүүлэх
            </Link>
          </p>
        </div>
      </div>

      {/* Баруун талын зураг */}
      <div className="hidden md:flex w-1/2 justify-center items-center relative">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-orange-50 -z-10"></div>
        <img
          src="/career-hero.png"
          alt="Career woman illustration"
          className="max-w-[500px] md:max-w-[550px] object-contain relative z-10"
        />
      </div>
    </div>
  );
}
