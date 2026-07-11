import { useEffect, useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { FileText, Clock, Target, AlertTriangle, Calendar } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/useToast";
import {
  createDailyReport,
  getTodayReport,
} from "@/services/dailyReport.service";
import type { CreateDailyReport, DailyReport } from "@/types/dailyReport";

export default function DailyReports() {
  const { user } = useAuthContext();
  const toast = useToast();

  const [work, setWork] = useState("");
  const [hoursWorked, setHoursWorked] = useState<number | "">("");
  const [status, setStatus] = useState<"Completed" | "In Progress" | "Pending">("Completed");
  const [achievement, setAchievement] = useState("");
  const [problems, setProblems] = useState("");
  const [tomorrowPlan, setTomorrowPlan] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todayReport, setTodayReport] = useState<DailyReport | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const report = await getTodayReport(user.uid);
        if (!mounted) return;

        if (report) {
          setTodayReport(report);
          setWork(report.work || "");
          setHoursWorked(report.hoursWorked ?? "");
          setStatus(report.status);
          setAchievement(report.achievement || "");
          setProblems(report.problems || "");
          setTomorrowPlan((report as any).tomorrowPlan || "");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load today's report.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [user]);

  async function handleSubmit() {
    if (!user) return toast.error("User not authenticated.");

    // Prevent duplicate submission by checking again
    setSubmitting(true);
    try {
      const existing = await getTodayReport(user.uid);
      if (existing) {
        setTodayReport(existing);
        toast.info("You have already submitted today's report.");
        return;
      }

      const payload: CreateDailyReport = {
        staffId: user.uid,
        staffName: user.displayName || user.email || "Unknown",
        work,
        hoursWorked: Number(hoursWorked) || 0,
        status,
        achievement,
        problems,
        tomorrowPlan,
      };

      await createDailyReport(payload);

      toast.success("Daily report submitted.");
      const report = await getTodayReport(user.uid);
      setTodayReport(report);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit report.");
    } finally {
      setSubmitting(false);
    }
  }

  const isSubmitted = Boolean(todayReport);

  return (
    <div className="space-y-8">

      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/staff/dashboard" },
          { label: "Daily Reports" },
        ]}
      />

      <div>
        <h1 className="text-4xl font-bold text-white">Daily Work Report</h1>
        <p className="mt-2 text-gray-400">
          Submit your daily work report before leaving for the day.
        </p>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-8">

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid gap-6">

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                <FileText size={18} />
                Today's Work
              </label>

              <textarea
                rows={6}
                value={work}
                onChange={(e) => setWork(e.target.value)}
                disabled={isSubmitted}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 outline-none focus:border-blue-500"
                placeholder="Describe everything you worked on today..."
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                <Clock size={18} />
                Hours Worked
              </label>

              <input
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value === "" ? "" : Number(e.target.value))}
                disabled={isSubmitted}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 outline-none focus:border-blue-500"
                placeholder="8"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                <Target size={18} />
                Work Status
              </label>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                disabled={isSubmitted}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 outline-none focus:border-blue-500"
              >
                <option>Completed</option>
                <option>In Progress</option>
                <option>Pending</option>
              </select>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                <Target size={18} />
                Today's Achievement
              </label>

              <textarea
                rows={3}
                value={achievement}
                onChange={(e) => setAchievement(e.target.value)}
                disabled={isSubmitted}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 outline-none focus:border-blue-500"
                placeholder="What did you complete today?"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                <AlertTriangle size={18} />
                Problems Faced
              </label>

              <textarea
                rows={3}
                value={problems}
                onChange={(e) => setProblems(e.target.value)}
                disabled={isSubmitted}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 outline-none focus:border-blue-500"
                placeholder="Any blockers or issues?"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-gray-300">
                <Calendar size={18} />
                Plan For Tomorrow
              </label>

              <textarea
                rows={3}
                value={tomorrowPlan}
                onChange={(e) => setTomorrowPlan(e.target.value)}
                disabled={isSubmitted}
                className="w-full rounded-xl border border-gray-700 bg-gray-800 p-4 outline-none focus:border-blue-500"
                placeholder="What will you work on tomorrow?"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-300">Upload Screenshot / PDF (Optional)</label>
              <input type="file" className="w-full rounded-xl border border-gray-700 bg-gray-800 p-3" disabled={isSubmitted} />
            </div>

            <div>
              {isSubmitted ? (
                <div className="rounded-xl border border-green-700 bg-green-900/20 p-4 text-green-200">
                  You have already submitted today's report.
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-xl bg-blue-600 py-4 font-semibold transition hover:bg-blue-700"
                >
                  {submitting ? "Submitting..." : "Submit Daily Report"}
                </button>
              )}
            </div>

          </div>
        )}

      </div>

    </div>
  );
}