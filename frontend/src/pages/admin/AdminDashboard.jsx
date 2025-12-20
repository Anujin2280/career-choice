import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import DashboardCards from "./DashboardCards";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#fdf5ef] overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar active={active} setActive={setActive} collapsed={collapsed} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminTopbar toggleSidebar={() => setCollapsed(!collapsed)} />

        <main className="flex-1 p-10 overflow-y-auto">
          {active === "dashboard" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Тойм мэдээлэл</h3>
              <DashboardCards />
            </div>
          )}

          {active === "professions" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Мэргэжлийн жагсаалт</h3>
              <p>🧩 CRUD table энд байрлана.</p>
            </div>
          )}

          {active === "questions" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Тестийн асуултууд</h3>
              <p>🧠 Тестийн асуулт удирдах хэсэг энд байрлана.</p>
            </div>
          )}

          {active === "users" && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Хэрэглэгчид</h3>
              <p>👥 Хэрэглэгчдийн жагсаалт ба эрх удирдах хэсэг энд байрлана.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
