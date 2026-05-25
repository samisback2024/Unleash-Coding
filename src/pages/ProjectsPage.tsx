import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, CheckCircle, Layers, Filter, FolderOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getProjectsWithStatus,
  getUserProjectStats,
} from "@/services/projects";
import { ProjectCard, ProjectProgress } from "@/components/project";
import type { ProjectWithStatus } from "@/types";
import { supabase } from "@/lib/supabase";

type DiffFilter = "all" | "beginner" | "intermediate" | "advanced";

interface PathGroup {
  id: string;
  title: string;
  slug: string;
  color: string;
  projects: ProjectWithStatus[];
}

function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-[#2a2d3e] rounded w-48" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-[#1e2130] border border-[#2a2d3e] rounded-2xl"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-52 bg-[#1e2130] border border-[#2a2d3e] rounded-2xl"
          />
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<PathGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [diff, setDiff] = useState<DiffFilter>("all");
  const [stats, setStats] = useState({
    totalSubmitted: 0,
    totalApproved: 0,
    totalXpFromProjects: 0,
  });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const db = supabase as any;

      const { data: enrollments } = await db
        .from("user_progress")
        .select("path_id")
        .eq("user_id", user!.id);

      if (!enrollments?.length) {
        if (!cancelled) setLoading(false);
        return;
      }

      const pathIds: string[] = enrollments.map(
        (e: { path_id: string }) => e.path_id,
      );

      const { data: paths } = await db
        .from("learning_paths")
        .select("id, title, slug, color")
        .in("id", pathIds);

      if (!paths?.length) {
        if (!cancelled) setLoading(false);
        return;
      }

      const [groupsData, statsData] = await Promise.all([
        Promise.all(
          (paths as PathGroup[]).map(async (p) => {
            const { data: projects } = await getProjectsWithStatus(
              p.id,
              user!.id,
            );
            return { ...p, projects };
          }),
        ),
        getUserProjectStats(user!.id),
      ]);

      if (!cancelled) {
        setGroups(groupsData.filter((g) => g.projects.length > 0));
        setStats({
          totalSubmitted: statsData.totalSubmitted,
          totalApproved: statsData.totalApproved,
          totalXpFromProjects: statsData.totalXpFromProjects,
        });
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const visibleGroup =
    activeTab === "all"
      ? {
          id: "all",
          title: "All Paths",
          slug: "",
          color: "#6c63ff",
          projects: groups.flatMap((g) => g.projects),
        }
      : groups.find((g) => g.id === activeTab);

  const filteredProjects = (visibleGroup?.projects ?? []).filter((p) =>
    diff === "all" ? true : p.difficulty === diff,
  );

  if (loading) return <PageSkeleton />;

  if (!groups.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#6c63ff]/10 flex items-center justify-center">
          <FolderOpen className="w-8 h-8 text-[#6c63ff]" />
        </div>
        <h2 className="text-xl font-bold text-[#f1f5f9]">No Projects Yet</h2>
        <p className="text-sm text-[#64748b] max-w-sm">
          Enroll in a learning path to unlock portfolio projects.
        </p>
        <Link
          to="/dashboard"
          className="mt-2 px-5 py-2.5 rounded-xl bg-[#6c63ff] text-white text-sm font-semibold hover:bg-[#5a52e0] transition-colors"
        >
          Browse Paths
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#f1f5f9]">
          Portfolio Projects
        </h1>
        <p className="text-sm text-[#64748b] mt-1">
          Build real projects that showcase your skills to employers.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: "Projects Submitted",
            value: stats.totalSubmitted,
            icon: CheckCircle,
            color: "#6c63ff",
          },
          {
            label: "Approved",
            value: stats.totalApproved,
            icon: CheckCircle,
            color: "#10b981",
          },
          {
            label: "XP Earned",
            value: stats.totalXpFromProjects,
            icon: Zap,
            color: "#f59e0b",
          },
          {
            label: "Total Projects",
            value: groups.reduce((s, g) => s + g.projects.length, 0),
            icon: Layers,
            color: "#64748b",
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

      {/* Path tabs */}
      {groups.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === "all"
                ? "bg-[#6c63ff] text-white"
                : "text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#2a2d3e]"
            }`}
          >
            All ({groups.reduce((s, g) => s + g.projects.length, 0)})
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveTab(g.id)}
              className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === g.id
                  ? "text-white"
                  : "text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#2a2d3e]"
              }`}
              style={activeTab === g.id ? { backgroundColor: g.color } : {}}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: g.color }}
              />
              {g.title.replace(" Developer", "").replace(" Path", "")} (
              {g.projects.length})
            </button>
          ))}
        </div>
      )}

      {/* Filter + progress row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#64748b]" />
          {(
            ["all", "beginner", "intermediate", "advanced"] as DiffFilter[]
          ).map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={`text-xs px-2.5 py-1 rounded-lg capitalize transition-colors ${
                diff === d
                  ? "bg-[#6c63ff] text-white"
                  : "text-[#64748b] hover:text-[#f1f5f9] hover:bg-[#2a2d3e]"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#64748b]">
          {filteredProjects.length} project
          {filteredProjects.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Projects grouped by path */}
      {activeTab === "all" ? (
        <div className="space-y-8">
          {groups.map((g) => {
            const pathProjects = g.projects.filter(
              (p) => diff === "all" || p.difficulty === diff,
            );
            if (!pathProjects.length) return null;
            const submitted = pathProjects.filter((p) => p.isSubmitted).length;
            const approved = pathProjects.filter((p) => p.isApproved).length;
            const xpAvailable = pathProjects.reduce(
              (s, p) => s + p.xpReward,
              0,
            );
            const xpEarned = pathProjects.reduce(
              (s, p) => s + (p.submission?.xpAwarded ?? 0),
              0,
            );

            return (
              <div key={g.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: g.color }}
                    />
                    <Link
                      to={`/paths/${g.slug}`}
                      className="text-sm font-semibold text-[#f1f5f9] hover:text-[#6c63ff] transition-colors"
                    >
                      {g.title}
                    </Link>
                  </div>
                  <ProjectProgress
                    total={pathProjects.length}
                    submitted={submitted}
                    approved={approved}
                    xpAvailable={xpAvailable}
                    xpEarned={xpEarned}
                    pathColor={g.color}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pathProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} slug={g.slug} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-[#64748b] text-sm">
              No {diff !== "all" ? diff : ""} projects found.
            </div>
          ) : (
            <>
              {(() => {
                const g = groups.find((x) => x.id === activeTab)!;
                const submitted = filteredProjects.filter(
                  (p) => p.isSubmitted,
                ).length;
                const approved = filteredProjects.filter(
                  (p) => p.isApproved,
                ).length;
                const xpAvailable = filteredProjects.reduce(
                  (s, p) => s + p.xpReward,
                  0,
                );
                const xpEarned = filteredProjects.reduce(
                  (s, p) => s + (p.submission?.xpAwarded ?? 0),
                  0,
                );
                return (
                  <div className="mb-4">
                    <ProjectProgress
                      total={filteredProjects.length}
                      submitted={submitted}
                      approved={approved}
                      xpAvailable={xpAvailable}
                      xpEarned={xpEarned}
                      pathColor={g.color}
                    />
                  </div>
                );
              })()}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((p) => {
                  const g = groups.find((x) => x.id === activeTab)!;
                  return <ProjectCard key={p.id} project={p} slug={g.slug} />;
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
