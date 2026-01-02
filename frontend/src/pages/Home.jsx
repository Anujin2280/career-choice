import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../api/axios";
import HeroSection from "../components/home/HeroSection";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      const res = await api.get("/professions/search", {
        params: { q: query },
      });
      setResults(res.data);
    };

    const t = setTimeout(fetchData, 400);
    return () => clearTimeout(t);
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
      testTo={token ? "/test" : "/login"}
      mbtiTo={token ? "/mbti" : "/login"}
      onSelectProfession={handleSelect}
    />
  );
}
