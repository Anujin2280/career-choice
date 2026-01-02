import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import DashboardCards from "./DashboardCards";
import AdminUsersSection from "./AdminUsersSection";
import AdminProfessionsSection from "./AdminProfessionsSection";
import AdminQuestionsSection from "./AdminQuestionsSection";
import AdminMbtiQuestionsSection from "./AdminMbtiQuestionsSection";
import AdminMbtiTypesSection from "./AdminMbtiTypesSection";

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [summary, setSummary] = useState({
    users: 0,
    professions: 0,
    questions: 0,
    mbtiQuestions: 0,
    mbtiTypes: 0,
  });
  const [loadingSummary, setLoadingSummary] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoadingSummary(true);
    try {
      const { data } = await api.get("/admin/summary");
      setSummary({
        users: data?.users ?? 0,
        professions: data?.professions ?? 0,
        questions: data?.questions ?? 0,
        mbtiQuestions: data?.mbtiQuestions ?? 0,
        mbtiTypes: data?.mbtiTypes ?? 0,
      });
    } catch (error) {
      toast.error(
        getErrorMessage(error, "Хураангуй мэдээлэл ачаалж чадсангүй.")
      );
    } finally {
      setLoadingSummary(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <div className="flex min-h-screen bg-[#fdf5ef] overflow-hidden">
      <AdminSidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        toggleSidebar={() => setCollapsed(!collapsed)}
      />

      <div className="flex-1 flex flex-col">
        <AdminTopbar />

        <main className="flex-1 p-10 overflow-y-auto space-y-8">
          {active === "dashboard" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Хяналтын самбар
              </h3>
              <DashboardCards summary={summary} onSelect={setActive} />
              {loadingSummary && (
                <p className="text-sm text-gray-500 mt-4">Ачааллаж байна...</p>
              )}
            </div>
          )}

          {active === "users" && (
            <AdminUsersSection
              total={summary.users}
              onRefreshSummary={fetchSummary}
            />
          )}

          {active === "professions" && (
            <AdminProfessionsSection
              total={summary.professions}
              onRefreshSummary={fetchSummary}
            />
          )}

          {active === "questions" && (
            <AdminQuestionsSection
              total={summary.questions}
              onRefreshSummary={fetchSummary}
            />
          )}

          {active === "mbti-questions" && (
            <AdminMbtiQuestionsSection
              total={summary.mbtiQuestions}
              onRefreshSummary={fetchSummary}
            />
          )}

          {active === "mbti-types" && (
            <AdminMbtiTypesSection
              total={summary.mbtiTypes}
              onRefreshSummary={fetchSummary}
            />
          )}
        </main>
      </div>
    </div>
  );
}
