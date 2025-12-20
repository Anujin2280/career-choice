import { Users, Layers, ClipboardList, BarChart3 } from "lucide-react";

export default function DashboardCards() {
  const cards = [
    { label: "Хэрэглэгчид", value: "152", icon: <Users size={30} />, color: "bg-orange-100 text-orange-600" },
    { label: "Мэргэжил", value: "78", icon: <Layers size={30} />, color: "bg-green-100 text-green-600" },
    { label: "Тестийн асуулт", value: "49", icon: <ClipboardList size={30} />, color: "bg-blue-100 text-blue-600" },
    { label: "Идэвхтэй хэрэглэгчид", value: "95%", icon: <BarChart3 size={30} />, color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white border border-orange-100 rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition"
        >
          <div className={`${card.color} p-3 rounded-full`}>{card.icon}</div>
          <div>
            <p className="text-gray-600 text-sm">{card.label}</p>
            <h4 className="text-xl font-bold text-gray-900">{card.value}</h4>
          </div>
        </div>
      ))}
    </div>
  );
}
