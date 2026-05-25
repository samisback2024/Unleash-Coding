import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Menu,
  Zap,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useAuth } from "@/context/AuthContext";
import {
  getLessonById,
  getModulesWithLessons,
  getAdjacentLessons,
  getLessonQuizzes,
} from "@/services/lesson";
import {
  LessonSidebar,
  LessonContent,
  LessonQuiz,
  LessonNotes,
  LessonRightPanel,
} from "@/components/lesson";
import { checkAndAwardAchievements } from "@/services/gamification";
import { CompletionCelebration } from "@/components/gamification";
import type {
  LessonWithModule,
  ModuleWithLessons,
  LessonNavItem,
  LessonQuizItem,
  Achievement,
} from "@/types";

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function LessonSkeleton() {
  return (
    <div className="flex gap-6 animate-pulse">
      <aside className="hidden lg:block w-[260px] shrink-0">
        <div className="h-screen bg-[#1e2130] rounded-2xl" />
      </aside>
      <div className="flex-1 space-y-4 pt-2">
        <div className="h-5 bg-[#2a2d3e] rounded w-48" />
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-8 space-y-4">
          <div className="flex gap-2">
            <div className="h-5 bg-[#2a2d3e] rounded w-16" />
            <div className="h-5 bg-[#2a2d3e] rounded w-20" />
          </div>
          <div className="h-8 bg-[#2a2d3e] rounded w-2/3" />
          <div className="space-y-2 pt-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-[#2a2d3e] rounded"
                style={{ width: `${85 - i * 5}%` }}
              />
            ))}
          </div>
        </div>
      </div>
      <aside className="hidden lg:block w-[272px] shrink-0 space-y-4">
        <div className="h-28 bg-[#1e2130] rounded-2xl" />
        <div className="h-20 bg-[#1e2130] rounded-2xl" />
        <div className="h-44 bg-[#1e2130] rounded-2xl" />
        <div className="h-12 bg-[#1e2130] rounded-2xl" />
      </aside>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface PathMeta {
  id: string;
  title: string;
  color: string;
  totalLessons: number;
}

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pathMeta, setPathMeta] = useState<PathMeta | null>(null);
  const [lesson, setLesson] = useState<LessonWithModule | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [adjacent, setAdjacent] = useState<{
    prev: LessonNavItem | null;
    next: LessonNavItem | null;
  }>({ prev: null, next: null });
  const [quizzes, setQuizzes] = useState<LessonQuizItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [xpJustEarned, setXpJustEarned] = useState(0);
  const [quizAllAnswered, setQuizAllAnswered] = useState(false);
  const [noteHasContent, setNoteHasContent] = useState(false);
  const [celebration, setCelebration] = useState<{
    show: boolean;
    achievements: Achievement[];
  }>({ show: false, achievements: [] });

  const { enrollment, markLessonComplete } = useUserProgress(
    pathMeta?.id,
    pathMeta?.totalLessons ?? 0,
  );
  const isCompleted = !!(
    lesson && enrollment?.completedLessonIds.includes(lesson.id)
  );

  // Step 1: fetch path meta
  useEffect(() => {
    if (!slug) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("learning_paths")
      .select("id, title, color, total_lessons")
      .eq("slug", slug)
      .single()
      .then(
        ({
          data,
        }: {
          data: {
            id: string;
            title: string;
            color: string;
            total_lessons: number;
          } | null;
        }) => {
          if (data)
            setPathMeta({
              id: data.id,
              title: data.title,
              color: data.color,
              totalLessons: data.total_lessons,
            });
          else setError("Learning path not found.");
        },
      );
  }, [slug]);

  // Step 2: load lesson data once pathMeta is ready
  useEffect(() => {
    if (!pathMeta) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load() {
      const { data: mods } = await getModulesWithLessons(pathMeta!.id);
      if (!cancelled) setModules(mods);

      if (!lessonId || lessonId === "start") {
        const first = mods[0]?.lessons[0];
        if (first)
          navigate(`/paths/${slug}/lesson/${first.id}`, { replace: true });
        else if (!cancelled) {
          setError("No lessons available yet.");
          setLoading(false);
        }
        return;
      }

      const { data: lessonData, error: lessonError } =
        await getLessonById(lessonId);
      if (lessonError || !lessonData) {
        if (!cancelled) {
          setError(lessonError ?? "Lesson not found.");
          setLoading(false);
        }
        return;
      }
      if (!cancelled) setLesson(lessonData);

      const [adj, { data: quizData }] = await Promise.all([
        getAdjacentLessons(lessonId, pathMeta!.id),
        getLessonQuizzes(lessonId),
      ]);

      if (!cancelled) {
        setAdjacent(adj);
        setQuizzes(quizData);
        setQuizAllAnswered(false);
        setNoteHasContent(false);
        setXpJustEarned(0);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [pathMeta, lessonId, slug, navigate]);

  const handleComplete = useCallback(async () => {
    if (!lesson || completing || isCompleted) return;
    setCompleting(true);
    await markLessonComplete(lesson.id, 10);
    setXpJustEarned(10);
    if (user) {
      const newAch = await checkAndAwardAchievements(user.id);
      if (newAch.length > 0) {
        setCelebration({ show: true, achievements: newAch });
      }
    }
    setCompleting(false);
  }, [lesson, completing, isCompleted, markLessonComplete, user]);

  const goNext = useCallback(() => {
    if (adjacent.next) navigate(`/paths/${slug}/lesson/${adjacent.next.id}`);
  }, [adjacent.next, slug, navigate]);

  const goPrev = useCallback(() => {
    if (adjacent.prev) navigate(`/paths/${slug}/lesson/${adjacent.prev.id}`);
  }, [adjacent.prev, slug, navigate]);

  if (loading) return <LessonSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#ef4444]/10 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-[#ef4444]" />
        </div>
        <p className="text-[#94a3b8] text-sm">{error}</p>
        <Link
          to={`/paths/${slug}`}
          className="text-sm text-[#6c63ff] hover:underline"
        >
          ← Back to path
        </Link>
      </div>
    );
  }

  if (!lesson) return null;

  const typeLabel =
    lesson.type === "video"
      ? "Video"
      : lesson.type === "interactive"
        ? "Interactive"
        : "Reading";

  return (
    <>
      <CompletionCelebration
        show={celebration.show}
        achievements={celebration.achievements}
        xpGained={xpJustEarned}
        onClose={() => setCelebration({ show: false, achievements: [] })}
      />
      <div className="flex gap-0 lg:gap-6 relative">
        {/* Sidebar */}
        <LessonSidebar
          modules={modules}
          currentLessonId={lesson.id}
          completedLessonIds={enrollment?.completedLessonIds ?? []}
          slug={slug ?? ""}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#64748b] mb-5">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg bg-[#1e2130] border border-[#2a2d3e] text-[#64748b] hover:text-[#f1f5f9] transition-colors mr-1"
            >
              <Menu className="w-4 h-4" />
            </button>
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
              {lesson.title}
            </span>
          </div>

          {/* Lesson card */}
          <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 sm:px-8 py-6 border-b border-[#2a2d3e]">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="accent">
                  <BookOpen className="w-3 h-3" />
                  {typeLabel}
                </Badge>
                <span className="text-xs text-[#64748b] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {lesson.duration}
                </span>
                {isCompleted && (
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3" />
                    Completed
                  </Badge>
                )}
                {xpJustEarned > 0 && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#6c63ff]">
                    <Zap className="w-3.5 h-3.5" />+{xpJustEarned} XP earned!
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-[#f1f5f9]">
                {lesson.title}
              </h1>
              <p className="text-xs text-[#64748b] mt-1">
                {lesson.moduleTitle}
              </p>
            </div>

            {/* Content */}
            <div className="px-6 sm:px-8 py-8">
              {lesson.content ? (
                <LessonContent content={lesson.content} />
              ) : (
                <div className="py-12 text-center text-[#64748b] text-sm">
                  Content coming soon.
                </div>
              )}
              {user && quizzes.length > 0 && (
                <LessonQuiz
                  quizzes={quizzes}
                  userId={user.id}
                  onAllAnswered={() => setQuizAllAnswered(true)}
                />
              )}
              {user && (
                <LessonNotes
                  userId={user.id}
                  lessonId={lesson.id}
                  onChange={setNoteHasContent}
                />
              )}
            </div>

            {/* Footer nav */}
            <div className="px-6 sm:px-8 py-5 border-t border-[#2a2d3e] flex items-center justify-between gap-3">
              {adjacent.prev ? (
                <button
                  onClick={goPrev}
                  className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline truncate max-w-[140px]">
                    {adjacent.prev.title}
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

              {/* Mobile complete/next */}
              <div className="lg:hidden flex items-center gap-2">
                {!isCompleted ? (
                  <button
                    onClick={handleComplete}
                    disabled={completing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-medium disabled:opacity-60 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {completing ? "Saving…" : "Mark Complete"}
                  </button>
                ) : adjacent.next ? (
                  <button
                    onClick={goNext}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10b981] text-white text-sm font-medium"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}
              </div>

              {adjacent.next ? (
                <button
                  onClick={goNext}
                  className="hidden lg:flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#f1f5f9] transition-colors"
                >
                  <span className="truncate max-w-[140px]">
                    {adjacent.next.title}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="hidden lg:block text-xs text-[#64748b]">
                  Last lesson
                </span>
              )}
            </div>
          </div>
        </main>

        {/* Right panel */}
        <LessonRightPanel
          pathTitle={pathMeta?.title ?? ""}
          pathColor={pathMeta?.color ?? "#6c63ff"}
          progressPercent={enrollment?.percentComplete ?? 0}
          lessonsCompleted={enrollment?.completedLessonIds.length ?? 0}
          totalLessons={pathMeta?.totalLessons ?? 0}
          xpEarned={enrollment?.xpEarned ?? 0}
          isCompleted={isCompleted}
          quizAllAnswered={quizAllAnswered}
          hasNote={noteHasContent}
          onComplete={handleComplete}
          completing={completing}
          hasNextLesson={!!adjacent.next}
          onNext={goNext}
        />
      </div>
    </>
  );
}
