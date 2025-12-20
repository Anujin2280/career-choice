import { useEffect, useState } from "react";
import axios from "axios";

export default function Test() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Тестийн асуултууд татах
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await axios.get("/api/test");
      setQuestions(res.data);
    };
    fetchQuestions();
  }, []);

  // Хариулт хадгалах
  const handleAnswer = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  // Оноо тооцох
  // Оноо тооцох
const calculateResult = async () => {
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.entries(answers).forEach(([id, value]) => {
      const q = questions.find((q) => q._id === id);
      if (q) scores[q.category] += parseInt(value);
    });
  
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topThree = sorted.slice(0, 3).map(([cat]) => cat);
  
    // 🔥 Backend-аас тохирох мэргэжлүүдийг татна
    try {
      const res = await axios.post("/api/test/suggest", { topThree });
      setResult({ scores, topThree, professions: res.data.professions });
    } catch (error) {
      console.error("Suggest error:", error);
    }
  };
  

  if (result) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Таны RIASEC оноо</h2>
  
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(result.scores).map(([type, score]) => (
            <div key={type} className="p-4 bg-orange-50 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-orange-600">{type}</h3>
              <p className="text-gray-700 text-lg">{score} оноо</p>
            </div>
          ))}
        </div>
  
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          🧠 Танд хамгийн тохирох төрлүүд:
        </h3>
        <div className="flex justify-center gap-3 mb-6">
          {result.topThree.map((t) => (
            <span key={t} className="px-4 py-2 bg-orange-500 text-white rounded-full text-sm font-medium">
              {t}
            </span>
          ))}
        </div>
  
        {/* 🧩 Санал болгосон мэргэжлүүд */}
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Танд тохирох мэргэжлүүд:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
          {result.professions.map((p) => (
            <div key={p._id} className="p-4 bg-white border border-orange-100 rounded-lg shadow-sm">
              <h4 className="font-bold text-orange-600 text-lg">{p.name}</h4>
              <p className="text-gray-700 text-sm">{p.category}</p>
              <p className="text-gray-500 text-sm mt-1">{p.description}</p>
            </div>
          ))}
        </div>
  
        <button
          onClick={() => setResult(null)}
          className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
        >
          Тест дахин эхлүүлэх
        </button>
      </div>
    );
  }
  

  return (
    <div className="max-w-4xl mx-auto py-16 px-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">RIASEC Мэргэжлийн Тест</h2>

      <div className="space-y-8">
        {questions.map((q, i) => (
          <div key={q._id} className="bg-orange-50 rounded-lg p-6 shadow-sm">
            <p className="font-medium text-gray-800 mb-3">
              {i + 1}. {q.text}
            </p>

            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <label key={num} className="flex flex-col items-center text-sm text-gray-700">
                  <input
                    type="radio"
                    name={q._id}
                    value={num}
                    checked={answers[q._id] == num}
                    onChange={(e) => handleAnswer(q._id, e.target.value)}
                    className="accent-orange-500 w-5 h-5"
                  />
                  {num}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={calculateResult}
          disabled={Object.keys(answers).length < questions.length}
          className="px-6 py-3 bg-orange-500 text-white rounded-md font-semibold hover:bg-orange-600 disabled:opacity-50"
        >
          Үр дүн харах
        </button>
      </div>
    </div>
  );
}
