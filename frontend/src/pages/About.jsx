import {
  Target,
  Search,
  Bookmark,
  BarChart3,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function About() {
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. Hero / Header Section */}
      <div className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-200 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100 rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Бидний <span className="text-orange-500">Зорилго</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            Хүн бүр өөрийн сонирхол, зан чанарт нийцсэн мэргэжлээ сонгож, аз
            жаргалтайгаар ажиллах боломжийг олгох нь манай платформын гол
            зорилго юм.
          </p>
        </div>
      </div>

      {/* 2. Core Features Grid */}
      <div className="mx-auto max-w-6xl px-6 -mt-10 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Target className="text-orange-500" />}
            title="Оновчтой тодорхойлолт"
            desc="RIASEC аргачлалаар таны зан төлөвийг 6 үндсэн хэв шинжид хуваан шинжилнэ."
          />
          <FeatureCard
            icon={<Search className="text-blue-500" />}
            title="Мэргэжлийн сан"
            desc="Монголын хөдөлмөрийн зах зээл дэх 100 гаруй мэргэжлийн дэлгэрэнгүй мэдээлэл."
          />
          <FeatureCard
            icon={<BarChart3 className="text-purple-500" />}
            title="Бодит өгөгдөл"
            desc="Цалин, эрэлт хэрэгцээ, ажлын байрны үүрэг зэрэг хамгийн сүүлийн үеийн мэдээлэл."
          />
        </div>
      </div>

      {/* 3. Detailed Description Section */}
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">
              Яагаад RIASEC гэж?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Жон Холландын боловсруулсан энэхүү онол нь хүмүүсийг болон ажлын
              орчныг
              <strong>
                {" "}
                Realistic (Бодит), Investigative (Шинжлэх ухаанч), Artistic
                (Уран сайхны), Social (Нийгмийн), Enterprising (Идэвхтэй),
                Conventional (Уламжлалт)
              </strong>{" "}
              гэсэн 6 төрөлд хуваадаг.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Таны сонирхол ажлын орчинтойгоо хэдий чинээ нийцнэ, төдий чинээ та
              ажилдаа амжилт гаргах магадлал нэмэгддэг болохыг шинжлэх ухаан
              баталсан байдаг.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-green-500 shrink-0 mt-1" />
                <p className="text-slate-700 font-medium">
                  Мэргэжлийн зөвлөгөө, олон улсын стандарт
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Zap className="text-yellow-500 shrink-0 mt-1" />
                <p className="text-slate-700 font-medium">
                  Шуурхай хариу, ойлгомжтой үр дүн
                </p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Target size={200} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Таны карьер бидний хувьд чухал
            </h3>
            <p className="text-slate-600 mb-8 relative z-10">
              Бид зөвхөн тест аваад зогсохгүй, таны сонирхсон мэргэжлүүдийг
              хадгалах, цаг хугацааны явцад өөрчлөгдөх сонирхлоо хянах "Түүх"
              хэсгийг бий болгосон.
            </p>
            <Link
              to={token ? "/test" : "/login"}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition shadow-lg"
            >
              Одоо тест өгөх
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for Feature Cards
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-50 hover:-translate-y-2 transition-transform duration-300">
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
