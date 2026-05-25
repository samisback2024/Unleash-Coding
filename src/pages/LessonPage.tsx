import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Clock,
  Zap,
} from "lucide-react";
import { Button, ProgressBar, Badge } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useUserProgress } from "@/hooks/useUserProgress";

// Sample lesson content used when paths don't yet have real lessons
const SAMPLE_LESSON = {
  title: "Introduction & Overview",
  duration: "15 min",
  type: "reading" as const,
  content: `
## Welcome to this module!

In this lesson you'll get a high-level overview of what you'll build and learn throughout this path.

### What you'll learn
- Core concepts and terminology
- The tools and technologies used
- How lessons, challenges, and projects work together
- Setting up your local development environment

### Prerequisites
You just need a working computer, internet access, and the drive to build things. 🚀

### How to get the most out of this path
1. **Read actively** — take notes, ask questions in your head.
2. **Do every challenge** — they reinforce concepts with real problems.
3. **Build the projects** — employers want to see working code.
4. **Go slow at first** — rushing leads to shaky foundations.

> "The expert in anything was once a beginner." — Helen Hayes

Hit **Mark Complete** when you're done to earn your XP and continue!
  `.trim(),
};

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string; lessonId?: string }>();
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [pathMeta, setPathMeta] = useState<{
    id: string;
    title: string;
    color: string;
    totalLessons: number;
  } | null>(null);

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
        },
      );
  }, [slug]);

  const effectiveLessonId = lessonId ?? "intro";
  const { enrollment, isEnrolled, markLessonComplete } = useUserProgress(
    pathMeta?.id,
    pathMeta?.totalLessons ?? 0,
  );
  const isAlreadyDone =
    enrollment?.completedLessonIds.includes(effectiveLessonId) ?? false;

  const handleComplete = async () => {
    await markLessonComplete(effectiveLessonId, 10);
    setCompleted(true);
    setXpEarned(10);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#64748b]">
        <Link
          to="/dashboard"
          className="hover:text-[#f1f5f9] transition-colors"
        >
          Dashboard
        </Link>
        <span>/</span>
        {pathMeta && (
          <>
            <Link
              to={`/paths/${slug}`}
              className="hover:text-[#f1f5f9] transition-colors"
            >
              {pathMeta.title}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[#94a3b8]">Lesson</span>
      </div>

      {/* Progress banner */}
      {pathMeta && (
        <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-4 flex items-center gap-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${pathMeta.color}20` }}
          >
            <BookOpen className="w-4 h-4" style={{ color: pathMeta.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#64748b]">Path Progress</span>
              <span className="text-xs text-[#6c63ff]">
                {enrollment?.percentComplete ?? 0}%
              </span>
            </div>
            <ProgressBar value={enrollment?.percentComplete ?? 0} size="sm" />
          </div>
        </div>
      )}

      {/* Lesson card */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl overflow-hidden">
        {/* Lesson header */}
        <div className="px-8 py-6 border-b border-[#2a2d3e]">
          <div className="flex items-center gap-3 mb-3">
            <Badge variant="accent">
              <BookOpen className="w-3 h-3" />
              Reading
            </Badge>
            <span className="text-xs text-[#64748b] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {SAMPLE_LESSON.duration}
            </span>
            {(completed || isAlreadyDone) && (
              <Badge variant="success">
                <CheckCircle className="w-3 h-3" />
                Completed
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-[#f1f5f9]">
            {SAMPLE_LESSON.title}
          </h1>
        </div>

        {/* Lesson body */}
        <div className="px-8 py-8">
          <div className="prose prose-invert max-w-none text-[#94a3b8] leading-relaxed space-y-4">
            {SAMPLE_LESSON.content.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="text-xl font-bold text-[#f1f5f9] mt-6 mb-3"
                  >
                    {block.slice(3)}
                  </h2>
                );
              }
              if (block.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="text-base font-semibold text-[#f1f5f9] mt-4 mb-2"
                  >
                    {block.slice(4)}
                  </h3>
                );
              }
              if (block.startsWith("> ")) {
                return (
                  <blockquote
                    key={i}
                    className="border-l-4 border-[#6c63ff] pl-4 italic text-[#64748b]"
                  >
                    {block.slice(2)}
                  </blockquote>
                );
              }
              if (block.match(/^\d\./m)) {
                return (
                  <ol key={i} className="list-decimal list-inside space-y-1">
                    {block.split("\n").map((line, j) => (
                      <li key={j} className="text-sm">
                        {line
                          .replace(/^\d+\.\s\*\*(.+?)\*\*/, (_, b) => b)
                          .replace(/^\d+\.\s/, "")}
                      </li>
                    ))}
                  </ol>
                );
              }
              if (block.startsWith("- ")) {
                return (
                  <ul key={i} className="list-disc list-inside space-y-1">
                    {block.split("\n").map((line, j) => (
                      <li key={j} className="text-sm">
                        {line.slice(2)}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={i} className="text-sm leading-7">
                  {block}
                </p>
              );
            })}
          </div>
        </div>

        {/* Lesson footer */}
        <div className="px-8 py-6 border-t border-[#2a2d3e] flex items-center justify-between gap-4">
          <Link to={pathMeta ? `/paths/${slug}` : "/dashboard"}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Path
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            {xpEarned > 0 && (
              <div className="flex items-center gap-1.5 text-sm text-[#6c63ff] font-medium">
                <Zap className="w-4 h-4" />+{xpEarned} XP
              </div>
            )}
            {!(completed || isAlreadyDone) ? (
              <Button onClick={handleComplete} disabled={!isEnrolled}>
                <CheckCircle className="w-4 h-4" />
                {isEnrolled ? "Mark Complete" : "Enroll to track"}
              </Button>
            ) : (
              <Button>
                Next Lesson
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
