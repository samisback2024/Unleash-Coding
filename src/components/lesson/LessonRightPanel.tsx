import { CheckCircle, Circle, Zap, ArrowRight, Loader2 } from "lucide-react";
import { ProgressBar } from "@/components/ui";
import { clsx } from "clsx";

interface LessonRightPanelProps {
  pathTitle: string;
  pathColor: string;
  progressPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  xpEarned: number;
  isCompleted: boolean;
  quizAllAnswered: boolean;
  hasNote: boolean;
  onComplete: () => void;
  completing: boolean;
  hasNextLesson: boolean;
  onNext: () => void;
}

interface ChecklistItem {
  label: string;
  done: boolean;
}

export function LessonRightPanel({
  pathTitle,
  pathColor,
  progressPercent,
  lessonsCompleted,
  totalLessons,
  xpEarned,
  isCompleted,
  quizAllAnswered,
  hasNote,
  onComplete,
  completing,
  hasNextLesson,
  onNext,
}: LessonRightPanelProps) {
  const checklist: ChecklistItem[] = [
    { label: "Read the lesson", done: true },
    { label: "Answer quiz questions", done: quizAllAnswered },
    { label: "Add your own notes", done: hasNote },
    { label: "Mark as complete", done: isCompleted },
  ];

  return (
    <aside className="hidden lg:flex flex-col gap-4 w-[272px] shrink-0">
      {/* Path progress */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
        <p className="text-xs text-[#64748b] mb-1 truncate">{pathTitle}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[#e2e8f0]">
            Path Progress
          </span>
          <span className="text-xs font-semibold" style={{ color: pathColor }}>
            {progressPercent}%
          </span>
        </div>
        <ProgressBar
          value={progressPercent}
          colorClass="bg-[#6c63ff]"
          size="sm"
        />
        <p className="text-[10px] text-[#64748b] mt-2">
          {lessonsCompleted} / {totalLessons} lessons
        </p>
      </div>

      {/* XP */}
      <div
        className="border rounded-2xl p-4 flex items-center gap-3"
        style={{
          backgroundColor: `${pathColor}10`,
          borderColor: `${pathColor}30`,
        }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${pathColor}25` }}
        >
          <Zap className="w-4 h-4" style={{ color: pathColor }} />
        </div>
        <div>
          <p className="text-xs text-[#64748b]">XP Earned</p>
          <p className="text-lg font-bold text-[#f1f5f9]">{xpEarned}</p>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5">
        <p className="text-xs font-semibold text-[#f1f5f9] mb-4">
          Lesson Checklist
        </p>
        <ul className="space-y-3">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5">
              {item.done ? (
                <CheckCircle className="w-4 h-4 text-[#10b981] shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-[#3a3f52] shrink-0" />
              )}
              <span
                className={clsx(
                  "text-xs",
                  item.done ? "text-[#94a3b8] line-through" : "text-[#64748b]",
                )}
              >
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action button */}
      {!isCompleted ? (
        <button
          onClick={onComplete}
          disabled={completing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            bg-[#6c63ff] hover:bg-[#5a52e0] text-white text-sm font-semibold
            disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {completing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {completing ? "Saving…" : "Mark Complete"}
        </button>
      ) : hasNextLesson ? (
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            bg-[#10b981] hover:bg-[#059669] text-white text-sm font-semibold
            transition-all"
        >
          Next Lesson
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
          bg-[#10b981]/20 text-[#10b981] text-sm font-semibold"
        >
          <CheckCircle className="w-4 h-4" />
          Path Complete!
        </div>
      )}
    </aside>
  );
}
