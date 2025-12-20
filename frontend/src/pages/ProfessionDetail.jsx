import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function ProfessionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profession, setProfession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfession = async () => {
      try {
        const res = await axios.get(`/api/professions/${id}`);
        setProfession(res.data);
      } catch (err) {
        console.error("Алдаа:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfession();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Ачааллаж байна...</div>;
  }

  if (!profession) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Мэргэжлийн мэдээлэл олдсонгүй.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FBEFE6] flex justify-center items-center px-4 py-16">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full grid md:grid-cols-2 gap-8 p-10">
        {/* Зүүн тал — текст */}
        <div className="space-y-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition"
          >
            <ArrowLeft size={18} /> Буцах
          </button>

          <h1 className="text-3xl font-bold text-gray-900">{profession.name}</h1>
          <p className="text-sm text-gray-500">Салбар: {profession.category}</p>

          <p className="text-gray-700 leading-relaxed">{profession.description}</p>

          {/* Ур чадварууд */}
          {profession.skills && profession.skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Шаардагдах ур чадварууд:</h3>
              <div className="flex flex-wrap gap-3">
                {profession.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full text-white text-sm font-medium"
                    style={{
                      backgroundColor: ["#64B5F6", "#81C784", "#9575CD", "#4FC3F7", "#AED581", "#4DD0E1"][i % 6],
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Баруун тал — зураг */}
        <div className="flex justify-center items-center relative">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-orange-50 -z-10"></div>
          <img
            src="/career-hero.png"
            alt="career"
            className="max-w-[350px] md:max-w-[400px] object-contain relative z-10"
          />
        </div>
      </div>
    </div>
  );
}
