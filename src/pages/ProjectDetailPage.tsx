import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Zap,
  CheckCircle,
  AlertCircle,
  Code2,
  Layers,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import {
  getProjectById,
  getProjectsByPathId,
  getProjectSubmission,
  submitProject,
} from "@/services/projects";
import {
  RequirementChecklist,
  ProjectSubmissionForm,
} from "@/components/project";
import { checkAndAwardAchievements } from "@/services/gamification";
import { CompletionCelebration } from "@/components/gamification";
import type { ProjectItem, ProjectSubmission, Achievement } from "@/types";
import { supabase } from "@/lib/supabase";

const DIFF_CONFIG = {
  beginner: { variant: "success" as const, color: "#10b981" },
  intermediate: { variant: "warning" as const, color: "#f59e0b" },
  advanced: { variant: "danger" as const, color: "#ef4444" },
};

const PORTFOLIO_COLORS: Record<string, string> = {
  "Beginner Portfolio": "#64748b",
  "Internship Ready": "#6c63ff",
  "Junior Developer Ready": "#10b981",
  "Advanced / Company-Level": "#f59e0b",
};

function ProjectDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-4 animate-pulse">
      <div className="h-5 bg-[#2a2d3e] rounded w-48" />
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-8 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 bg-[#2a2d3e] rounded w-24" />
          <div className="h-6 bg-[#2a2d3e] rounded w-32" />
        </div>
        <div className="h-8 bg-[#2a2d3e] rounded w-2/3" />
        <div className="h-4 bg-[#2a2d3e] rounded w-full" />
        <div className="h-4 bg-[#2a2d3e] rounded w-4/5" />
        <div className="space-y-2 pt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 bg-[#2a2d3e] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PathMeta {
  id: string;
  title: string;
  color: string;
}

export default function ProjectDetailPage() {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pathMeta, setPathMeta] = useState<PathMeta | null>(null);
  const [project, setProject] = useState<ProjectItem | null>(null);
  const [allProjects, setAllProjects] = useState<ProjectItem[]>([]);
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [xpJustEarned, setXpJustEarned] = useState(0);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    achievements: Achievement[];
  }>({ show: false, achievements: [] });

  // Load path meta
  useEffect(() => {
    if (!slug) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("learning_paths")
      .select("id, title, color")
      .eq("slug", slug)
      .single()
      .then(({ data }: { data: PathMeta | null }) => {
        if (data) setPathMeta(data);
      });
  }, [slug]);

  // Load project + submission
  useEffect(() => {
    if (!projectId || !pathMeta) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setSubmitted(false);
    setXpJustEarned(0);

    async function load() {
      const [{ data: proj, error: projErr }, { data: all }] = await Promise.all(
        [getProjectById(projectId!), getProjectsByPathId(pathMeta!.id)],
      );

      if (projErr || !proj) {
        if (!cancelled) {
          setError(projErr ?? "Project not found");
          setLoading(false);
        }
        return;
      }

      let sub: ProjectSubmission | null = null;
      if (user) sub = await getProjectSubmission(user.id, proj.id);

      if (!cancelled) {
        setProject(proj);
        setAllProjects(all);
        setSubmission(sub);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [projectId, pathMeta, user]);

  const handleSubmit = useCallback(
    async (githubUrl: string, demo: string, notes: string) => {
      if (!project || !user || !pathMeta) return;
      setSubmitting(true);

      const {
        submission: newSub,
        xpAwarded,
        error: submitErr,
      } = await submitProject(
        user.id,
        project.id,
        githubUrl,
        demo,
        notes,
        project.xpReward,
      );

      if (!submitErr && newSub) {
        setSubmission(newSub);
        setXpJustEarned(xpAwarded);
        setSubmitted(true);
        const newAch = await checkAndAwardAchievements(user.id);
        if (newAch.length > 0) {
          setCelebration({ show: true, achievements: newAch });
        }
      }

      setSubmitting(false);
    },
    [project, user, pathMeta],
  );

  const goTo = (id: string) => navigate(`/paths/${slug}/project/${id}`);
  const currentIndex = allProjects.findIndex((p) => p.id === project?.id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  if (loading) return <ProjectDetailSkeleton />;

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-[#ef4444]" />
        </div>
        <p className="text-[#94a3b8] text-sm">{error ?? "Project not found"}</p>
        <Link
          to={`/paths/${slug}`}
          className="text-sm text-[#6c63ff] hover:underline"
        >
          ← Back to path
        </Link>
      </div>
    );
  }

  const diff = DIFF_CONFIG[project.difficulty] ?? DIFF_CONFIG.beginner;
  const portfolioColor = PORTFOLIO_COLORS[project.portfolioLevel] ?? "#64748b";

  return (
    <>
      <CompletionCelebration
        show={celebration.show}
        achievements={celebration.achievements}
        xpGained={xpJustEarned}
        onClose={() => setCelebration({ show: false, achievements: [] })}
      />
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#64748b] mb-5">
        <Link
          to="/dashboard"
          className="hover:text-[#f1f5f9] transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        <Link
          to={`/paths/${slug}`}
          className="hover:text-[#f1f5f9] transition-colors truncate max-w-[120px]"
        >
          {pathMeta?.title}
        </Link>
        <span>/</span>
        <span className="text-[#94a3b8] truncate max-w-[160px]">
          {project.title}
        </span>
      </div>

      <div className="space-y-5">
        {/* Header card */}
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-[#2a2d3e]">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={diff.variant}>{project.difficulty}</Badge>
              <span
                className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{
                  backgroundColor: `${portfolioColor}18`,
                  color: portfolioColor,
                }}
              >
                {project.portfolioLevel}
              </span>
              {submission && (
                <Badge variant="success">
                  <CheckCircle className="w-3 h-3" />
                  {submission.status === "approved" ? "Approved" : "Submitted"}
                </Badge>
              )}
              {xpJustEarned > 0 && (
                <span className="flex items-center gap-1 text-xs font-semibold text-[#6c63ff]">
                  <Zap className="w-3.5 h-3.5" />+{xpJustEarned} XP earned!
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-[#f1f5f9]">
              {project.title}
            </h1>
            <p className="text-sm text-[#64748b] mt-1">{project.description}</p>

            {/* Meta pills */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
                <Clock className="w-3.5 h-3.5" />~{project.estimatedHours}h
                estimated
              </div>
              <div
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${diff.color}15`,
                  color: diff.color,
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                {project.xpReward} XP reward
              </div>
              {allProjects.length > 0 && (
                <span className="text-xs text-[#64748b]">
                  Project {currentIndex + 1} of {allProjects.length}
                </span>
              )}
            </div>
          </div>

          {/* Skills */}
          {project.skillsCovered.length > 0 && (
            <div className="px-6 sm:px-8 py-5 border-b border-[#2a2d3e]">
              <h2 className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5" />
                Skills You'll Build
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.skillsCovered.map((s) => (
                  <span
                    key={s}
                    className="text-xs px-2.5 py-1 rounded-full bg-[#6c63ff]/15 text-[#6c63ff] font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements checklist */}
          <div className="px-6 sm:px-8 py-6">
            <h2 className="text-sm font-semibold text-[#f1f5f9] mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6c63ff]" />
              Requirements Checklist
            </h2>
            <RequirementChecklist requirements={project.requirements} />
          </div>
        </div>

        {/* Existing submission links (if already submitted) */}
        {submission && (submission.githubUrl || submission.demoUrl) && (
          <div className="bg-[#1e2130] border border-[#10b981]/30 rounded-2xl px-6 py-5">
            <h2 className="text-sm font-semibold text-[#f1f5f9] mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#10b981]" />
              Your Submission
            </h2>
            <div className="flex flex-wrap gap-4">
              {submission.githubUrl && (
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  {submission.githubUrl}
                </a>
              )}
              {submission.demoUrl && (
                <a
                  href={submission.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {submission.demoUrl}
                </a>
              )}
            </div>
            {submission.notes && (
              <p className="text-xs text-[#64748b] mt-3 leading-relaxed">
                {submission.notes}
              </p>
            )}
          </div>
        )}

        {/* Submission form */}
        <ProjectSubmissionForm
          projectTitle={project.title}
          xpReward={project.xpReward}
          existing={submission}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitted={submitted}
          xpJustEarned={xpJustEarned}
        />

        {/* Footer nav */}
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl px-6 py-4 flex items-center justify-between gap-3">
          {prevProject ? (
            <button
              onClick={() => goTo(prevProject.id)}
              className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline truncate max-w-[140px]">
                {prevProject.title}
              </span>
              <span className="sm:hidden">Previous</span>
            </button>
          ) : (
            <Link
              to={`/paths/${slug}`}
              className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to path
            </Link>
          )}
          {nextProject ? (
            <button
              onClick={() => goTo(nextProject.id)}
              className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
            >
              <span className="hidden sm:inline truncate max-w-[140px]">
                {nextProject.title}
              </span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <span className="text-xs text-[#64748b]">Last project</span>
          )}
        </div>
      </div>
    </div>
    </>
  );
}
