import { useEffect, useState } from "react";
import {
  MessageSquare,
  Bug,
  Palette,
  HelpCircle,
  Lightbulb,
  FileWarning,
  MoreHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { getFeedbackSummary, type FeedbackSummary } from "@/services/analytics";
import { updateFeedbackStatus } from "@/services/feedback";

const TYPE_META: Record<
  string,
  { label: string; icon: typeof Bug; color: string }
> = {
  bug: { label: "Bug", icon: Bug, color: "#ef4444" },
  design_issue: { label: "Design Issue", icon: Palette, color: "#a855f7" },
  confusing_flow: {
    label: "Confusing Flow",
    icon: HelpCircle,
    color: "#f59e0b",
  },
  feature_request: {
    label: "Feature Request",
    icon: Lightbulb,
    color: "#10b981",
  },
  content_issue: {
    label: "Content Issue",
    icon: FileWarning,
    color: "#3b82f6",
  },
  other: { label: "Other", icon: MoreHorizontal, color: "#94a3b8" },
};

const STATUS_OPTIONS = ["new", "reviewed", "resolved", "dismissed"] as const;

const STATUS_COLORS: Record<string, string> = {
  new: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
  reviewed: "bg-[#6c63ff]/10 text-[#6c63ff] border-[#6c63ff]/20",
  resolved: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20",
  dismissed: "bg-[#64748b]/10 text-[#64748b] border-[#64748b]/20",
};

export default function AdminFeedbackDashboardPage() {
  const { success, error: toastError } = useToast();
  const [summary, setSummary] = useState<FeedbackSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  function load() {
    setLoading(true);
    getFeedbackSummary().then((s) => {
      setSummary(s);
      setLoading(false);
    });
  }

  useEffect(load, []);

  async function handleStatusChange(
    id: string,
    status: "new" | "reviewed" | "resolved" | "dismissed",
  ) {
    const { error } = await updateFeedbackStatus(id, status);
    if (error) {
      toastError(error);
    } else {
      success("Status updated.");
      setSummary((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          recent: prev.recent.map((f) => (f.id === id ? { ...f, status } : f)),
        };
      });
    }
  }

  const filtered = summary?.recent.filter(
    (f) => filter === "all" || f.feedbackType === filter,
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#6c63ff] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">
            Feedback Dashboard
          </h1>
          <p className="text-sm text-[#64748b] mt-1">
            {summary?.total ?? 0} total feedback entries
          </p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-3 py-2 bg-[#1e2130] border border-[#2a2d3e] hover:border-[#6c63ff]/50 text-[#94a3b8] hover:text-[#f1f5f9] rounded-xl transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Type breakdown */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(TYPE_META).map(([type, meta]) => {
            const Icon = meta.icon;
            const count = summary.byType[type] ?? 0;
            return (
              <button
                key={type}
                onClick={() => setFilter(filter === type ? "all" : type)}
                className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                  filter === type
                    ? "border-[#6c63ff] bg-[#6c63ff]/10"
                    : "border-[#2a2d3e] bg-[#1e2130] hover:border-[#6c63ff]/40"
                }`}
              >
                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: meta.color }}
                />
                <div className="text-left min-w-0">
                  <p className="text-xs font-medium text-[#94a3b8] truncate">
                    {meta.label}
                  </p>
                  <p className="text-lg font-bold text-[#f1f5f9] leading-none">
                    {count}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Status summary */}
      {summary && (
        <div className="flex flex-wrap gap-3">
          {Object.entries(summary.byStatus).map(([status, count]) => (
            <span
              key={status}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[status] ?? "bg-[#2a2d3e] text-[#64748b] border-[#2a2d3e]"}`}
            >
              {count} {status}
            </span>
          ))}
        </div>
      )}

      {/* Feedback table */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-[#2a2d3e]">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#64748b]">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#64748b]">
                  Message
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#64748b]">
                  Page
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#64748b]">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-[#64748b]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {!filtered || filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-sm text-[#64748b]"
                  >
                    <MessageSquare className="w-8 h-8 text-[#2a2d3e] mx-auto mb-2" />
                    No feedback found
                  </td>
                </tr>
              ) : (
                filtered.map((f) => {
                  const meta = TYPE_META[f.feedbackType];
                  const Icon = meta?.icon ?? MoreHorizontal;
                  return (
                    <tr
                      key={f.id}
                      className="border-b border-[#2a2d3e]/50 hover:bg-[#252840]/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <Icon
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: meta?.color }}
                          />
                          <span className="text-xs text-[#94a3b8]">
                            {meta?.label ?? f.feedbackType}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <p className="text-[#f1f5f9] text-xs line-clamp-2">
                          {f.message}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] text-[#64748b]">
                          {f.pageUrl || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-[#64748b] whitespace-nowrap">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={f.status}
                          onChange={(e) =>
                            handleStatusChange(
                              f.id,
                              e.target.value as (typeof STATUS_OPTIONS)[number],
                            )
                          }
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-transparent cursor-pointer focus:outline-none ${STATUS_COLORS[f.status] ?? "border-[#2a2d3e] text-[#64748b]"}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option
                              key={s}
                              value={s}
                              className="bg-[#1e2130] text-[#f1f5f9]"
                            >
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
