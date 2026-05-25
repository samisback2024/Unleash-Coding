import { Flame } from "lucide-react";

interface StreakCardProps {
  streak: number;
  className?: string;
}

export function StreakCard({ streak, className = "" }: StreakCardProps) {
  const isHot = streak >= 3;

  return (
    <div
      className={`bg-[#1e2130] border border-[#2a2d3e] rounded-2xl p-5 space-y-3 ${className}`}
    >
      <h3 className="text-sm font-semibold text-[#f1f5f9] flex items-center gap-2">
        <Flame className="w-4 h-4 text-[#f97316]" />
        Daily Streak
      </h3>

      <div className="flex items-end gap-2">
        <span
          className="text-5xl font-bold leading-none"
          style={{ color: isHot ? "#f97316" : "#6c63ff" }}
        >
          {streak}
        </span>
        <span className="text-[#64748b] text-sm pb-1">
          day{streak !== 1 ? "s" : ""}
        </span>
      </div>

      <p className="text-xs text-[#64748b]">
        {streak === 0
          ? "Start your streak by studying today!"
          : streak < 3
            ? "Keep going — 3 days unlocks a badge!"
            : streak < 7
              ? "You're on fire! 7 days earns a special badge."
              : "Legendary! Keep the streak alive."}
      </p>
    </div>
  );
}
