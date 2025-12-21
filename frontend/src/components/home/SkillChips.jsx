const DEFAULT_SKILLS = [
  "leadership",
  "code",
  "components",
  "collaboration",
  "web",
  "research",
  "insights",
  "analysis",
  "dashboards",
  "responsive",
  "team",
];

// Зураг дээрх өнгөнүүдийг Tailwind class-аар тодорхойлов
const CHIP_VARIANTS = [
  "bg-[#60CCE9] text-white", // Цэнхэр
  "bg-[#68D391] text-white", // Ногоон
  "bg-[#9F7AEA] text-white", // Нил ягаан
  "bg-[#4299E1] text-white", // Гүн цэнхэр
];

// Пайзуудыг үл ялиг налуу харагдуулах эргэлтүүд
const ROTATIONS = ["rotate-9", "-rotate-8", "rotate-2", "rotate-9", "rotate-0"];

export default function SkillChips({ results = [], query = "", onSelect }) {
  const trimmed = query.trim();
  const showResults = trimmed.length >= 2;
  const hasResults = showResults && results.length > 0;

  const displayItems = hasResults ? results : DEFAULT_SKILLS;

  return (
    <div className="mt-8 space-y-4">
      {showResults && !hasResults && (
        <p className="text-sm text-red-400 bg-red-50 inline-block px-3 py-1 rounded-lg">
          Илэрц олдсонгүй.
        </p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-6 items-center">
        {displayItems.map((item, idx) => {
          // Индекс дээр суурилан өнгө болон налууг сонгох (санамсаргүй мэт харагдуулах)
          const variant = CHIP_VARIANTS[idx % CHIP_VARIANTS.length];
          const rotation = ROTATIONS[idx % ROTATIONS.length];
          const label = hasResults ? item.name : item;

          return (
            <button
              key={hasResults ? item._id : idx}
              type="button"
              onClick={() => hasResults && onSelect?.(item)}
              className={`
                ${variant} ${rotation}
                px-6 py-2.5 
                text-sm font-bold 
                rounded-full 
                shadow-md hover:shadow-lg
                hover:scale-105 
                active:scale-95
                transition-all duration-200 
                cursor-default
                ${hasResults ? "cursor-pointer" : ""}
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
