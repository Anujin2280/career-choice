import { Search, Loader2 } from "lucide-react";

export default function HeroSearch({ query, setQuery, loading }) {
  return (
    <div className="mt-8 w-full max-w-md group">
      <p className="text-sm font-bold text-slate-400 mb-3 ml-1 uppercase tracking-widest">
        хайлт
      </p>
      <div
        className="
          flex items-center gap-3
          rounded-2xl
          bg-white
          px-5 py-4
          shadow-sm
          border-2 border-orange-200
          group-focus-within:border-orange-500/30
          group-focus-within:shadow-xl group-focus-within:shadow-orange-500/5
          transition-all duration-300
        "
      >
        {loading ? (
          <Loader2 size={20} className="text-orange-600 animate-spin" />
        ) : (
          <Search
            size={20}
            className="text-orange-500 shrink-0 group-focus-within:scale-110 transition-transform"
          />
        )}

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Мэргэжлээр хайх (жишээ нь: Дизайнер)..."
          className="
            w-full
            text-[16px]
            text-slate-800
            placeholder-slate-400
            bg-transparent
            focus:outline-none
          "
        />
      </div>
    </div>
  );
}
