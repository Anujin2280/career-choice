const DEFAULT_SKILLS = [
  "манлайлал",
  "багийн ажил",
  "харилцаа",
  "илтгэх ур чадвар",
  "судалгаа",
  "шинжилгээ",
  "логик сэтгэлгээ",
  "бүтээлч сэтгэлгээ",
  "программчлал",
  "өгөгдөл",
  "дизайн",
  "төлөвлөлт",
];

const CHIP_VARIANTS = [
  "bg-[#60CCE9] text-white",
  "bg-[#68D391] text-white",
  "bg-[#9F7AEA] text-white",
  "bg-[#4299E1] text-white",
];

const ROTATIONS = ["rotate-9", "-rotate-8", "rotate-2", "rotate-9", "rotate-0"];

export default function SkillChips({
  results = [],
  relatedResults = [],
  relatedMain = null,
  query = "",
  onSelect,
}) {
  const trimmed = query.trim();
  const showResults = trimmed.length >= 2;
  const hasRelated = showResults && relatedResults.length > 0;
  const hasResults = showResults && results.length > 0;

  const displayItems = hasRelated
    ? relatedResults
    : hasResults
    ? results
    : DEFAULT_SKILLS;

  return (
    <div className="mt-8 space-y-4">
      {showResults && !hasResults && (
        <p className="text-sm text-red-400 bg-red-50 inline-block px-3 py-1 rounded-lg">
          Хайлт олдсонгүй.
        </p>
      )}

      {hasRelated && relatedMain?.category && (
        <p className="text-sm text-slate-500">
          Ижил ангилал: {relatedMain.category}
        </p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-6 items-center">
        {displayItems.map((item, idx) => {
          const variant = CHIP_VARIANTS[idx % CHIP_VARIANTS.length];
          const rotation = ROTATIONS[idx % ROTATIONS.length];
          const label = hasRelated || hasResults ? item.name : item;

          return (
            <button
              key={hasRelated || hasResults ? item._id : idx}
              type="button"
              onClick={() => (hasRelated || hasResults) && onSelect?.(item)}
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
                ${hasRelated || hasResults ? "cursor-pointer" : ""}
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
