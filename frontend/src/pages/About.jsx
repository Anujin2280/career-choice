import {
  Target,
  Search,
  BarChart3,
  Zap,
  ShieldCheck,
  BrainCircuit,
  Users,
  Compass,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function About() {
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="min-h-screen bg-white pb-20 font-sans selection:bg-orange-100">
      {/* 1. Hero / Header Section - Blended Colors */}
      <div className="relative py-24 bg-slate-50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 text-center z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-white border border-slate-200 text-slate-500 text-sm font-bold tracking-wide uppercase mb-6 shadow-sm">
            Цогц аргачлал
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-tight tracking-tight">
            Таны ирээдүйг <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 via-pink-500 to-purple-600">
              Шинжлэх ухаанчаар
            </span>{" "}
            тодорхойлъё
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Бид зөвхөн сонирхлыг бус, таны төрөлхийн зан төлөвийг хамтад нь
            шинжилж, хамгийн оновчтой мэргэжлийг санал болгодог платформ юм.
          </p>
        </div>
      </div>

      {/* 2. The Two Pillars (RIASEC + MBTI) */}
      <div className="mx-auto max-w-6xl px-6 -mt-16 relative z-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* RIASEC Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-orange-100 border border-orange-50 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
              <Compass size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              RIASEC{" "}
              <span className="text-orange-500 text-lg font-medium block">
                Сонирхлын тест
              </span>
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Таны юу хийх дуртай, ямар орчинд ажиллахыг илүүд үздэг болохыг
              тодорхойлно. Жон Холландын онол дээр суурилсан.
            </p>
            <ul className="space-y-3">
              {[
                "Бодит (Realistic)",
                "Шинжлэх ухаанч (Investigative)",
                "Уран бүтээлч (Artistic)",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 font-medium"
                >
                  <div className="w-2 h-2 rounded-full bg-orange-400" /> {item}
                </li>
              ))}
              <li className="text-orange-500 text-sm font-bold pl-5">
                +3 төрөл
              </li>
            </ul>
          </div>

          {/* MBTI Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-purple-100 border border-purple-50 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
              <BrainCircuit size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              MBTI{" "}
              <span className="text-purple-500 text-lg font-medium block">
                Зан төлөвийн тест
              </span>
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Та шийдвэр гаргахдаа юуг чухалчилдаг, эрч хүчээ хаанаас авдаг
              болохыг тодорхойлно. Майерс-Бриггсийн аргачлал.
            </p>
            <ul className="space-y-3">
              {[
                "Introvert vs Extrovert",
                "Sensing vs Intuition",
                "Thinking vs Feeling",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 font-medium"
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400" /> {item}
                </li>
              ))}
              <li className="text-purple-500 text-sm font-bold pl-5">
                + Judging vs Perceiving
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Why Combine Them? (Synergy Section) */}
      <div className="mx-auto max-w-5xl px-6 py-24">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Яагаад <span className="text-orange-500">Сонирхол</span> +{" "}
              <span className="text-purple-600">Зан төлөв</span> гэж?
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Зөвхөн сонирхолдоо хөтлөгдөх нь хангалтгүй. Таны зан төлөв тухайн
              ажлын өдөр тутмын үүрэг хариуцлагатай нийцэж байж та жинхэнэ
              амжилтад хүрнэ.
            </p>

            <div className="grid gap-4">
              <SynergyItem
                icon={<Target className="text-orange-500" />}
                title="Илүү нарийвчлал"
                desc="100 гаруй мэргэжлээс танд хамгийн өндөр магадлалтай тохирохыг шүүнэ."
              />
              <SynergyItem
                icon={<Users className="text-purple-500" />}
                title="Өөрийгөө таних"
                desc="Өөрийн давуу болон сул талаа ойлгож, карьераа зөв төлөвлөхөд тусална."
              />
            </div>

            <div className="pt-4">
              <Link
                to={token ? "/tests" : "/login"}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Тестүүдээ өгч эхлэх
              </Link>
            </div>
          </div>

          {/* Visual Representation of Synergy */}
          <div className="flex-1 flex justify-center relative">
            <div className="relative w-80 h-80">
              <div className="absolute top-0 left-0 w-48 h-48 bg-orange-400/90 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-400/90 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
              <div className="absolute -bottom-8 left-20 w-48 h-48 bg-pink-400/90 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

              <div className="relative z-10 bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-white shadow-2xl mt-12 text-center">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-purple-600 mb-2">
                  100%
                </div>
                <p className="font-bold text-slate-800">
                  Танд тохирсон
                  <br />
                  шийдэл
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Statistics / Trust Grid */}
      <div className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBox value="100+" label="Мэргэжил" color="text-blue-500" />
            <StatBox value="2" label="Төрлийн тест" color="text-orange-500" />
            <StatBox value="24/7" label="Нээлттэй" color="text-purple-500" />
            <StatBox value="Үнэгүй" label="Зөвлөгөө" color="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function SynergyItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
      <div className="shrink-0 mt-1">{icon}</div>
      <div>
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="text-sm text-slate-600 mt-1">{desc}</p>
      </div>
    </div>
  );
}

function StatBox({ value, label, color }) {
  return (
    <div className="text-center">
      <h3 className={`text-4xl font-black ${color} mb-2`}>{value}</h3>
      <p className="text-slate-500 font-semibold uppercase tracking-wider text-sm">
        {label}
      </p>
    </div>
  );
}
