import { useEffect, useState } from "react";
import { getProjectReports, updateReportStatus } from "@/services/admin";
import type { AdminReport } from "@/types";

const STATUS_OPTIONS = ["pending", "reviewed", "resolved", "dismissed"];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  reviewed: "bg-blue-500/20 text-blue-400",
  resolved: "bg-green-500/20 text-green-400",
  dismissed: "bg-[#64748b]/20 text-[#64748b]",
};

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return new Date(isoDate).toLocaleDateString();
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    setLoading(true);
    setReports(await getProjectReports());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(report: AdminReport, status: string) {
    const result = await updateReportStatus(report.id, status);
    if (result.error) { showToast(result.error, "error"); return; }
    showToast("Report status updated.");
    setReports((prev) =>
      prev.map((r) => r.id === report.id ? { ...r, status } : r),
    );
  }

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.projectTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = reports.filter((r) => r.status === "pending").length;

  return (
    <div className="p-6 space-y-5">
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-xl ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>{toast.message}</div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#f1f5f9]">Project Reports</h1>
          <p className="text-sm text-[#64748b] mt-1">Review community-reported content</p>
        </div>
        {pendingCount > 0 && (
          <div className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-sm text-yellow-400 font-medium">
            {pendingCount} pending
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports…"
          className="flex-1 min-w-[200px] bg-[#1e2130] border border-[#2a2d3e] rounded-lg px-4 py-2 text-sm text-[#f1f5f9] placeholder-[#64748b] focus:outline-none focus:border-[#6c63ff]"
        />
        <div className="flex gap-1 bg-[#1e2130] border border-[#2a2d3e] rounded-lg p-1">
          {["all", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${
                statusFilter === s ? "bg-[#6c63ff] text-white" : "text-[#94a3b8] hover:text-[#f1f5f9]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                {["Project", "Reason", "Reporter ID", "Status", "Reported", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center">
                  <div className="w-6 h-6 border-2 border-[#6c63ff] border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-[#64748b]">
                  {search || statusFilter !== "all" ? "No matching reports." : "No reports yet — community is clean! ✓"}
                </td></tr>
              ) : filtered.map((r) => (
                <tr key={r.id} className="border-b border-[#2a2d3e] last:border-0 hover:bg-[#252840] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-[#f1f5f9] max-w-[180px] truncate">{r.projectTitle}</td>
                  <td className="px-4 py-3 text-sm text-[#94a3b8] max-w-[200px]">
                    <span className="line-clamp-2">{r.reason}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748b] font-mono">{r.reporterId.slice(0, 8)}…</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[r.status] ?? ""}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#64748b]">{timeAgo(r.createdAt)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => handleStatusChange(r, e.target.value)}
                      className="bg-[#0f1117] border border-[#2a2d3e] rounded px-2 py-1 text-xs text-[#f1f5f9] focus:outline-none focus:border-[#6c63ff]"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2 border-t border-[#2a2d3e] text-xs text-[#64748b]">
          {filtered.length} of {reports.length} reports
        </div>
      </div>
    </div>
  );
}
