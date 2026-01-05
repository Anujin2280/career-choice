import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import HeroSection from "../components/home/HeroSection";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [relatedResults, setRelatedResults] = useState([]);
  const [relatedMain, setRelatedMain] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setResults([]);
        setRelatedResults([]);
        setRelatedMain(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/professions/search", {
          params: { q: trimmed },
        });
        if (cancelled) return;
        const list = Array.isArray(res.data) ? res.data : [];
        setResults(list);

        const lower = trimmed.toLowerCase();
        const exact = list.find(
          (item) => String(item?.name || "").toLowerCase() === lower
        );
        const base = exact || list[0];

        if (!base?.name) {
          setRelatedResults([]);
          setRelatedMain(null);
          return;
        }

        const relatedRes = await api.get(
          `/professions/related/${encodeURIComponent(base.name)}`
        );
        if (cancelled) return;
        const main = relatedRes.data?.main || null;
        const related = Array.isArray(relatedRes.data?.related)
          ? relatedRes.data.related
          : [];
        const combined = main ? [main, ...related] : related;
        setRelatedMain(main);
        setRelatedResults(combined);
      } catch {
        if (!cancelled) {
          setRelatedResults([]);
          setRelatedMain(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const t = setTimeout(fetchData, 400);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const handleSelect = (p) => {
    setQuery(p.name);
    setResults([]);
    navigate(`/profession/${p._id}`);
  };

  return (
    <HeroSection
      query={query}
      setQuery={setQuery}
      results={results}
      relatedResults={relatedResults}
      relatedMain={relatedMain}
      loading={loading}
      testTo={token ? "/tests" : "/login"}
      onSelectProfession={handleSelect}
    />
  );
}
