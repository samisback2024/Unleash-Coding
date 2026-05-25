import type { UserAchievement } from "@/types";

interface AchievementCardProps {
  achievement: UserAchievement;
}

export function AchievementCard({ achievement: ua }: AchievementCardProps) {
  const { achievement, earnedAt } = ua;
  const date = new Date(earnedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex items-start gap-3 bg-[#0f1117] border border-[#2a2d3e] rounded-xl p-3.5 hover:border-[#6c63ff]/40 transition-colors">
      <span className="text-2xl shrink-0 mt-0.5">{achievement.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#f1f5f9] truncate">
          {achievement.name}
        </p>
        <p className="text-xs text-[#64748b] mt-0.5 leading-snug">
          {achievement.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-[#6c63ff] font-medium">
            +{achievement.xpReward} XP
          </span>
          <span className="text-[10px] text-[#475569]">· {date}</span>
        </div>
      </div>
    </div>
  );
}
