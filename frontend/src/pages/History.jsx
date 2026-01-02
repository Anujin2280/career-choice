import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  History as HistoryIcon,
  Calendar,
  ChevronRight,
  LayoutGrid,
  UserCircle2,
  BarChart3,
  SearchX,
} from "lucide-react";

const TYPE_LABELS = {
  R: "Бодитч",
  I: "Судлаач",
  A: "Уран бүтээлч",
  S: "Нийгмийн",
  E: "Ажил хэрэгч",
  C: "Зохион байгуулагч",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function History() {
  const [riasecItems, setRiasecItems] = useState([]);
  const [mbtiItems, setMbtiItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("riasec");

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const [riasecResult, mbtiResult] = await Promise.allSettled([
        api.get("/test/history"),
        api.get("/mbti/history"),
      ]);

      if (riasecResult.status === "fulfilled") {
        setRiasecItems(
          Array.isArray(riasecResult.value.data) ? riasecResult.value.data : []
        );
      }
      if (mbtiResult.status === "fulfilled") {
        setMbtiItems(
          Array.isArray(mbtiResult.value.data) ? mbtiResult.value.data : []
        );
      }
    } catch (err) {
      toast.error("Мэдээлэл татахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
            <HistoryIcon className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Тестийн түүх
            </h1>
            <p className="text-gray-500">
              Өөрийгөө танин мэдэх аяллын тэмдэглэл
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-gray-200/50 rounded-xl mb-8 w-full sm:w-fit">
          <button
            onClick={() => setActiveTab("riasec")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "riasec"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <BarChart3 size={18} /> RIASEC
          </button>
          <button
            onClick={() => setActiveTab("mbti")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "mbti"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <UserCircle2 size={18} /> MBTI
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {loading ? (
            // Skeleton Loader
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-40 w-full bg-gray-200 animate-pulse rounded-2xl"
              />
            ))
          ) : (
            <>
              {activeTab === "riasec" && (
                <div className="grid gap-6">
                  {riasecItems.length === 0 ? (
                    <EmptyState text="RIASEC түүх олдсонгүй" />
                  ) : (
                    riasecItems.map((item) => (
                      <RiasecCard key={item._id} item={item} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "mbti" && (
                <div className="grid gap-6">
                  {mbtiItems.length === 0 ? (
                    <EmptyState text="MBTI түүх олдсонгүй" />
                  ) : (
                    mbtiItems.map((item) => (
                      <MbtiCard key={item._id} item={item} />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// RIASEC Card Component
function RiasecCard({ item }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold italic">
            R
          </div>
          <h3 className="text-xl font-bold text-gray-800">RIASEC Үр дүн</h3>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">
          <Calendar size={14} />
          {formatDate(item.ognoo)}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {(item.topThree || []).map((t) => (
          <span
            key={t}
            className="px-4 py-1.5 rounded-lg bg-orange-600 text-white text-sm font-bold shadow-sm shadow-orange-100"
          >
            {t} - {TYPE_LABELS[t]}
          </span>
        ))}
      </div>

      {item.scores && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(item.scores).map(([k, v]) => (
            <div
              key={k}
              className="relative p-3 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden group-hover:bg-orange-50/30 transition-colors text-center"
            >
              <div className="text-[10px] uppercase font-bold text-gray-400 mb-1">
                {TYPE_LABELS[k] || k}
              </div>
              <div className="text-lg font-bold text-gray-800">{v}</div>
              <div className="text-[10px] text-gray-500 italic">оноо</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// MBTI Card Component
function MbtiCard({ item }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <LayoutGrid size={20} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{item.type}</h3>
            <p className="text-sm text-blue-600 font-medium">{item.typeName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">
          <Calendar size={14} />
          {formatDate(item.ognoo)}
        </div>
      </div>

      {Array.isArray(item.breakdown) && (
        <div className="space-y-4">
          {item.breakdown.map((b) => (
            <div key={b.dimension} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-500 px-1">
                <span>
                  {b.left} ({b.leftCount})
                </span>
                <span className="text-gray-400">{b.dimension}</span>
                <span>
                  ({b.rightCount}) {b.right}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${
                      (b.leftCount / (b.leftCount + b.rightCount)) * 100
                    }%`,
                  }}
                />
                <div
                  className="h-full bg-orange-400 transition-all"
                  style={{
                    width: `${
                      (b.rightCount / (b.leftCount + b.rightCount)) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
      <SearchX size={48} className="text-gray-200 mb-4" />
      <p className="text-gray-400 font-medium">{text}</p>
    </div>
  );
}
