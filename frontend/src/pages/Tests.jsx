import { Link } from "react-router-dom";
import {
  ArrowRight,
  Compass,
  BrainCircuit,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function Tests() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] relative overflow-hidden font-sans selection:bg-orange-100 pb-20">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-[100px] -z-10" />

      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Өөрийгөө <span className="text-orange-500">Нээх</span> Аялал
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Доорх тестүүдээс сонгон өөрийн сонирхол болон зан төлөвийн онцлогийг
            шинжлэх ухааны үндэслэлтэйгээр тодорхойлоорой.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* 1. RIASEC Card (Orange Theme) */}
          <div className="group relative bg-white/60 backdrop-blur-xl border border-orange-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:shadow-orange-200/50 hover:-translate-y-2 transition-all duration-300">
            {/* Background Icon Decoration */}
            <div className="absolute -right-6 -top-6 text-orange-50 opacity-50 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <Compass size={180} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <Compass size={28} strokeWidth={2.5} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold uppercase tracking-wider">
                  Сонирхол
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <Clock size={14} /> ~5 минут
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                RIASEC Тест
              </h2>

              <p className="text-slate-600 mb-8 leading-relaxed">
                Таны сонирхол, хандлагыг 6 үндсэн хэв шинжээр тодорхойлж, танд
                хамгийн сайн тохирох мэргэжлийн чиглэлүүдийг санал болгоно.
              </p>

              <div className="space-y-3 mb-8">
                <FeatureItem text="6 төрлийн зан чанарын дүн шинжилгээ" />
                <FeatureItem text="Танд тохирох мэргэжлийн жагсаалт" />
              </div>

              <div className="mt-auto">
                <Link
                  to="/test"
                  className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-slate-900 text-white py-4 font-bold shadow-lg group-hover:bg-orange-600 transition-colors duration-300"
                >
                  Эхлүүлэх{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* 2. MBTI Card (Purple Theme) */}
          <div className="group relative bg-white/60 backdrop-blur-xl border border-purple-100 rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-purple-100/50 hover:shadow-2xl hover:shadow-purple-200/50 hover:-translate-y-2 transition-all duration-300">
            {/* Background Icon Decoration */}
            <div className="absolute -right-6 -top-6 text-purple-50 opacity-50 transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
              <BrainCircuit size={180} strokeWidth={1} />
            </div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <BrainCircuit size={28} strokeWidth={2.5} />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider">
                  Зан төлөв
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                  <Clock size={14} /> ~10 минут
                </span>
              </div>

              <h2 className="text-3xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                MBTI Тест
              </h2>

              <p className="text-slate-600 mb-8 leading-relaxed">
                Таны шийдвэр гаргалт, мэдээлэл боловсруулах хэв маяг, ертөнцийг
                үзэх үзлийг тодорхойлж, таны давуу талуудыг нээнэ.
              </p>

              <div className="space-y-3 mb-8">
                <FeatureItem text="16 төрлийн зан төлөвийн загвар" />
                <FeatureItem text="Багийн ажиллагаа болон манлайлал" />
              </div>

              <div className="mt-auto">
                <Link
                  to="/mbti"
                  className="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 py-4 font-bold hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300"
                >
                  Эхлүүлэх{" "}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Жижиг жагсаалтын компонент
function FeatureItem({ text }) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 size={18} className="text-slate-400 mt-0.5 shrink-0" />
      <span className="text-sm text-slate-600 font-medium">{text}</span>
    </div>
  );
}
