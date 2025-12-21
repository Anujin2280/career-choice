import { Users, Layers, ClipboardList } from "lucide-react";

export default function DashboardCards({ summary, onSelect }) {
  const cards = [
    {
      id: "users",
      label: "Нийт хэрэглэгч",
      value: summary?.users ?? 0,
      icon: <Users size={30} />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "professions",
      label: "Нийт мэргэжил",
      value: summary?.professions ?? 0,
      icon: <Layers size={30} />,
      color: "bg-green-100 text-green-600",
    },
    {
      id: "questions",
      label: "Нийт асуулт",
      value: summary?.questions ?? 0,
      icon: <ClipboardList size={30} />,
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <button
          key={card.id}
          type="button"
          onClick={() => onSelect?.(card.id)}
          className="bg-white border border-orange-100 rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition text-left"
        >
          <div className={`${card.color} p-3 rounded-full`}>{card.icon}</div>
          <div>
            <p className="text-gray-600 text-sm">{card.label}</p>
            <h4 className="text-xl font-bold text-gray-900">{card.value}</h4>
          </div>
        </button>
      ))}
    </div>
  );
}
