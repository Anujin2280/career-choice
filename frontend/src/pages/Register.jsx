import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(registerUser(form));
    if (res.meta.requestStatus === "fulfilled") navigate("/profile");
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center min-h-screen bg-white relative overflow-hidden">

      {/* Зүүн тал */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 md:px-0">
        <div className="bg-[#FBEFE6] p-10 rounded-2xl shadow-md w-full max-w-sm relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-5 text-white text-3xl font-extrabold hover:text-black transition-transform hover:scale-125"
          >
            X
          </button>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Бүртгүүлэх</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Нэр"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-transparent border-b border-gray-400 py-2 focus:outline-none text-gray-700"
            />
            <input
              type="email"
              placeholder="Имэйл"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-transparent border-b border-gray-400 py-2 focus:outline-none text-gray-700"
            />
            <input
              type="password"
              placeholder="Нууц үг"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-transparent border-b border-gray-400 py-2 focus:outline-none text-gray-700"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-md font-semibold transition"
            >
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </button>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <p className="text-center text-sm text-gray-700 mt-4">
            Аль хэдийн бүртгэлтэй юу?{" "}
            <Link to="/login" className="text-orange-600 font-semibold hover:underline">
              Нэвтрэх
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
