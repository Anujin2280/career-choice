import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiUser,
  FiBookmark,
  FiClock,
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";

export default function Navbar() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Скролл хийх үед Navbar-ийн харагдах байдал өөрчлөгдөх
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `relative py-2 transition-all duration-300 font-medium ${
      isActive
        ? "text-orange-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-orange-500 after:rounded-full"
        : "text-gray-600 hover:text-orange-500 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-1/2 hover:after:h-0.5 hover:after:bg-orange-300 hover:after:rounded-full after:transition-all after:duration-300"
    }`;

  return (
    <header
      className={`sticky top-0 z-100 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md py-2"
          : "bg-white py-4"
      } border-b border-orange-50`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center group">
          <div className="relative flex items-center">
            <span className="text-3xl font-black text-orange-500 tracking-tighter transition-transform group-hover:-rotate-3">
              My
            </span>
            <span className="text-2xl font-bold text-slate-800 ml-0.5 group-hover:text-orange-600 transition-colors">
              Career
            </span>
            <div className="absolute -top-1 -right-2 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10 text-[15px]">
          <NavLink to="/" className={navLinkClass}>
            Нүүр
          </NavLink>
          <NavLink to="/professions" className={navLinkClass}>
            Мэргэжлүүд
          </NavLink>
          <NavLink to={token ? "/test" : "/login"} className={navLinkClass}>
            RIASEC тест
          </NavLink>
          <NavLink to={token ? "/mbti" : "/login"} className={navLinkClass}>
            MBTI тест
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            Бидний тухай
          </NavLink>
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {!token ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-orange-500 transition"
              >
                Нэвтрэх
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 rounded-2xl text-sm font-bold bg-orange-500 text-white shadow-lg shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 transition active:scale-95"
              >
                Бүртгүүлэх
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl transition-all border ${
                  open
                    ? "bg-orange-50 border-orange-200"
                    : "bg-gray-50 border-transparent hover:border-gray-200"
                }`}
              >
                <div className="relative">
                  <img
                    src={user?.avatar_url || "/avatar.png"}
                    className="w-8 h-8 rounded-xl object-cover border-2 border-white shadow-sm"
                    alt="avatar"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <span className="text-sm font-bold text-gray-700 hidden lg:block">
                  {user?.ner || "Хэрэглэгч"}
                </span>
                <FiChevronDown
                  className={`text-gray-400 transition-transform duration-300 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* User Dropdown */}
              {open && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-50 text-xs text-gray-400 font-bold uppercase tracking-widest">
                      Миний цэс
                    </div>
                    <div className="p-2">
                      <DropdownItem
                        icon={<FiUser />}
                        label="Профайл"
                        onClick={() => navigate("/profile")}
                      />
                      <DropdownItem
                        icon={<FiBookmark />}
                        label="Хадгалсан"
                        onClick={() => navigate("/saved")}
                      />
                      <DropdownItem
                        icon={<FiClock />}
                        label="Тестийн түүх"
                        onClick={() => navigate("/history")}
                      />
                      <div className="h-px bg-gray-100 my-1 mx-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition font-semibold text-sm"
                      >
                        <FiLogOut /> Гарах
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-50 text-gray-600 hover:text-orange-500 transition"
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 space-y-4">
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Нүүр
            </NavLink>
            <NavLink
              to="/professions"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Мэргэжлүүд
            </NavLink>
            <NavLink
              to={token ? "/test" : "/login"}
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              RIASEC тест
            </NavLink>
            <NavLink
              to={token ? "/mbti" : "/login"}
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              MBTI тест
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileOpen(false)}
              className={navLinkClass}
            >
              Бидний тухай
            </NavLink>

            {!token && (
              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 text-gray-600 font-bold"
                >
                  Нэвтрэх
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="text-center py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg shadow-orange-100"
                >
                  Бүртгүүлэх
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

// Dropdown Item Component
function DropdownItem({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition font-medium text-sm"
    >
      <span className="text-lg opacity-70">{icon}</span>
      {label}
    </button>
  );
}
