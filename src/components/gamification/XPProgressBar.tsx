import { getLevelProgress } from "@/lib/levels";

interface XPProgressBarProps {
  xp: number;
  showLabel?: boolean;
  className?: string;
}

export function XPProgressBar({
  xp,
  showLabel = true,
  className = "",
}: XPProgressBarProps) {
  const { level, rankTitle, xpForNext, progress } = getLevelProgress(xp);

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#a78bfa] font-medium">
            Level {level} — {rankTitle}
          </span>
          <span className="text-[#64748b]">
            {xp.toLocaleString()} / {xpForNext.toLocaleString()} XP
          </span>
        </div>
      )}
      <div className="w-full h-2 bg-[#2a2d3e] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#6c63ff] to-[#a855f7] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
