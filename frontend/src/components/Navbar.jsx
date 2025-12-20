import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-orange-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <div className="flex items-center gap-1">
          <span className="text-5xl font-bold text-orange-500 leading-none">C</span>
          <span className="text-3xl font-semibold text-black leading-none">areer</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-orange-500">Нүүр</Link>
          <Link to="/professions" className="hover:text-orange-500">Мэргэжил</Link>
          <Link to="/test" className="hover:text-gray-900">Мэргэжлийн тест</Link>
          <Link to="/about" className="hover:text-gray-900">Бидний тухай</Link>
        </nav>

        <div className="flex items-center gap-3 relative">
          {!token ? (
            <>
              <Link to="/login" className="border border-orange-500 px-4 py-1.5 rounded-full text-sm hover:bg-orange-500 hover:text-white transition">
                Нэвтрэх
              </Link>
              <Link to="/register" className="bg-orange-500 px-4 py-2 rounded-full text-sm hover:text-white hover:bg-orange-600 transition">
                Бүртгүүлэх
              </Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
                <img
                  src="/user.png"
                  alt="avatar"
                  className="w-9 h-9 rounded-full border border-orange-400"
                />
                <span className="font-medium text-gray-700">{user?.name}</span>
                <span className="text-gray-500">▾</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-md w-44 border border-gray-100 text-sm">
                  <Link to="/profile" className="block px-4 py-2 hover:bg-orange-50">Профайл</Link>
                  <Link to="/saved" className="block px-4 py-2 hover:bg-orange-50">Миний хадгалсан</Link>
                  <Link to="/history" className="block px-4 py-2 hover:bg-orange-50">Түүх</Link>
                  <button
                    onClick={() => dispatch(logout())}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 text-red-500"
                  >
                    Гарах
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
