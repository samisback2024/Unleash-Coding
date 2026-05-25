import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Star,
  Users,
  Zap,
  BookOpen,
  Code2,
  FolderOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Trophy,
  Play,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Badge,
  ProgressBar,
  PathDetailSkeleton,
} from "@/components/ui";
import { getLearningPathBySlug } from "@/services/learningPaths";
import type { Module, LearningPath } from "@/types";

type TabId = "curriculum" | "challenges" | "projects" | "checklist";

const TABS: {
  id: TabId;
  label: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  { id: "curriculum", label: "Curriculum", icon: BookOpen },
  { id: "challenges", label: "Challenges", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "checklist", label: "Job Checklist", icon: CheckCircle },
];

function ModuleAccordion({ mod, level }: { mod: Module; level: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#2a2d3e] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[#252840] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
              level === "beginner"
                ? "bg-[#10b981]/15 text-[#10b981]"
                : level === "intermediate"
                  ? "bg-[#f59e0b]/15 text-[#f59e0b]"
                  : "bg-[#ef4444]/15 text-[#ef4444]"
            }`}
          >
            {level}
          </span>
          <span className="text-sm font-medium text-[#f1f5f9]">
            {mod.title}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#64748b]">
          <span>{mod.duration}</span>
          {open ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 bg-[#161925]">
          <p className="text-sm text-[#64748b] mb-3 pt-2">{mod.description}</p>
          {mod.lessons.length === 0 ? (
            <p className="text-xs text-[#2a2d3e] italic">
              Lessons will be added soon.
            </p>
          ) : (
            <ul className="space-y-2">
              {mod.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className="flex items-center gap-2 text-sm text-[#94a3b8]"
                >
                  <Play className="w-3.5 h-3.5 text-[#6c63ff]" />
                  {lesson.title}
                  <span className="ml-auto text-xs text-[#64748b]">
                    {lesson.duration}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function PathDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("curriculum");

  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setFetchError(null);
    getLearningPathBySlug(slug).then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        setFetchError(error);
      } else {
        setPath(data);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) return <PathDetailSkeleton />;

  if (fetchError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-[#ef4444]/10 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-[#ef4444]" />
        </div>
        <div>
          <p className="text-[#f1f5f9] font-medium mb-1">Failed to load path</p>
          <p className="text-xs text-[#64748b]">{fetchError}</p>
        </div>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-[#64748b] text-lg">Path not found.</p>
        <Button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const totalModules =
    path.beginnerModules.length +
    path.intermediateModules.length +
    path.advancedModules.length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Hero card */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 border"
        style={{
          borderColor: `${path.color}40`,
          background: `linear-gradient(135deg, ${path.color}15, #1e2130)`,
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ background: path.color, transform: "translate(30%, -40%)" }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
              style={{ backgroundColor: `${path.color}25` }}
            >
              {path.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  variant={
                    path.difficulty === "beginner"
                      ? "success"
                      : path.difficulty === "intermediate"
                        ? "warning"
                        : "danger"
                  }
                >
                  {path.difficulty}
                </Badge>
                <span className="text-xs text-[#64748b]">·</span>
                <span className="text-xs text-[#64748b] flex items-center gap-1">
                  <Star className="w-3 h-3 fill-[#f59e0b] text-[#f59e0b]" />
                  {path.rating} rating
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#f1f5f9]">
                {path.title}
              </h1>
              <p className="text-[#94a3b8] text-sm mt-1 max-w-lg">
                {path.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 shrink-0">
            <Link to={`/paths/${path.slug}/lesson/start`}>
              <Button size="lg" fullWidth className="shadow-lg">
                <Play className="w-4 h-4" />
                Start Path
              </Button>
            </Link>
            <Button variant="secondary" size="lg" fullWidth>
              Save for Later
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Clock, label: "Timeline", value: path.estimatedTimeline },
            {
              icon: Zap,
              label: "Weekly Hours",
              value: `${path.weeklyHours}h / week`,
            },
            { icon: BookOpen, label: "Lessons", value: `${path.totalLessons}` },
            {
              icon: Users,
              label: "Enrolled",
              value: path.enrolled?.toLocaleString() ?? "—",
            },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-[#0f1117]/40 border border-[#2a2d3e] rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5 text-[#64748b]" />
                <span className="text-xs text-[#64748b]">{label}</span>
              </div>
              <div className="text-sm font-semibold text-[#f1f5f9]">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress card */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-[#f1f5f9]">
            Your Progress
          </span>
          <span className="text-sm text-[#6c63ff] font-semibold">0%</span>
        </div>
        <ProgressBar value={0} showLabel={false} />
        <p className="text-xs text-[#64748b] mt-2">
          0 / {path.totalLessons} lessons completed
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#2a2d3e]">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === id
                  ? "border-[#6c63ff] text-[#6c63ff]"
                  : "border-transparent text-[#64748b] hover:text-[#94a3b8]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="pb-12">
        {/* Curriculum */}
        {activeTab === "curriculum" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#64748b]">
                {totalModules} modules across 3 levels
              </p>
            </div>
            {path.beginnerModules.map((m) => (
              <ModuleAccordion key={m.id} mod={m} level="beginner" />
            ))}
            {path.intermediateModules.map((m) => (
              <ModuleAccordion key={m.id} mod={m} level="intermediate" />
            ))}
            {path.advancedModules.map((m) => (
              <ModuleAccordion key={m.id} mod={m} level="advanced" />
            ))}
          </div>
        )}

        {/* Challenges */}
        {activeTab === "challenges" && (
          <div className="space-y-4">
            <p className="text-sm text-[#64748b]">
              {path.challenges.length} challenges included
            </p>
            {path.challenges.map((c) => (
              <div
                key={c.id}
                className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-5 flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-[#f1f5f9]">
                      {c.title}
                    </h3>
                    <Badge
                      variant={
                        c.difficulty === "beginner"
                          ? "success"
                          : c.difficulty === "intermediate"
                            ? "warning"
                            : "danger"
                      }
                    >
                      {c.difficulty}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#64748b]">{c.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-[#6c63ff] font-medium">
                    <Zap className="w-3.5 h-3.5" />
                    {c.xp} XP
                  </div>
                  <Link to={`/paths/${path.slug}/challenge/${c.id}`}>
                    <Button size="sm" variant="secondary">
                      Start
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeTab === "projects" && (
          <div className="space-y-4">
            <p className="text-sm text-[#64748b]">
              {path.projects.length + 1} projects (including capstone)
            </p>
            {path.projects.map((p) => (
              <div
                key={p.id}
                className="bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#f1f5f9] mb-1">
                      {p.title}
                    </h3>
                    <p className="text-sm text-[#64748b]">{p.description}</p>
                  </div>
                  <Badge
                    variant={
                      p.difficulty === "beginner"
                        ? "success"
                        : p.difficulty === "intermediate"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {p.difficulty}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.techStack.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-full bg-[#2a2d3e] text-[#94a3b8]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748b] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {p.estimatedTime}
                  </span>
                  <Link to={`/paths/${path.slug}/project/${p.id}`}>
                    <Button size="sm" variant="secondary">
                      View Project
                    </Button>
                  </Link>
                </div>
              </div>
            ))}

            {/* Capstone */}
            <div className="bg-gradient-to-br from-[#6c63ff]/15 to-[#a855f7]/10 border border-[#6c63ff]/40 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-4 h-4 text-[#f59e0b]" />
                <span className="text-xs font-semibold text-[#f59e0b] uppercase tracking-wider">
                  Capstone Project
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#f1f5f9] mb-2">
                {path.capstoneProject.title}
              </h3>
              <p className="text-sm text-[#94a3b8] mb-4">
                {path.capstoneProject.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {path.capstoneProject.techStack.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full bg-[#6c63ff]/20 text-[#6c63ff]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Job Checklist */}
        {activeTab === "checklist" && (
          <div className="space-y-3">
            <p className="text-sm text-[#64748b] mb-4">
              Complete these to be job-ready in {path.title}
            </p>
            {path.jobReadyChecklist.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#1e2130] border border-[#2a2d3e] rounded-xl p-4"
              >
                <div className="w-5 h-5 rounded-full border-2 border-[#2a2d3e] mt-0.5 shrink-0 flex items-center justify-center">
                  <span className="text-[10px] text-[#64748b] font-bold">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-[#94a3b8]">{item}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
