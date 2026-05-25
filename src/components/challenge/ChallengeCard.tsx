import { Link } from "react-router-dom";
import { Zap, CheckCircle, Code2, Lock } from "lucide-react";
import { Badge } from "@/components/ui";
import { clsx } from "clsx";
import type { ChallengeWithStatus } from "@/types";

const DIFFICULTY_CONFIG = {
  beginner: { variant: "success" as const, label: "Beginner" },
  intermediate: { variant: "warning" as const, label: "Intermediate" },
  advanced: { variant: "danger" as const, label: "Advanced" },
};

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: "Multiple Choice",
  short_answer: "Short Answer",
  code_reading: "Code Reading",
  debugging: "Debugging",
  algorithm: "Algorithm",
  scenario: "Scenario",
  implementation: "Implementation",
};

interface ChallengeCardProps {
  challenge: ChallengeWithStatus;
  slug: string;
}

export function ChallengeCard({ challenge, slug }: ChallengeCardProps) {
  const diff =
    DIFFICULTY_CONFIG[challenge.difficulty] ?? DIFFICULTY_CONFIG.beginner;

  return (
    <Link to={`/paths/${slug}/challenge/${challenge.id}`}>
      <div
        className={clsx(
          "group bg-[#1e2130] border rounded-2xl p-5 transition-all hover:border-[#6c63ff]/50 hover:-translate-y-0.5",
          challenge.isCompleted ? "border-[#10b981]/30" : "border-[#2a2d3e]",
        )}
      >
        {/* Top row: type + completion */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] text-[#64748b] uppercase tracking-widest font-medium">
            {TYPE_LABELS[challenge.challengeType] ?? challenge.challengeType}
          </span>
          {challenge.isCompleted ? (
            <span className="flex items-center gap-1 text-[10px] text-[#10b981] font-semibold">
              <CheckCircle className="w-3.5 h-3.5" />
              Solved
            </span>
          ) : challenge.attemptCount > 0 ? (
            <span className="text-[10px] text-[#f59e0b] font-medium">
              {challenge.attemptCount} attempt
              {challenge.attemptCount !== 1 ? "s" : ""}
            </span>
          ) : null}
        </div>

        {/* Icon + title */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={clsx(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
              challenge.isCompleted
                ? "bg-[#10b981]/15"
                : "bg-[#6c63ff]/10 group-hover:bg-[#6c63ff]/20",
            )}
          >
            {challenge.isCompleted ? (
              <CheckCircle className="w-5 h-5 text-[#10b981]" />
            ) : (
              <Code2
                className={clsx(
                  "w-5 h-5",
                  challenge.difficulty === "advanced"
                    ? "text-[#ef4444]"
                    : challenge.difficulty === "intermediate"
                      ? "text-[#f59e0b]"
                      : "text-[#6c63ff]",
                )}
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-[#f1f5f9] group-hover:text-white transition-colors leading-snug mb-1">
              {challenge.title}
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed line-clamp-2">
              {challenge.description}
            </p>
          </div>
        </div>

        {/* Footer: difficulty + XP */}
        <div className="flex items-center justify-between gap-2">
          <Badge variant={diff.variant}>{diff.label}</Badge>
          <div
            className={clsx(
              "flex items-center gap-1 text-xs font-semibold",
              challenge.isCompleted ? "text-[#10b981]" : "text-[#6c63ff]",
            )}
          >
            {challenge.isCompleted ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            {challenge.isCompleted ? "Earned" : "Earn"} {challenge.xpReward} XP
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Locked placeholder (not enrolled) ───────────────────────────────────────

interface LockedChallengeCardProps {
  title: string;
}

export function LockedChallengeCard({ title }: LockedChallengeCardProps) {
  return (
    <div className="bg-[#151823] border border-[#2a2d3e] rounded-2xl p-5 opacity-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2a2d3e] flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4 text-[#64748b]" />
        </div>
        <div>
          <p className="text-sm font-medium text-[#64748b]">{title}</p>
          <p className="text-xs text-[#3a3f52]">Enroll to unlock</p>
        </div>
      </div>
    </div>
  );
}
