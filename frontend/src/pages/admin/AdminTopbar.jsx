import { LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-orange-100 flex justify-end items-center px-8 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="font-semibold text-gray-800">
            {user ? `${user.ovog || ""} ${user.ner || ""}`.trim() : ""}
          </p>
          <p className="text-sm text-gray-500">{user?.mail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 rounded-md flex items-center gap-2 transition"
        >
          <LogOut size={16} /> <span>Гарах</span>
        </button>
      </div>
    </header>
  );
}
