import { Layers, ClipboardList, Users, Home, Menu, Sparkles } from "lucide-react";

export default function AdminSidebar({
  active,
  setActive,
  collapsed,
  toggleSidebar,
}) {
  const menu = [
    { id: "dashboard", name: "Хяналтын самбар", icon: Home },
    { id: "professions", name: "Мэргэжлүүд", icon: Layers },
    { id: "questions", name: "Асуултууд", icon: ClipboardList },
    { id: "mbti-questions", name: "MBTI асуултууд", icon: ClipboardList },
    { id: "mbti-types", name: "MBTI төрлүүд", icon: Sparkles },
    { id: "users", name: "Хэрэглэгчид", icon: Users },
  ];

  return (
    <aside
      className={`
        relative
        h-auto
        bg-white
        border-r border-orange-100
        shadow-sm
        transition-all duration-300
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-orange-100">
        <button
          onClick={toggleSidebar}
          aria-label="Sidebar toggle"
          className="
            p-2 rounded-lg
            bg-orange-500 text-white
            hover:bg-orange-600
            transition
          "
        >
          <Menu size={18} />
        </button>

        {!collapsed && (
          <h2 className="text-sm font-bold text-orange-600 tracking-wide">
            Admin Panel
          </h2>
        )}
      </div>

      {/* MENU */}
      <nav className="mt-4 px-3 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              title={collapsed ? item.name : undefined}
              className={`
                group relative
                flex items-center
                w-full gap-3
                px-3 py-3
                rounded-lg
                transition
                ${
                  isActive
                    ? "bg-orange-400 text-white shadow-sm"
                    : "text-gray-700 hover:bg-orange-50"
                }
              `}
            >
              {/* ACTIVE INDICATOR */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-orange-600" />
              )}

              <Icon
                size={18}
                className={`shrink-0 ${
                  isActive ? "text-white" : "text-orange-500"
                }`}
              />

              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="absolute bottom-0 w-full border-t border-orange-100 py-3 text-center">
        <span className="text-xs text-gray-400">Career Admin • v1.0.0</span>
      </div>
    </aside>
  );
}
