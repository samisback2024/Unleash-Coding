import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Layers,
  FileText,
  Zap,
  FolderOpen,
  Users,
  Flag,
  Upload,
  ArrowRight,
} from "lucide-react";
import { getAdminStats } from "@/services/admin";
import { AdminStatsCard } from "@/components/admin";
import type { AdminStats } from "@/types";

const quickLinks = [
  {
    to: "/admin/paths",
    label: "Learning Paths",
    icon: BookOpen,
    color: "#6c63ff",
  },
  { to: "/admin/modules", label: "Modules", icon: Layers, color: "#10b981" },
  { to: "/admin/lessons", label: "Lessons", icon: FileText, color: "#3b82f6" },
  { to: "/admin/challenges", label: "Challenges", icon: Zap, color: "#f59e0b" },
  {
    to: "/admin/projects",
    label: "Projects",
    icon: FolderOpen,
    color: "#8b5cf6",
  },
  { to: "/admin/reports", label: "Reports", icon: Flag, color: "#ef4444" },
  { to: "/admin/users", label: "Users", icon: Users, color: "#06b6d4" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">Admin Dashboard</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Manage content, users, and community for Unleash Coding
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="h-24 bg-[#1e2130] border border-[#2a2d3e] rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatsCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="#06b6d4"
          />
          <AdminStatsCard
            icon={BookOpen}
            label="Learning Paths"
            value={stats.totalPaths}
            color="#6c63ff"
          />
          <AdminStatsCard
            icon={FileText}
            label="Lessons"
            value={stats.totalLessons}
            color="#3b82f6"
          />
          <AdminStatsCard
            icon={Zap}
            label="Challenges"
            value={stats.totalChallenges}
            color="#f59e0b"
          />
          <AdminStatsCard
            icon={FolderOpen}
            label="Projects"
            value={stats.totalProjects}
            color="#8b5cf6"
          />
          <AdminStatsCard
            icon={Upload}
            label="Submissions"
            value={stats.totalSubmissions}
            color="#10b981"
          />
          <AdminStatsCard
            icon={Flag}
            label="Pending Reports"
            value={stats.pendingReports}
            color={stats.pendingReports > 0 ? "#ef4444" : "#64748b"}
            subtext={stats.pendingReports > 0 ? "Needs attention" : "All clear"}
          />
        </div>
      ) : null}

      {/* Quick links */}
      <div>
        <h2 className="text-sm font-semibold text-[#94a3b8] mb-3 uppercase tracking-wider">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {quickLinks.map(({ to, label, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 p-4 bg-[#1e2130] border border-[#2a2d3e] rounded-xl hover:border-[#6c63ff]/40 hover:bg-[#252840] transition-all group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-sm font-medium text-[#94a3b8] group-hover:text-[#f1f5f9] transition-colors flex-1">
                {label}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#6c63ff] transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
