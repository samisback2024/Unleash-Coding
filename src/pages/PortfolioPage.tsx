import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  CheckCircle,
  Clock,
  GitBranch,
  ExternalLink,
  FolderOpen,
  Star,
  Layers,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getUserProjectSubmissions } from "@/services/projects";
import { Badge } from "@/components/ui";
import type { ProjectSubmission } from "@/types";
import { supabase } from "@/lib/supabase";

interface ProjectMeta {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  portfolioLevel: string;
  pathTitle: string;
  pathSlug: string;
  pathColor: string;
  xpReward: number;
}

const DIFF_CONFIG = {
  beginner: { variant: "success" as const },
  intermediate: { variant: "warning" as const },
  advanced: { variant: "danger" as const },
};

const PORTFOLIO_COLORS: Record<string, string> = {
  "Beginner Portfolio": "#64748b",
  "Internship Ready": "#6c63ff",
  "Junior Developer Ready": "#10b981",
  "Advanced / Company-Level": "#f59e0b",
};

const STATUS_CONFIG = {
  submitted: { label: "Under Review", color: "#64748b" },
  reviewed: { label: "Reviewed", color: "#3b82f6" },
  approved: { label: "Approved", color: "#10b981" },
  revision_requested: { label: "Revision Requested", color: "#f59e0b" },
};

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-[#2a2d3e] rounded w-40" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-[#1e2130] border border-[#2a2d3e] rounded-2xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-[#1e2130] border border-[#2a2d3e] rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [metaMap, setMetaMap] = useState<Map<string, ProjectMeta>>(new Map());
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "submitted" | "approved"
  >("all");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;

      const { data: subs } = await getUserProjectSubmissions(user!.id);

      if (!subs.length) {
        if (!cancelled) setLoading(false);
        return;
      }

      const projectIds = subs.map((s) => s.projectId);

      // Fetch project + path metadata in one join
      const { data: projectRows } = await db
        .from("projects")
        .select(
          "id, title, description, difficulty, portfolio_level, xp_reward, learning_paths(title, slug, color)",
        )
        .in("id", projectIds);

      if (!cancelled) {
        const map = new Map<string, ProjectMeta>();
        if (projectRows) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          for (const row of projectRows as any[]) {
            const path = row.learning_paths ?? {};
            map.set(row.id, {
              id: row.id,
              title: row.title,
              description: row.description,
              difficulty: row.difficulty ?? "beginner",
              portfolioLevel: row.portfolio_level ?? "Beginner Portfolio",
              pathTitle: path.title ?? "",
              pathSlug: path.slug ?? "",
              pathColor: path.color ?? "#6c63ff",
              xpReward: row.xp_reward ?? 100,
            });
          }
        }
        setSubmissions(subs);
        setMetaMap(map);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const totalXp = submissions.reduce((s, x) => s + x.xpAwarded, 0);
  const approved = submissions.filter((s) => s.status === "approved").length;

  const filtered = submissions.filter((s) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "approved") return s.status === "approved";
    return (
      s.status === "submitted" ||
      s.status === "reviewed" ||
      s.status === "revision_requested"
    );
  });

  if (loading) return <PageSkeleton />;

  if (!submissions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#6c63ff]/10 flex items-center justify-center">
          <FolderOpen className="w-8 h-8 text-[#6c63ff]" />
        </div>
        <h2 className="text-xl font-bold text-[#f1f5f9]">
          Your Portfolio is Empty
        </h2>
        <p className="text-sm text-[#64748b] max-w-sm">
          Submit your first project to start building a portfolio that gets you
          hired.
        </p>
        <Link
          to="/projects"
          className="mt-2 px-5 py-2.5 rounded-xl bg-[#6c63ff] text-white text-sm font-semibold hover:bg-[#5a52e0] transition-colors"
        >
          Browse Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">My Portfolio</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Real projects you've built — ready to show employers.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          {
            label: "Projects Submitted",
            value: submissions.length,
            icon: Layers,
            color: "#6c63ff",
          },
          {
            label: "Approved",
            value: approved,
            icon: CheckCircle,
            color: "#10b981",
          },
          {
            label: "Total XP Earned",
            value: totalXp,
            icon: Zap,
            color: "#f59e0b",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl px-4 py-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
              <span className="text-xs text-[#64748b]">{s.label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {(["all", "approved", "submitted"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-sm px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
              activeFilter === f
                ? "bg-[#6c63ff] text-white"
                : "text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#2a2d3e]"
            }`}
          >
            {f === "submitted"
              ? "In Review"
              : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#64748b] text-sm">
          No projects in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((sub) => {
            const meta = metaMap.get(sub.projectId);
            if (!meta) return null;
            const diff =
              DIFF_CONFIG[meta.difficulty as keyof typeof DIFF_CONFIG] ??
              DIFF_CONFIG.beginner;
            const portfolioColor =
              PORTFOLIO_COLORS[meta.portfolioLevel] ?? "#64748b";
            const statusCfg =
              STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.submitted;

            return (
              <div
                key={sub.id}
                className={`bg-[#1e2130] border rounded-2xl p-5 ${
                  sub.status === "approved"
                    ? "border-[#10b981]/30"
                    : "border-[#2a2d3e]"
                }`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant={diff.variant}>{meta.difficulty}</Badge>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        backgroundColor: `${portfolioColor}18`,
                        color: portfolioColor,
                      }}
                    >
                      {meta.portfolioLevel}
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0"
                    style={{
                      backgroundColor: `${statusCfg.color}18`,
                      color: statusCfg.color,
                    }}
                  >
                    {statusCfg.label}
                  </span>
                </div>

                {/* Title + description */}
                <h3 className="text-sm font-semibold text-[#f1f5f9] mb-1 leading-snug">
                  {meta.title}
                </h3>
                <p className="text-xs text-[#64748b] line-clamp-2 mb-3">
                  {meta.description}
                </p>

                {/* Path chip */}
                <div className="flex items-center gap-1.5 mb-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: meta.pathColor }}
                  />
                  <Link
                    to={`/paths/${meta.pathSlug}`}
                    className="text-xs text-[#64748b] hover:text-[#f1f5f9] transition-colors"
                  >
                    {meta.pathTitle}
                  </Link>
                </div>

                {/* XP + date */}
                <div className="flex items-center justify-between text-xs text-[#64748b] mb-3">
                  <div className="flex items-center gap-1 text-[#6c63ff] font-semibold">
                    <Zap className="w-3 h-3" />+{sub.xpAwarded} XP
                  </div>
                  {sub.submittedAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                  )}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3 pt-3 border-t border-[#2a2d3e]">
                  {sub.githubUrl && (
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                    >
                      <GitBranch className="w-3.5 h-3.5" />
                      GitHub Repo
                    </a>
                  )}
                  {sub.demoUrl && (
                    <a
                      href={sub.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Demo
                    </a>
                  )}
                  {sub.status === "approved" && (
                    <span className="flex items-center gap-1 text-xs text-[#10b981] font-semibold ml-auto">
                      <Star className="w-3 h-3" />
                      Approved
                    </span>
                  )}
                </div>

                {/* Feedback */}
                {sub.feedback && (
                  <div className="mt-3 px-3 py-2 bg-[#0f1117] border border-[#2a2d3e] rounded-xl text-xs text-[#94a3b8] leading-relaxed">
                    <span className="font-semibold text-[#f1f5f9]">
                      Feedback:{" "}
                    </span>
                    {sub.feedback}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
