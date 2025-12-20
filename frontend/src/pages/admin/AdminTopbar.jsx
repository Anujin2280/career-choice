import { LogOut, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function AdminTopbar({ toggleSidebar }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="w-full bg-white border-b border-orange-100 flex justify-between items-center px-8 py-3 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md hover:bg-orange-100 transition"
        >
          <Menu size={22} className="text-orange-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">Админ хянах самбар</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden md:block">
          <p className="font-semibold text-gray-800">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
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
