import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Search, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import {
  getDailyReports,
  deleteDailyReport,
} from "@/services/dailyReport.service";
import type { DailyReport } from "@/types/dailyReport";

export default function AdminDailyReports() {
  const toast = useToast();

  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [selected, setSelected] = useState<DailyReport | null>(null);

  async function load() {
    setLoading(true);
    try {
      const data = await getDailyReports();
      setReports(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = r.staffName.toLowerCase().includes(search.toLowerCase());
      const matchesDate = filterDate ? r.reportDate === filterDate : true;
      return matchesSearch && matchesDate;
    });
  }, [reports, search, filterDate]);

  async function handleDelete(id: string) {
    const ok = window.confirm("Delete this report? This action cannot be undone.");
    if (!ok) return;
    try {
      await deleteDailyReport(id);
      toast.success("Report deleted.");
      await load();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete report.");
    }
  }

  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[{ label: "Dashboard", href: "/admin/dashboard" }, { label: "Daily Reports" }]}
      />

      <div>
        <h1 className="text-3xl font-bold text-white">Daily Reports</h1>
        <p className="mt-2 text-gray-400">View and manage staff daily reports.</p>
      </div>

      <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 w-full md:w-1/2">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search by staff name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 outline-none"
            />

            <button
              onClick={() => { setFilterDate(""); setSearch(""); }}
              className="rounded-lg bg-gray-800 px-3 py-2 border border-gray-700"
            >
              Reset
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400">Loading reports...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">No reports found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-lg">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Staff</th>
                  <th className="p-3 text-left">Work</th>
                  <th className="p-3 text-left">Hours</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="p-3">{r.reportDate}</td>
                    <td className="p-3">{r.staffName}</td>
                    <td className="p-3">{r.work.slice(0, 80)}{r.work.length > 80 ? "..." : ""}</td>
                    <td className="p-3">{r.hoursWorked}</td>
                    <td className="p-3">{r.status}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => setSelected(r)} className="rounded bg-blue-600 px-3 py-1 text-white"> <Eye size={14} /> </button>
                      <button onClick={() => handleDelete(r.id)} className="rounded bg-red-600 px-3 py-1 text-white"> <Trash2 size={14} /> </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="max-w-2xl w-full rounded-xl bg-gray-900 border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-2">Report by {selected.staffName}</h2>
            <p className="text-sm text-gray-400 mb-4">Date: {selected.reportDate} • Submitted: {new Date(selected.submittedAt).toLocaleString()}</p>

            <div className="space-y-3 text-gray-200">
              <div>
                <h3 className="text-sm text-gray-300 font-semibold">Work</h3>
                <p className="mt-1">{selected.work}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-300 font-semibold">Achievement</h3>
                <p className="mt-1">{selected.achievement}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-300 font-semibold">Problems</h3>
                <p className="mt-1">{selected.problems}</p>
              </div>

              <div>
                <h3 className="text-sm text-gray-300 font-semibold">Plan For Tomorrow</h3>
                <p className="mt-1">{(selected as any).tomorrowPlan}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setSelected(null)} className="rounded bg-gray-700 px-4 py-2">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}