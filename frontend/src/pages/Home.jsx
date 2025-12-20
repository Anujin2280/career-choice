import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      try {
        const res = await axios.get(`/api/professions/search?q=${query}`);
        setResults(res.data);
      } catch (error) {
        console.error("Хайлтын алдаа:", error);
      }
    };
    const delayDebounce = setTimeout(fetchData, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchRelated = async (name) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/professions/related/${name}`);
      setSelected(res.data.main);
      setRelated(res.data.related);
    } catch (error) {
      console.error("Салбарын алдаа:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 grid gap-10 md:grid-cols-2 items-center">

      <div className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          <span className="text-orange-500">Мэргэжил</span> сонгоход<br />
          танд бид тусална.
        </h1>

        <p className="text-gray-600 max-w-md">
          Сонирхол чадварт тань тохирсон мэргэжлийг бид танд санал болгоно.
        </p>

        <Link
          to="/test"
          className="rounded-full bg-[#fbe1d0] px-6 py-2.5 text-orange-600 font-medium shadow-md hover:bg-[#f7c9aa] transition"
        >
          Тест бөглөх
        </Link>

        <div className="relative mt-4 max-w-md">
          <div className="rounded-full bg-[#fbe1d0] px-4 py-2 flex items-center gap-2">
            <Search className="text-orange-500" size={18} />
            <input
              type="text"
              placeholder="Сонирхсон мэргэжлээ хайх уу"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          {query && results.length > 0 && (
            <div className="absolute mt-2 w-full bg-white rounded-lg shadow-md border border-orange-100 z-10 max-h-60 overflow-auto">
              {results.map((p) => (
                <div
                  key={p._id}
                  onClick={() => {
                    fetchRelated(p.name);
                    setQuery(p.name);
                    setResults([]);
                  }}
                  className="px-4 py-2 hover:bg-orange-50 cursor-pointer"
                >
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.category}</p>
                </div>
              ))}
            </div>
          )}

          {selected && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                “{selected.category}” салбар дахь мэргэжлүүд:
              </h3>

              {loading ? (
                <p className="text-gray-500">Ачааллаж байна...</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {related.length > 0 ? (
                    related.map((r) => (
                        <div
                        key={r._id}
                        onClick={() => (window.location.href = `/profession/${r._id}`)}
                        className="bg-orange-50 hover:bg-orange-100 p-3 rounded-md text-sm text-gray-800 shadow-sm cursor-pointer transition"
                        >
                        {r.name}
                        </div>
                    ))
                    ) : (
                    <p className="text-gray-500 text-sm">Бусад мэргэжил олдсонгүй</p>
                    )}

                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full flex justify-center items-center">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-orange-50 -z-10"></div>
        <img
          src="/career-hero.png"
          alt="Career illustration"
          className="max-w-[450px] md:max-w-[550px] object-contain relative z-10"
        />
      </div>
    </section>
  );
}
