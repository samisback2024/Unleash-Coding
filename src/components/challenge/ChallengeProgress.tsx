import { CheckCircle, Circle, Zap, Code2 } from "lucide-react";
import { ProgressBar } from "@/components/ui";

interface ChallengeProgressProps {
  total: number;
  completed: number;
  xpAvailable: number;
  xpEarned: number;
  pathColor: string;
}

export function ChallengeProgress({
  total,
  completed,
  xpAvailable,
  xpEarned,
  pathColor,
}: ChallengeProgressProps) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const remaining = total - completed;

  return (
    <div className="bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Code2 className="w-4 h-4 text-[#6c63ff]" />
        <span className="text-sm font-semibold text-[#f1f5f9]">
          Challenge Progress
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#151823] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-[#10b981]">{completed}</p>
          <p className="text-[10px] text-[#64748b] mt-0.5">Solved</p>
        </div>
        <div className="bg-[#151823] rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-[#f1f5f9]">{remaining}</p>
          <p className="text-[10px] text-[#64748b] mt-0.5">Remaining</p>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#64748b]">Completion</span>
          <span className="font-semibold" style={{ color: pathColor }}>
            {percent}%
          </span>
        </div>
        <ProgressBar value={percent} size="sm" colorClass="bg-[#10b981]" />
      </div>

      {/* XP */}
      <div className="flex items-center justify-between pt-1 border-t border-[#2a2d3e]">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
          <CheckCircle className="w-3.5 h-3.5 text-[#10b981]" />
          XP earned
        </div>
        <span className="text-sm font-bold text-[#6c63ff]">{xpEarned}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-[#64748b]">
          <Zap className="w-3.5 h-3.5 text-[#f59e0b]" />
          XP available
        </div>
        <span className="text-sm font-bold text-[#f59e0b]">{xpAvailable}</span>
      </div>

      {/* Checklist dots */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded flex items-center justify-center"
            title={i < completed ? "Solved" : "Unsolved"}
          >
            {i < completed ? (
              <CheckCircle className="w-4 h-4 text-[#10b981]" />
            ) : (
              <Circle className="w-4 h-4 text-[#2a2d3e]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
