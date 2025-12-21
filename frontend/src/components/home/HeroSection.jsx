import { Link } from "react-router-dom";
import HeroSearch from "./HeroSearch";
import SkillChips from "./SkillChips";

export default function HeroSection({
  query,
  setQuery,
  results,
  testTo,
  onSelectProfession,
}) {
  return (
    <section className="min-h-[90vh] flex items-center justify-center bg-[#FDFCFB] px-4 py-12">
      {/* Main Container looking like a Card */}
      <div className="relative mx-auto max-w-7xl w-full bg-white rounded-[3rem] shadow-2xl shadow-orange-100/50 overflow-hidden border border-orange-50/50">
        {/* Soft Background Blurs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-50 rounded-full blur-3xl" />

        <div className="relative grid md:grid-cols-2 gap-12 items-center px-8 py-16 md:px-16 md:py-24">
          {/* Left Content */}
          <div className="z-10 order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.15]">
              Танд тохирох <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 px-2">мэргэжлийг</span>
                <span className="absolute inset-0 bg-orange-100 -rotate-1 rounded-lg" />
              </span>{" "}
              RIASEC <br />
              аргаар олъё
            </h2>

            <p className="mt-8 text-slate-500 text-lg font-medium leading-relaxed max-w-md">
              <span className="text-orange-500 font-bold">RIASEC тест</span> нь
              таны сонирхол, зан чанарт нийцэх салбар, мэргэжлийг санал болгоно.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 ">
              <Link
                to={testTo || "/test"}
                className="rounded-full bg-[#EA7A35] px-10 py-4 text-white font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
              >
                Тест өгөх
              </Link>
              <Link
                to="/about"
                className="rounded-full px-10 py-4 border-2 border-orange-200 text-orange-600 font-bold hover:bg-orange-50 transition-all"
              >
                Дэлгэрэнгүй
              </Link>
            </div>

            <div className="mt-12">
              <HeroSearch query={query} setQuery={setQuery} />
            </div>

            <div className="mt-8">
              <SkillChips
                query={query}
                results={results}
                onSelect={onSelectProfession}
              />
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative flex justify-center items-center order-1 md:order-2">
            {/* The Big Orange Circle in background */}
            <div className="absolute w-[110%] aspect-square bg-orange-50 rounded-full scale-110 translate-x-8" />
            <div className="absolute w-[90%] aspect-square bg-orange-100/50 rounded-full scale-100" />

            <img
              src="/career-hero.png" // Энд өөрийн зургийг хийнэ үү
              alt="Careers"
              className="relative z-10 w-full max-w-md h-auto object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
