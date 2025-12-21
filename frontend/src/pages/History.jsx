import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const TYPE_LABELS = {
  R: "Бодит",
  I: "Судлаач",
  A: "Урлагийн",
  S: "Нийгмийн",
  E: "Санаачлагч",
  C: "Дүрэмтэй",
};

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("mn-MN");
};

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get("/test/history");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Түүх ачаалж чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Тестийн түүх
      </h1>

      {loading && <p className="text-gray-500">Ачааллаж байна...</p>}
      {!loading && items.length === 0 && (
        <p className="text-gray-500">Одоогоор тестийн түүх алга.</p>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-xl border border-orange-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Тестийн үр дүн
              </h2>
              <span className="text-sm text-gray-500">
                {formatDate(item.ognoo)}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(item.topThree || []).map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
                >
                  {t} - {TYPE_LABELS[t]}
                </span>
              ))}
            </div>
            {item.scores && (
              <div className="mt-4 grid grid-cols-3 md:grid-cols-6 gap-2 text-xs text-gray-600">
                {Object.entries(item.scores).map(([k, v]) => (
                  <div
                    key={k}
                    className="rounded-lg bg-orange-50 px-3 py-2 text-center"
                  >
                    <div className="font-semibold text-orange-600">{k}</div>
                    <div>{v} оноо</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
