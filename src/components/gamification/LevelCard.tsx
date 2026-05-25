import { Zap } from "lucide-react";
import { getLevelProgress } from "@/lib/levels";
import { XPProgressBar } from "./XPProgressBar";
import { RankTitleBadge } from "./RankTitleBadge";

interface LevelCardProps {
  xp: number;
  className?: string;
}

export function LevelCard({ xp, className = "" }: LevelCardProps) {
  const { level } = getLevelProgress(xp);

  return (
    <div
      className={`bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#6c63ff]" />
          Level & XP
        </h3>
        <RankTitleBadge level={level} />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-14 h-14 shrink-0 rounded-xl bg-[#6c63ff]/15 border border-[#6c63ff]/30 flex flex-col items-center justify-center">
          <span className="text-[10px] font-semibold text-[#6c63ff] uppercase tracking-wider">
            LVL
          </span>
          <span className="text-2xl font-bold text-[#6c63ff] leading-none">
            {level}
          </span>
        </div>
        <div className="flex-1">
          <XPProgressBar xp={xp} />
        </div>
      </div>

      <p className="text-xs text-[#64748b]">
        Complete lessons, challenges, and projects to earn XP and level up.
      </p>
    </div>
  );
}
