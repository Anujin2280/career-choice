import { Layers, ClipboardList, Users, Home } from "lucide-react";

export default function AdminSidebar({ active, setActive, collapsed }) {
  const menu = [
    { id: "dashboard", name: "Хянах самбар", icon: <Home size={18} /> },
    { id: "professions", name: "Мэргэжил", icon: <Layers size={18} /> },
    { id: "questions", name: "Тестийн асуулт", icon: <ClipboardList size={18} /> },
    { id: "users", name: "Хэрэглэгчид", icon: <Users size={18} /> },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-white border-r border-orange-100 shadow-sm flex flex-col transition-all duration-300`}
    >
      <div className="p-5 border-b border-orange-100">
        <h1 className="text-2xl font-bold text-orange-600 whitespace-nowrap overflow-hidden">
          {collapsed ? "CA" : "Career Admin"}
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
              active === item.id
                ? "bg-orange-500 text-white shadow-sm"
                : "text-gray-700 hover:bg-orange-50"
            }`}
          >
            {item.icon}
            {!collapsed && <span className="font-medium">{item.name}</span>}
          </button>
        ))}
      </nav>

      <p className="text-xs text-gray-400 text-center py-4 border-t border-orange-100">
        v1.0.0
      </p>
    </aside>
  );
}
