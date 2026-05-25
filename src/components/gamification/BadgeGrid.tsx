import { Trophy } from "lucide-react";
import { AchievementCard } from "./AchievementCard";
import type { UserAchievement } from "@/types";

interface BadgeGridProps {
  achievements: UserAchievement[];
  allAchievements?: {
    id: string;
    name: string;
    icon: string;
    description: string;
  }[];
  className?: string;
}

export function BadgeGrid({
  achievements,
  allAchievements,
  className = "",
}: BadgeGridProps) {
  if (!allAchievements) {
    // Simple grid of earned achievements
    if (achievements.length === 0) {
      return (
        <div
          className={`flex flex-col items-center justify-center py-8 gap-2 ${className}`}
        >
          <Trophy className="w-8 h-8 text-[#2a2d3e]" />
          <p className="text-sm text-[#64748b]">No achievements yet.</p>
          <p className="text-xs text-[#475569]">
            Complete lessons and challenges to unlock badges!
          </p>
        </div>
      );
    }

    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className}`}>
        {achievements.map((ua) => (
          <AchievementCard key={ua.id} achievement={ua} />
        ))}
      </div>
    );
  }

  // Show all with locked/unlocked state
  const earnedIds = new Set(achievements.map((ua) => ua.achievementId));

  return (
    <div
      className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 ${className}`}
    >
      {allAchievements.map((ach) => {
        const earned = earnedIds.has(ach.id);
        const ua = achievements.find((u) => u.achievementId === ach.id);
        return (
          <div
            key={ach.id}
            title={
              earned ? `${ach.name}\n${ach.description}` : `🔒 ${ach.name}`
            }
            className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
              earned
                ? "border-[#6c63ff]/40 bg-[#6c63ff]/5 hover:border-[#6c63ff]/70"
                : "border-[#2a2d3e] opacity-35 grayscale"
            }`}
          >
            <span className="text-2xl">{ach.icon}</span>
            <span className="text-[10px] text-center text-[#94a3b8] leading-tight font-medium">
              {ach.name}
            </span>
            {earned && ua && (
              <span className="text-[9px] text-[#6c63ff]">
                +
                {
                  achievements.find((u) => u.achievementId === ach.id)
                    ?.achievement.xpReward
                }{" "}
                XP
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
